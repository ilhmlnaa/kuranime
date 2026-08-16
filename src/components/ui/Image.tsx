import React, { useState } from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export const Image: React.FC<ImageProps> = ({ className = '', containerClassName = '', alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#111827] ${containerClassName} ${className}`}>
      <img
        alt={alt ?? ''}
        className={`w-full h-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
      {/* Skeleton / shimmer effect while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-slate-800/40 to-slate-700/40" />
      )}
    </div>
  );
};
