import React from 'react';
import PromoText from './PromoText';
import ImageGallery from './ImageGallery';

const Welcome: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <PromoText />
      <ImageGallery />
    </div>
  );
};

export default Welcome;
