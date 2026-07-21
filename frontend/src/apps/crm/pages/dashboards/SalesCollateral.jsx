import React, { useState, useEffect } from 'react';
import { FileText, Download, Loader2, FolderOpen, Image as ImageIcon, Video, File, Search, Presentation } from 'lucide-react';
import documentsService from '../../../../core/api/documentsService';
import DocumentUploadModal from '../../../documents/components/DocumentUploadModal';

export default function SalesCollateral() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const fetchCollateral = async () => {
        setLoading(true);
        try {
            // We fetch all documents. In a real system, we'd filter by workspace_id = "Sales" or tags.
            const res = await documentsService.getDocuments();
            let allDocs = res?.results || res || [];
            
            // Filter to show only files that look like collateral, or just show all for now
            // We'll show all to ensure data is visible, but we can visually style them
            setDocs(allDocs);
        } catch (err) {
            console.error('Failed to fetch collateral:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollateral();
    }, []);

    const filteredDocs = docs.filter(d => 
        (d.attachment?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getFileIcon = (filename) => {
        if (!filename) return <FileText size={24} className="text-cyan-400" />;
        const ext = filename.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return <FileText size={24} className="text-rose-400" />;
        if (['ppt', 'pptx', 'key'].includes(ext)) return <Presentation size={24} className="text-orange-400" />;
        if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) return <ImageIcon size={24} className="text-emerald-400" />;
        if (['mp4', 'mov', 'avi'].includes(ext)) return <Video size={24} className="text-purple-400" />;
        return <File size={24} className="text-cyan-400" />;
    };

    const handleDownload = (doc) => {
        if (doc.attachment?.file) {
            window.open(doc.attachment.file, '_blank');
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                        <FolderOpen className="text-orange-500 w-8 h-8" /> 
                        Sales Collateral & Pitch Decks
                    </h1>
                    <p className="text-slate-400 mt-2 font-['Inter'] text-sm">Access marketing materials, whitepapers, and presentation decks to share with prospects.</p>
                </div>
                <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/30"
                >
                    + Upload Collateral
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                <Search className="text-slate-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Search collateral by name..." 
                    className="bg-transparent border-none focus:outline-none text-white w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                    <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
                </div>
            ) : filteredDocs.length === 0 ? (
                <div className="p-20 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                    <Presentation className="mx-auto w-16 h-16 text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Collateral Found</h3>
                    <p className="text-slate-400">Upload pitch decks or marketing materials to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDocs.map(doc => (
                        <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col shadow-xl">
                            <div className="h-32 bg-slate-800/50 flex items-center justify-center group-hover:bg-slate-800 transition-colors relative">
                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDownload(doc)} className="p-1.5 bg-slate-900 rounded shadow hover:bg-slate-700 text-white">
                                        <Download size={14} />
                                    </button>
                                </div>
                                {getFileIcon(doc.attachment?.name)}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-orange-400 transition-colors">
                                    {doc.attachment?.name || 'Untitled Document'}
                                </h3>
                                <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
                                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                    <span className="font-mono bg-slate-800 px-1.5 rounded">v{doc.version}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <DocumentUploadModal 
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUploadSuccess={() => {
                    setIsUploadOpen(false);
                    fetchCollateral();
                }}
            />
        </div>
    );
}
