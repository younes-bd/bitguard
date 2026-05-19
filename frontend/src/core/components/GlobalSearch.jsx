import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Command, X, Users, Ticket, 
    FileText, Package, Shield, Settings, 
    ChevronRight, Loader2, ArrowRight
} from 'lucide-react';
import { iamService } from '../api/iamService';
import { crmService } from '../api/crmService';
import { supportService } from '../api/supportService';

const GlobalSearch = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleSearch = useCallback(async (q) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            // Simultaneous search across core modules
            const [users, clients, tickets] = await Promise.all([
                iamService.getUsers({ search: q }).catch(() => []),
                crmService.getClients({ search: q }).catch(() => []),
                supportService.getTickets({ search: q }).catch(() => []),
            ]);

            const combinedResults = [
                ...users.slice(0, 3).map(u => ({ id: u.id, title: u.email, type: 'User', icon: Users, path: `/admin/iam/users/${u.id}` })),
                ...clients.slice(0, 3).map(c => ({ id: c.id, title: c.name, type: 'Client', icon: FileText, path: `/admin/crm/clients/${c.id}` })),
                ...tickets.slice(0, 3).map(t => ({ id: t.id, title: t.subject, type: 'Ticket', icon: Ticket, path: `/admin/support/tickets/${t.id}` })),
            ];

            setResults(combinedResults);
        } catch (error) {
            console.error("Global search failed", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => handleSearch(query), 300);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [results, selectedIndex, onClose]);

    const handleSelect = (result) => {
        navigate(result.path);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Search Bar */}
                <div className="flex items-center px-4 py-4 border-b border-slate-800">
                    <Search className="text-slate-500 mr-3" size={20} />
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Search for clients, tickets, users, or settings..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-lg"
                    />
                    <div className="flex items-center gap-2">
                        {loading && <Loader2 size={16} className="text-blue-500 animate-spin" />}
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ESC</span>
                    </div>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {query.trim() === '' ? (
                        <div className="p-12 text-center space-y-4">
                            <Command size={48} className="text-slate-800 mx-auto" />
                            <div>
                                <p className="text-slate-400 font-medium">Global Command Center Search</p>
                                <p className="text-slate-600 text-xs mt-1">Start typing to search across all 20 modules.</p>
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {results.map((res, i) => {
                                const Icon = res.icon;
                                const isSelected = i === selectedIndex;
                                return (
                                    <div 
                                        key={`${res.type}-${res.id}`}
                                        onClick={() => handleSelect(res)}
                                        onMouseEnter={() => setSelectedIndex(i)}
                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                                            isSelected ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <p className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>{res.title}</p>
                                                <p className={`text-[10px] uppercase tracking-widest font-bold ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                                    {res.type}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={isSelected ? 'text-white' : 'text-slate-700'} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : !loading && (
                        <div className="p-12 text-center text-slate-600 text-sm">
                            No results found for "{query}"
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-[10px] text-slate-500">↑↓</kbd>
                            <span className="text-[10px] text-slate-600 uppercase font-bold">Navigate</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-[10px] text-slate-500">ENTER</kbd>
                            <span className="text-[10px] text-slate-600 uppercase font-bold">Select</span>
                        </div>
                    </div>
                    <div className="text-[10px] text-blue-500/50 font-bold uppercase tracking-tighter">
                        BitGuard AI Search Engine
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
