import React, { useState, useEffect } from 'react';
import { Files, Upload, Archive, Loader2, Download, Filter, Search, MoreVertical, FileText, User, Calendar, Trash2, Shield } from 'lucide-react';
import client from '../../../core/api/client';
import DocumentUploadModal from '../components/DocumentUploadModal';

export default function DocumentsDashboard() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const fetchDocs = () => {
        setLoading(true);
        client.get('documents/vault/')
            .then(res => setDocs(res.data?.results || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const filteredDocs = docs.filter(doc => {
        const matchesSearch = (doc.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDownload = (doc) => {
        // Simple download trigger
        window.open(doc.file, '_blank');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        try {
            await client.delete(`documents/vault/${id}/`);
            fetchDocs();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const categories = [
        { id: 'all', label: 'All Documents' },
        { id: 'policy', label: 'Company Policy' },
        { id: 'contract', label: 'Legal Contract' },
        { id: 'invoice', label: 'Supplier Invoice' },
        { id: 'manual', label: 'Technical Manual' }
    ];

    if (loading && docs.length === 0) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full border-t-purple-500 animate-spin"></div>
                <Files size={24} className="absolute inset-0 m-auto text-purple-400" />
            </div>
            <p className="text-slate-400 font-medium font-['Inter']">Securing connections to vault...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                        <Files className="text-purple-500 w-10 h-10" /> 
                        Document Vault
                    </h1>
                    <p className="text-slate-400 mt-2 font-['Inter'] text-lg">Central secure repository for enterprise documentation and policy assets.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
                >
                    <Upload size={20}/> 
                    <span>Upload to Vault</span>
                </button>
            </div>

            {/* Quick Stats & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-6">
                    {/* Filters & Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900/50 p-4 border border-slate-800 rounded-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by document title..."
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                            <Filter size={16} className="text-slate-500 shrink-0" />
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                                        activeCategory === cat.id 
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                        {loading && (
                            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                <Loader2 className="animate-spin text-purple-400" size={32} />
                            </div>
                        )}
                        <table className="w-full text-left font-['Inter']">
                            <thead>
                                <tr className="bg-slate-950/60 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-800">
                                    <th className="p-5">Document Name</th>
                                    <th className="p-5">Category</th>
                                    <th className="p-5">Version</th>
                                    <th className="p-5">Uploaded By</th>
                                    <th className="p-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredDocs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-800 rounded-full">
                                                    <Files size={40} className="text-slate-700" />
                                                </div>
                                                <p className="text-slate-500 font-medium">No documents matching your search criteria.</p>
                                                <button onClick={() => {setSearchTerm(''); setActiveCategory('all');}} className="text-purple-400 text-sm hover:underline font-semibold mt-2">Clear all filters</button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDocs.map((d) => (
                                        <tr key={d.id} className="group hover:bg-purple-500/5 transition-all">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                                        <FileText size={20} className="text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold group-hover:text-purple-200 transition-colors">{d.title}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Calendar size={12} className="text-slate-500" />
                                                            <p className="text-xs text-slate-500">
                                                                {new Date(d.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    d.category === 'policy' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    d.category === 'contract' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    d.category === 'invoice' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                }`}>
                                                    {d.category}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-300 font-mono text-sm">v{d.version}</span>
                                                    {d.is_archived && <Archive size={14} className="text-slate-600" />}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                                                        <User size={12} className="text-slate-500" />
                                                    </div>
                                                    <span className="text-slate-400 text-sm">{d.uploaded_by_name || 'System'}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2 pr-2">
                                                    <button 
                                                        onClick={() => handleDownload(d)}
                                                        className="p-2 hover:bg-purple-500/10 rounded-lg text-slate-400 hover:text-purple-400 transition-all tooltip"
                                                        title="Download File"
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(d.id)}
                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-500 transition-all"
                                                        title="Delete permanently"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/10 rounded-2xl p-6 backdrop-blur-xl">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Shield className="text-purple-400" size={18} /> Vault Security
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Isolated Tenants</span>
                                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Encryption at Rest</span>
                                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">AES-256</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Version Archiving</span>
                                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">Enabled</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4">Quick Insights</h3>
                        <div className="space-y-5">
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-black tracking-widest mb-1">Categories</p>
                                <p className="text-2xl font-['Outfit'] text-white">{[...new Set(docs.map(d => d.category).filter(Boolean))].length}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-black tracking-widest mb-1">Total Documents</p>
                                <p className="text-2xl font-['Outfit'] text-white">{docs.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            <DocumentUploadModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onUploadSuccess={() => {
                    fetchDocs();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}
