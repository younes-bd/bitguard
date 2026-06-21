import React, { useState, useRef, useEffect } from 'react';
import { Building, ChevronDown, Check, Server } from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

const TenantSwitcher = () => {
    const { tenant, memberships, switchTenant } = useTenant();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // If there are no memberships or just 1, we might just show the static tenant or hide it.
    // But for MSPs, it's good to show it even if there's only 1 to indicate context.
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors group"
                title="Switch Workspace"
            >
                <div className="w-6 h-6 rounded bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 group-hover:text-indigo-300">
                    <Building size={14} />
                </div>
                <div className="flex flex-col items-start hidden sm:flex">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-0.5">Workspace</span>
                    <span className="text-sm font-medium text-slate-200 leading-none max-w-[120px] truncate">
                        {tenant?.name || 'Loading...'}
                    </span>
                </div>
                <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-300 ml-1" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="p-3 border-b border-slate-800/50 bg-slate-900/30">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Workspace</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-800">
                        {memberships.length > 0 ? (
                            memberships.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => {
                                        switchTenant(m.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                                        tenant?.id === m.id 
                                            ? 'bg-indigo-500/10 border border-indigo-500/20' 
                                            : 'hover:bg-slate-800/50 border border-transparent'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                        tenant?.id === m.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                        <Server size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${tenant?.id === m.id ? 'text-indigo-400' : 'text-slate-200'}`}>
                                            {m.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-mono truncate">{m.domain}</p>
                                    </div>
                                    {tenant?.id === m.id && (
                                        <Check size={16} className="text-indigo-400 shrink-0" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center">
                                <p className="text-sm text-slate-500">No other workspaces available.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantSwitcher;
