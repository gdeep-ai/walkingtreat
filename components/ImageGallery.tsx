import React, { useState, useEffect } from 'react';

// This is our "pre-built repository"
const imageRepository = [
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1978&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571505299873-1d0169213c93?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621939512409-6502b55f1f0a?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1964&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=2070&auto=format&fit=crop'
];

const ImageGallery: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string>('');

    useEffect(() => {
        // Select one random image from the repository on mount
        const randomIndex = Math.floor(Math.random() * imageRepository.length);
        setImageSrc(imageRepository[randomIndex]);
    }, []);

    if (!imageSrc) {
        return null; // Don't render anything until the image is selected
    }

    return (
        <div className="my-12">
            <div className="w-full flex justify-center">
                <img 
                    className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full shadow-xl border-4 border-white/50" 
                    src={imageSrc} 
                    alt="Dessert inspiration" 
                />
            </div>
        </div>
    );
};

export default ImageGallery;