import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        'bg-white overflow-hidden shadow rounded-lg border border-gray-200',
        {
          'hover:shadow-lg transition-shadow duration-200 cursor-pointer': hover,
        },
        className
      )}
      {...props}
    >
      <div className={padding ? 'px-4 py-5 sm:p-6' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;