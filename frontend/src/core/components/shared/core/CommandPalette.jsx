import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, ArrowRight } from 'lucide-react';
import { adminSections, productMenu } from '../../../api/menu';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Flatten all searchable routes
    const allRoutes = React.useMemo(() => {
        const routes = [];
        // Add admin sections
        adminSections.forEach(section => {
            section.items.forEach(item => {
                if (item.path) {
                    routes.push({ ...item, category: section.title });
                }
            });
        });
        // Add product menu sections
        Object.values(productMenu).forEach(moduleGroups => {
            moduleGroups.forEach(group => {
                group.items.forEach(item => {
                    if (item.path) {
                        routes.push({ ...item, category: group.title });
                    }
                });
            });
        });

        // Deduplicate by path
        const unique = [];
        const seen = new Set();
        for (const r of routes) {
            if (!seen.has(r.path)) {
                seen.add(r.path);
                unique.push(r);
            }
        }
        return unique;
    }, []);

    const [backendResults, setBackendResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Filter based on search term for static routes
    const filteredRoutes = React.useMemo(() => {
        if (!searchTerm) return [];
        const lowerSearch = searchTerm.toLowerCase();
        return allRoutes.filter(r => 
            r.label.toLowerCase().includes(lowerSearch) || 
            (r.category && r.category.toLowerCase().includes(lowerSearch))
        ).slice(0, 5); // Reduced to 5 to make room for backend results
    }, [searchTerm, allRoutes]);

    // Fetch backend results
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 2) {
            setBackendResults([]);
            return;
        }
        
        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                // We need to import boardService at the top of the file.
                // Assuming it's imported correctly.
                const { boardService } = await import('../../../api/boardService');
                const results = await boardService.globalSearch(searchTerm);
                
                // Map backend results to route format
                const mappedResults = results.map(r => ({
                    label: `${r.title} (${r.type.toUpperCase()})`,
                    path: r.url,
                    category: 'Global Data',
                    isData: true
                }));
                setBackendResults(mappedResults);
            } catch (err) {
                console.error("Failed global search", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const combinedResults = React.useMemo(() => {
        return [...filteredRoutes, ...backendResults];
    }, [filteredRoutes, backendResults]);

    // Keyboard shortcut listener (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Arrow key navigation
    const handleKeyDown = (e) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < combinedResults.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selected = combinedResults[selectedIndex];
            if (selected && selected.path) {
                navigate(selected.path);
                setIsOpen(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            
            <div 
                className="relative bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onKeyDown={handleKeyDown}
            >
                <div className="flex items-center px-4 py-4 border-b border-slate-800">
                    <Search className="text-slate-500 mr-3" size={24} />
                    <input 
                        ref={inputRef}
                        type="text"
                        placeholder="Search apps, settings, and global data..."
                        className="flex-1 bg-transparent border-none text-white text-lg focus:outline-none focus:ring-0 placeholder-slate-500"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedIndex(0);
                        }}
                    />
                    <div className="flex gap-1 items-center bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs font-mono">
                        <Command size={12}/> K
                    </div>
                </div>

                {searchTerm && (
                    <div className="max-h-96 overflow-y-auto p-2">
                        {combinedResults.length > 0 ? (
                            <ul className="space-y-1">
                                {combinedResults.map((route, index) => {
                                    const Icon = route.icon || ArrowRight;
                                    const isSelected = index === selectedIndex;
                                    return (
                                        <li key={`${route.path}-${index}`}>
                                            <button 
                                                onClick={() => {
                                                    navigate(route.path);
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isSelected ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-800'}`}>
                                                        <Icon size={18} />
                                                    </div>
                                                    <span className="font-medium text-left">{route.label}</span>
                                                </div>
                                                <span className={`text-xs ${isSelected ? 'text-cyan-200' : 'text-slate-500'}`}>
                                                    {route.category}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <p>No results found for "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                )}
                {!searchTerm && (
                    <div className="p-4 text-xs text-slate-500 flex justify-between items-center bg-slate-900/50">
                        <span>Tip: Type to search through all modules globally.</span>
                        <span className="flex items-center gap-1">Use <kbd className="bg-slate-800 px-1.5 rounded border border-slate-700">↑</kbd> <kbd className="bg-slate-800 px-1.5 rounded border border-slate-700">↓</kbd> to navigate</span>
                    </div>
                )}
            </div>
        </div>
    );
}
