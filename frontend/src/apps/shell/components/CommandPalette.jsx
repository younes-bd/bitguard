import React, { useState, useEffect } from 'react';
import { Search, X, Folder, FileText, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const results = [
    { id: 1, title: 'Create new Invoice', type: 'action', icon: FileText, path: '/accounting/invoices/new' },
    { id: 2, title: 'Manage Users', type: 'setting', icon: User, path: '/settings/users' },
    { id: 3, title: 'General Settings', type: 'setting', icon: Settings, path: '/settings' },
    { id: 4, title: 'Projects Dashboard', type: 'view', icon: Folder, path: '/projects' },
  ].filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            autoFocus
            type="text"
            className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
            placeholder="Search for apps, records, or actions... (Cmd+K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className="w-full flex items-center px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-left rounded-lg transition-colors group"
              >
                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 font-medium">
                  {item.title}
                </span>
                <span className="ml-auto text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-indigo-500">
                  {item.type}
                </span>
              </button>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              No results found for "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
