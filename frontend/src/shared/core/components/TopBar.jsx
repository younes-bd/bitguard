import React, { useState } from 'react';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  Settings,
  LogOut
} from 'lucide-react';

const TopBar = ({ toggleSidebar }) => {
  const [role, setRole] = useState('Admin'); // Mock state
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Left: Logo & Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-white mr-2 transition-colors lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2 group">
          {/* Text Logo - Matching Screenshot EXACTLY */}
          <span
            className="font-['Oswald'] text-2xl font-bold tracking-[2px] text-white block"
            style={{ transform: 'scaleY(1.4)', marginTop: '-4px' }}
          >
            BITGUARD
          </span>

          {/* Vertical Divider */}
          <div className="hidden h-6 w-px bg-slate-700 sm:block mx-3"></div>

          {/* Role Switcher */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              <span>View as:</span>
              <span className="text-white font-bold">{role}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 top-full mt-1 hidden w-40 rounded-md border border-slate-700 bg-slate-800 p-1 shadow-lg group-hover:block">
              {['Admin', 'User'].map(r => (
                <button key={r} onClick={() => setRole(r)} className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-sm">{r}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Global Search (White Pill) */}
      <div className="hidden max-w-xl flex-1 px-8 md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients, tickets, assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border-none bg-white pl-10 pr-10 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-500">
            /
          </div>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-slate-700"></div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right lg:block">
            <span className="text-xs text-slate-400 block">Super Admin</span>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 border border-slate-700 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
