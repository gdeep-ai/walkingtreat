import React from 'react';

interface ImageGalleryProps {
    images: string[];
    loading: boolean;
}

const SkeletonCard: React.FC = () => (
    <div className="aspect-square bg-slate-200/50 rounded-2xl animate-pulse"></div>
);

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, loading }) => {
    return (
        <div className="my-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {loading && (
                    <>
                        {Array.from({ length: 9 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </>
                )}
                {!loading && images.map((src, index) => (
                    <div key={index} className="overflow-hidden rounded-2xl shadow-lg border border-white/50">
                         <img 
                            src={src} 
                            alt={`Generated dessert image ${index + 1}`}
                            className="w-full h-full object-cover aspect-square transition-transform duration-300 hover:scale-105" 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;