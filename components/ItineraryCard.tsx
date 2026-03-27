import React, { useState, useRef } from 'react';
import type { Itinerary } from '../types.ts';
import StopCard from './StopCard.tsx';
import { Sparkles, DollarSign, MapPin, Map, Mail, Download, Send, Loader2, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const origin = encodeURIComponent(itinerary.stops[0].address);
  const destination = encodeURIComponent(itinerary.stops[itinerary.stops.length - 1].address);
  const waypoints = itinerary.stops.slice(1, -1).map(s => encodeURIComponent(s.address)).join('|');
  const mapsRouteLink = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? '&waypoints=' + waypoints : ''}&travelmode=walking`;

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setIsGeneratingPdf(true);
    try {
      // Scroll to top to avoid capture issues
      window.scrollTo(0, 0);
      // Small delay to ensure all elements are rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFBF5',
        windowWidth: cardRef.current.scrollWidth,
        windowHeight: cardRef.current.scrollHeight
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${itinerary.theme.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress) return;
    
    setEmailStatus('sending');
    try {
      // Generate PDF as base64
      let pdfBase64 = '';
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, { scale: 1.5, useCORS: true });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdfBase64 = pdf.output('datauristring').split(',')[1];
      }

      // Prepare HTML content for email
      const getCategoryEmoji = (category: string) => {
        switch (category) {
          case 'ice-cream': return '🍦';
          case 'cake': return '🍰';
          case 'pizza': return '🍕';
          case 'coffee': return '☕';
          case 'savory': return '🍽️';
          case 'pastry': return '🥐';
          default: return '🍴';
        }
      };

      const htmlContent = `
        <div style="font-family: sans-serif; color: #2D2422; max-width: 600px; margin: 0 auto; background-color: #FFFBF5; padding: 40px; border-radius: 20px;">
          <h1 style="color: #E87A5D; font-size: 28px; margin-bottom: 10px;">${itinerary.theme}</h1>
          <p style="color: #64748b; font-size: 16px; margin-bottom: 30px;">Your custom dessert tour is ready for exploration.</p>
          
          <div style="background: white; padding: 20px; border-radius: 15px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
            <p><strong>Estimated Cost:</strong> ${itinerary.total_estimated_cost}</p>
            <p><strong>Stops:</strong> ${itinerary.stops.length}</p>
          </div>

          <h2 style="font-size: 20px; border-bottom: 2px solid #E87A5D; padding-bottom: 10px; margin-bottom: 20px;">The Itinerary</h2>
          ${itinerary.stops.map((stop, i) => `
            <div style="margin-bottom: 25px; padding-left: 15px; border-left: 3px solid #E87A5D;">
              <h3 style="margin: 0 0 5px 0;">${i + 1}. ${stop.name} ${getCategoryEmoji(stop.category)}</h3>
              <p style="margin: 0; font-size: 14px; color: #64748b;">${stop.address}</p>
              <p style="margin: 5px 0; font-size: 14px; color: #E87A5D; font-weight: bold;">Hours: ${stop.hours_of_operation}</p>
              <p style="margin: 10px 0; font-style: italic; color: #475569;">"${stop.notes}"</p>
            </div>
          `).join('')}

          <div style="margin-top: 40px; text-align: center;">
            <a href="${mapsRouteLink}" style="background-color: #E87A5D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">View Full Walking Route</a>
          </div>
          
          <p style="margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center;">
            Sent with sugar from Dessert (De)Tour. Happy Questing!
          </p>
        </div>
      `;

      const response = await fetch('/api/send-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailAddress,
          htmlContent,
          pdfBase64,
          theme: itinerary.theme
        })
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }
      
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }

      setEmailStatus('success');
      setTimeout(() => {
        if (!data.previewUrl) {
          setShowEmailModal(false);
          setEmailStatus('idle');
          setEmailAddress('');
        }
      }, 2000);
    } catch (error: any) {
      console.error('Email sending failed:', error);
      setEmailStatus('error');
      // Show the actual error message if it's from our API
      if (error.message) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden" ref={cardRef}>
      <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
            <Sparkles className="w-8 h-8 mr-3 text-[#E87A5D] flex-shrink-0" />
            <h3 className="text-2xl font-bold text-[#2D2422]">{itinerary.theme}</h3>
        </div>
        <div className="flex flex-wrap gap-2 no-print">
            <button 
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-full border border-slate-200 transition-colors disabled:opacity-50"
                title="Download as PDF"
            >
                {isGeneratingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2 text-[#E87A5D]" />}
                PDF
            </button>
            {/* 
            <button 
                onClick={() => setShowEmailModal(true)}
                className="inline-flex items-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-full border border-slate-200 transition-colors"
                title="Email this itinerary"
            >
                <Mail className="w-4 h-4 mr-2 text-[#E87A5D]" />
                Email
            </button>
            */}
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-8">
              <div className="flex items-center bg-slate-50 text-slate-700 font-medium px-3 py-1.5 rounded-full border border-slate-200">
                  <DollarSign className="w-4 h-4 mr-1.5 text-[#E87A5D]" />
                  <span>{itinerary.total_estimated_cost}</span>
              </div>
              <div className="flex items-center bg-slate-50 text-slate-700 font-medium px-3 py-1.5 rounded-full border border-slate-200">
                  <MapPin className="w-4 h-4 mr-1.5 text-[#E87A5D]" />
                  <span>{itinerary.stops.length} Stops</span>
              </div>
        </div>
        <div className="space-y-0 relative">
          {itinerary.stops.map((stop, index) => (
            <div key={`${stop.name}-${index}`} className="relative">
              {index < itinerary.stops.length - 1 && (
                <div 
                  className="absolute left-[22px] top-12 bottom-0 w-0.5 z-0"
                  style={{ background: 'linear-gradient(to bottom, rgba(232,122,93,0.3), transparent)' }}
                ></div>
              )}
              <div className="relative z-10 pb-12 last:pb-0">
                <StopCard stop={stop} index={index} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-4 no-print">
            <a 
                href={mapsRouteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#E87A5D] hover:bg-[#D97757] text-white text-base font-medium rounded-full shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all"
                title="View full walking route on Google Maps"
            >
                <Map className="w-5 h-5 mr-2" />
                View Full Route on Maps
            </a>
            {/*
            <button 
                onClick={() => setShowEmailModal(true)}
                className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-base font-medium rounded-full shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all"
            >
                <Send className="w-5 h-5 mr-2" />
                Send to My Email
            </button>
            */}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(15,23,42,0.6)] backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => {
                setShowEmailModal(false);
                setPreviewUrl(null);
                setEmailStatus('idle');
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h4 className="text-2xl font-bold text-[#2D2422] mb-2">Send Itinerary</h4>
            <p className="text-slate-500 text-sm mb-6">We'll send a beautiful HTML email with your walking route and a PDF attachment.</p>
            
            {previewUrl ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h5 className="text-green-800 font-bold mb-2">Email Simulated!</h5>
                <p className="text-green-700 text-sm mb-4">
                  Since SMTP is not configured in this environment, we simulated the email using Ethereal Email.
                </p>
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all"
                >
                  View Email Preview
                </a>
              </div>
            ) : (
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E87A5D] outline-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={emailStatus === 'sending'}
                  className="w-full py-4 bg-[#E87A5D] text-white font-bold rounded-xl hover:bg-[#D97757] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {emailStatus === 'sending' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Quest...
                    </>
                  ) : emailStatus === 'success' ? (
                    'Sent Successfully!'
                  ) : emailStatus === 'error' ? (
                    'Failed to Send. Try Again?'
                  ) : (
                    'Send Itinerary'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryCard;
