import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs overflow-hidden ${className}`}>
      <Link
        to="/"
        className="flex items-center gap-1.5 text-slate-500 hover:text-[#00a3ff] transition-colors flex-shrink-0"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-1.5 min-w-0">
            <ChevronRight className="w-3 h-3 text-slate-700 flex-shrink-0" />
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="text-slate-500 hover:text-[#00a3ff] transition-colors truncate max-w-[120px] sm:max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-400 font-medium truncate max-w-[150px] sm:max-w-[300px]" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
