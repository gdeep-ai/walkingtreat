import React, { useEffect, useRef, useState } from 'react';
import type { Stop } from '../types';

type LatLngLiteral = { lat: number; lng: number };

interface MapComponentProps {
  stops: Stop[];
}

let scriptLoadingInitiated = false;

const loadGoogleMapsScript = (apiKey: string, callback: () => void) => {
  const existingScript = document.getElementById('googleMapsScript');
  if (existingScript && (window as any).google) {
    callback();
    return;
  }
  
  if (scriptLoadingInitiated) {
    const interval = setInterval(() => {
        if ((window as any).google) {
            clearInterval(interval);
            callback();
        }
    }, 100);
    return;
  }

  scriptLoadingInitiated = true;
  const script = document.createElement('script');
  // The 'routes' library is required for the DirectionsService to function.
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=routes`;
  script.id = 'googleMapsScript';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
  script.onload = () => {
    callback();
  };
  script.onerror = () => {
    console.error("Google Maps script failed to load.");
  }
};

const parseLatLngFromUrl = (url: string): LatLngLiteral | null => {
    if (!url) return null;

    // 1. Match @lat,lng format in the path
    let match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match && match.length >= 3) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }

    // 2. Match !3d(lat)!4d(lng) in a 'data' parameter, common in detailed URLs
    match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (match && match.length >= 3) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    
    // 3. Check for 'll' or 'q' query parameters
    try {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        // 'll' is more reliable, 'q' can sometimes be just a search string
        const ll = params.get('ll') || params.get('q');
        
        if (ll) {
            const coords = ll.split(',');
            if (coords.length === 2) {
                const lat = parseFloat(coords[0]);
                const lng = parseFloat(coords[1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                    return { lat, lng };
                }
            }
        }
    } catch (e) {
        // Not a full URL or parsing failed. Safe to ignore and let function return null.
    }

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ stops }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        setMapError("Configuration error: Google Maps API key is not available.");
        return;
      }

      loadGoogleMapsScript(apiKey, () => {
        if ((window as any).google) {
            setIsScriptLoaded(true);
        } else {
            setMapError("Could not initialize Google Maps.");
        }
      });
    }, []);

    useEffect(() => {
        if (!isScriptLoaded || !mapRef.current) return;

        const google = (window as any).google;
        if (!google) {
            setMapError("Google Maps is not available.");
            return;
        }

        const locations = stops
            .map(stop => ({
                name: stop.name,
                coords: parseLatLngFromUrl(stop.maps_link)
            }))
            .filter(stop => stop.coords !== null) as { name: string; coords: LatLngLiteral }[];

        if (locations.length === 0) {
            setMapError("Could not find valid coordinates for any of the stops.");
            return;
        }
        
        const map = new google.maps.Map(mapRef.current, {
            zoom: 14,
            center: locations[0].coords,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
        });

        if (locations.length === 1) {
            new google.maps.Marker({
                position: locations[0].coords,
                map,
                title: locations[0].name
            });
        } else {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({ 
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: '#c2410c', // amber-700
                    strokeWeight: 4,
                    strokeOpacity: 0.8,
                }
            });
            directionsRenderer.setMap(map);

            const origin = locations[0].coords;
            const destination = locations[locations.length - 1].coords;
            const waypoints = locations.slice(1, -1).map(loc => ({
                location: loc.coords,
                stopover: true,
            }));

            directionsService.route({
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                travelMode: google.maps.TravelMode.WALKING,
            }, (result: any, status: any) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                    locations.forEach((loc, index) => {
                        new google.maps.Marker({
                            position: loc.coords,
                            map,
                            label: `${index + 1}`,
                            title: loc.name,
                        });
                    });
                } else {
                    console.error(`Directions request failed due to ${status}`);
                    const bounds = new google.maps.LatLngBounds();
                    locations.forEach((loc, index) => {
                        new google.maps.Marker({
                            position: loc.coords,
                            map,
                            label: `${index + 1}`,
                            title: loc.name,
                        });
                        bounds.extend(loc.coords);
                    });
                    map.fitBounds(bounds);
                }
            });
        }

    }, [isScriptLoaded, stops]);

    const parsableStops = stops.some(stop => parseLatLngFromUrl(stop.maps_link));

    if (mapError || !parsableStops) {
        return (
            <div className="h-96 flex items-center justify-center bg-stone-100 rounded-lg text-stone-500 p-4 text-center">
                {mapError || "We were unable to determine the locations for these stops to display a map."}
            </div>
        );
    }
    
    if (!isScriptLoaded) {
        return (
             <div className="h-96 flex items-center justify-center bg-stone-100 rounded-lg">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-stone-600">Loading map...</p>
                </div>
            </div>
        )
    }

    return <div ref={mapRef} className="h-96 w-full rounded-lg" />;
};

export default MapComponent;