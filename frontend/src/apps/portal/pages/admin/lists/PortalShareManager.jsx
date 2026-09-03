import React, { useState, useEffect } from 'react';
import { Share2, FileText, Globe, Search, Plus, Trash2 } from 'lucide-react';
import { portalService } from '../../../api/portalService';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

export default function PortalShareManager() {
    const [shares, setShares] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        Promise.all([
            portalService.getPortalShares().catch(() => ({ data: [] })),
            client.get('crm/clients/').catch(() => ({ data: [] }))
        ]).then(([sharesRes, clientsRes]) => {
            setShares(sharesRes.data?.results || sharesRes.data || []);
            setClients(clientsRes.data?.results || clientsRes.data || []);
        }).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (shareId) => {
        if (!window.confirm("Are you sure you want to delete this shared resource? It will be removed from the client portal.")) return;
        try {
            await portalService.deletePortalShare(shareId);
            setShares(prev => prev.filter(s => s.id !== shareId));
            toast.success("Share deleted");
        } catch (error) {
            toast.error("Failed to delete share");
        }
    };

    const filteredShares = shares.filter(s => {
        if (!search) return true;
        const q = search.toLowerCase();
        const clientName = (clients.find(c => c.id === s.client_id)?.company_name || '').toLowerCase();
        return s.title?.toLowerCase().includes(q) || clientName.includes(q);
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading shared resources...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Share2 className="text-indigo-400" size={28} /> Shared Resources
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage files, documents, and resources shared to client portals</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-indigo-600/20">
                    <Plus size={16} /> New Share
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by title or client..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                            <tr>
                                <th className="p-4">Resource</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Shared With Client</th>
                                <th className="p-4">Date Shared</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredShares.map(share => (
                                <tr key={share.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
                                                {share.type === 'link' ? <Globe size={16} /> : <FileText size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{share.title}</p>
                                                {share.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-xs">{share.description}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {share.type || 'Document'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {clients.find(c => c.id === share.client_id)?.company_name || 'Global (All Clients)'}
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {new Date(share.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 flex items-center justify-end gap-3">
                                        <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                                            View
                                        </button>
                                        <button onClick={() => handleDelete(share.id)} className="text-xs font-bold text-rose-400 hover:text-rose-300">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredShares.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500 text-sm">No shared resources found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


