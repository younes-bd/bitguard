import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map of routes to human readable names if needed
  const routeNameMap = {
    'crm': 'CRM',
    'hr': 'Human Resources',
    'ecommerce': 'E-Commerce',
    'projects': 'Projects'
  };

  return (
    <nav className="flex px-4 py-3 text-sm font-medium border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-gray-700 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const title = routeNameMap[value.toLowerCase()] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {last ? (
                  <span className="ml-1 md:ml-2 text-gray-500 dark:text-gray-500" aria-current="page">
                    {title}
                  </span>
                ) : (
                  <Link to={to} className="ml-1 md:ml-2 text-gray-700 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                    {title}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
