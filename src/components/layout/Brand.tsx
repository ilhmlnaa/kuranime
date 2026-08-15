import React from 'react';
import { Link } from 'react-router-dom';

export interface BrandProps {
  /** Optional custom class names */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disable link behavior if true */
  asDiv?: boolean;
}

export const Brand: React.FC<BrandProps> = ({
  className = '',
  size = 'md',
  asDiv = false,
}) => {
  const sizeClasses = {
    sm: 'text-lg gap-2',
    md: 'text-xl gap-2.5',
    lg: 'text-2xl gap-3',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  const content = (
    <>
      <div className={`relative flex items-center justify-center rounded-lg bg-gradient-to-br from-[#38bdf8] via-[#00a3ff] to-[#0284c7] p-1.5 shadow-md shadow-[#00a3ff]/20 ${iconSizes[size]}`}>
        <svg
          className="w-full h-full text-slate-950 stroke-[2.5]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" className="opacity-90" />
        </svg>
      </div>
      <div className="flex items-baseline font-bold tracking-tight">
        <span className="text-slate-100 font-extrabold">KURA</span>
        <span className="text-[#00a3ff]">NIME</span>
        <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
      </div>
    </>
  );

  const baseClasses = `inline-flex items-center font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a3ff] rounded-md transition-opacity hover:opacity-90 active:scale-[0.98] ${sizeClasses[size]} ${className}`;

  if (asDiv) {
    return <div className={baseClasses}>{content}</div>;
  }

  return (
    <Link to="/" className={baseClasses} aria-label="Kuranime Home">
      {content}
    </Link>
  );
};
