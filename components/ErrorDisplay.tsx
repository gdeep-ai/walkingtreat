
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg shadow" role="alert" aria-live="assertive">
    <p className="font-bold">An Error Occurred</p>
    <p>{message}</p>
  </div>
);

export default ErrorDisplay;