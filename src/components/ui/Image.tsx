import React, { useState } from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export const Image: React.FC<ImageProps> = ({ className = '', containerClassName = '', alt, style, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`} style={style}>
      <img
        alt={alt ?? ''}
        className={`w-full h-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-[#111827]" />
      )}
    </div>
  );
};
