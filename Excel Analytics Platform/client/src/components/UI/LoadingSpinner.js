import React from 'react';
import clsx from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  fullScreen = false, 
  text = 'Loading...',
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={clsx(
        'animate-spin rounded-full border-b-2 border-indigo-600',
        sizeClasses[size],
        className
      )}></div>
      {showText && (
        <p className="mt-4 text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;