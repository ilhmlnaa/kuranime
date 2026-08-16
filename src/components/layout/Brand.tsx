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

  const logoSizes = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
  };

  const content = (
    <>
      <img
        src="/logo.png"
        alt="Kuranime Logo"
        className={`object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${logoSizes[size]}`}
      />
      <div className="flex items-baseline font-bold tracking-tight">
        <span className="text-slate-100 font-extrabold">KURA</span>
        <span className="text-[#00a3ff]">NIME</span>
        <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
      </div>
    </>
  );

  const baseClasses = `group inline-flex items-center font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a3ff] rounded-md transition-opacity hover:opacity-90 active:scale-[0.98] ${sizeClasses[size]} ${className}`;

  if (asDiv) {
    return <div className={baseClasses}>{content}</div>;
  }

  return (
    <Link to="/" className={baseClasses} aria-label="Kuranime Home">
      {content}
    </Link>
  );
};
