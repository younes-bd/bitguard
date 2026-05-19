import React, { useState, useEffect, useRef } from 'react';
import { Plus, CheckSquare, FileText, UserPlus, AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const actions = [
        { label: 'Create Task', icon: CheckSquare, path: '/admin/projects', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'New Quote', icon: FileText, path: '/admin/crm/quotes', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { label: 'Add Lead', icon: UserPlus, path: '/admin/crm/clients', color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Log IT Problem', icon: AlertCircle, path: '/admin/itsm/problems', color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { label: 'Schedule Event', icon: Calendar, path: '/admin/hrm/time', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                title="Quick Actions"
            >
                <Plus size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-slate-800 bg-slate-950/50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Create</p>
                    </div>
                    <div className="p-2 space-y-1">
                        {actions.map((action, idx) => (
                            <button 
                                key={idx}
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate(action.path);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left group"
                            >
                                <div className={`p-1.5 rounded-md ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                                    <action.icon size={14} />
                                </div>
                                <span className="font-medium">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickActions;
