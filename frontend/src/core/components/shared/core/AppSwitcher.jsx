import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, LayoutDashboard } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { settingsService } from '../../../../apps/system/api/settingsService';

export default function AppSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [apps, setApps] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && apps.length === 0) {
            settingsService.getModules().then(res => {
                const modules = Array.isArray(res) ? res : res.results || [];
                setApps(modules.filter(m => m.is_installed));
            }).catch(console.error);
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 flex-shrink-0"
                aria-label="App Switcher"
            >
                <Grid size={20} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-[400px] sm:w-[600px] max-h-[80vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-4 custom-scrollbar">
                    <div className="mb-4 pb-2 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Apps</h3>
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="text-xs text-blue-400 hover:text-blue-300 font-bold">
                            View Dashboard
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {apps.map((app, index) => {
                            const Icon = LucideIcons[app.icon] || LayoutDashboard;
                            const path = app.technical_name === 'board' ? '/admin/board' : `/admin/${app.technical_name}`;
                            return (
                                <Link
                                    key={index}
                                    to={path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-800 transition-colors group text-center"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 group-hover:bg-blue-500/20 text-slate-400 group-hover:text-blue-400 flex items-center justify-center mb-2 transition-colors">
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-300 group-hover:text-white leading-tight line-clamp-2">
                                        {app.name}
                                    </span>
                                </Link>
                            );
                        })}
                        {apps.length === 0 && <div className="col-span-full text-center text-slate-500 py-4">Loading apps...</div>}
                    </div>
                </div>
            )}
        </div>
    );
}
