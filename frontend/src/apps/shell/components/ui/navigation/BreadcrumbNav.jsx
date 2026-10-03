import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function BreadcrumbNav({ items = [], className = '' }) {
  const navigate = useNavigate();

  return (
    <nav className={`flex items-center space-x-1 ${className}`} aria-label="Breadcrumb">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors mr-2 flex items-center justify-center"
        title="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Breadcrumb Items */}
      <ol className="flex items-center space-x-1 sm:space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                // Current page (not clickable)
                <span className="text-lg font-semibold text-slate-100 line-clamp-1 max-w-xs sm:max-w-sm" aria-current="page">
                  {item.label}
                </span>
              ) : (
                // Parent page link
                <div className="flex items-center">
                  {item.href ? (
                    <Link 
                      to={item.href} 
                      className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-slate-400">
                      {item.label}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 mx-1 sm:mx-2 text-slate-600 flex-shrink-0" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
