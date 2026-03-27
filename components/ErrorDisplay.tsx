
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  const isRateLimit = message.includes("Whoa, too many dessert lovers");
  
  return (
    <div className={`border-l-4 p-6 rounded-r-xl shadow-sm my-8 max-w-4xl mx-auto flex items-start gap-4 ${isRateLimit ? 'bg-amber-50 border-amber-500 text-amber-900' : 'bg-red-50 border-red-500 text-red-900'}`} role="alert" aria-live="assertive">
      <AlertCircle className={`w-6 h-6 flex-shrink-0 ${isRateLimit ? 'text-amber-500' : 'text-red-500'}`} />
      <div>
        <p className="font-bold mb-1 text-lg">{isRateLimit ? 'High Demand!' : 'An Error Occurred'}</p>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;