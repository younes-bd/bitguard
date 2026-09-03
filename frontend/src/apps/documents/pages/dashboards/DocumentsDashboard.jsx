import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Files, Upload, Archive, Loader2, Download, Filter, Search, MoreVertical, FileText, User, Calendar, Trash2, Shield, History, AlertTriangle, Folder, FolderPlus, Tag, LayoutGrid, List, FileSpreadsheet } from 'lucide-react';
import documentsService from '../../api/documentsService';
import DocumentUploadModal from '../../components/DocumentUploadModal';
import DocumentHistoryModal from '../../components/DocumentHistoryModal';
import { useAuth } from '@/core/hooks/useAuth';

export default function DocumentsDashboard() {
    const location = useLocation();
    const { user } = useAuth();
    
    const [docs, setDocs] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [tags, setTags] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
    
    const [activeWorkspace, setActiveWorkspace] = useState('all');
    const [activeTag, setActiveTag] = useState('all');

    const [docToDelete, setDocToDelete] = useState(null);
    const [workspacePromptOpen, setWorkspacePromptOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');

    const searchParams = new URLSearchParams(location.search);
    const urlFilter = searchParams.get('filter');
    const sourceModule = searchParams.get('source');
    const sourceId = searchParams.get('id');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchMetadata = async () => {
        try {
            const [wsRes, tagsRes] = await Promise.all([
                documentsService.getWorkspaces(),
                documentsService.getTags()
            ]);
            setWorkspaces(wsRes?.results || wsRes || []);
            setTags(tagsRes?.results || tagsRes || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const params = {};
            if (sourceModule) params.source_module = sourceModule;
            if (sourceId) params.source_id = sourceId;
            
            // Server-side filtering
            if (activeWorkspace !== 'all') params.workspace = activeWorkspace;
            if (activeTag !== 'all') params.tag = activeTag;
            if (debouncedSearchTerm) params.search = debouncedSearchTerm;
            
            if (urlFilter === 'my' && user) {
                params.owner = user.id;
            } else if (urlFilter === 'archived') {
                params.is_archived = 'true';
            } else if (urlFilter === 'recent') {
                params.recent_days = '7';
            } else if (!sourceModule || !sourceId) {
                params.is_archived = 'false';
            }
            
            const docsRes = await documentsService.getDocuments(params);
            setDocs(docsRes?.results || docsRes || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetadata();
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [sourceModule, sourceId, activeWorkspace, activeTag, debouncedSearchTerm, urlFilter, user]);

    // We no longer filter locally, the backend handles it.
    const filteredDocs = docs;

    const handleDownload = async (doc) => {
        if (doc.attachment?.file_url) {
            try {
                const response = await fetch(doc.attachment.file_url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = doc.attachment.name || 'download';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (error) {
                console.error('Download failed, falling back to new tab', error);
                window.open(doc.attachment.file_url, '_blank');
            }
        }
    };

    const handleTogglePrivate = async (doc) => {
        try {
            await documentsService.updateDocument(doc.id, { is_private: !doc.is_private });
            fetchDocuments();
        } catch (err) {
            console.error('Toggle private failed:', err);
        }
    };

    const handleDelete = async () => {
        if (!docToDelete) return;
        try {
            await documentsService.deleteDocument(docToDelete);
            setDocToDelete(null);
            fetchDocuments();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const createWorkspace = async () => {
        if (newWorkspaceName.trim()) {
            await documentsService.createWorkspace({ name: newWorkspaceName.trim() });
            setNewWorkspaceName('');
            setWorkspacePromptOpen(false);
            fetchMetadata();
        }
    };

    if (loading && docs.length === 0) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full border-t-cyan-500 animate-spin"></div>
                <Files size={24} className="absolute inset-0 m-auto text-cyan-400" />
            </div>
            <p className="text-slate-400 font-medium font-['Inter']">Securing connections to vault...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar for Workspaces */}
            <div className="lg:w-1/4 space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                        <Files className="text-cyan-500 w-8 h-8" /> 
                        Documents
                    </h1>
                    <p className="text-slate-400 mt-2 font-['Inter'] text-sm">Enterprise Document Management</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                            <Folder size={16} className="text-slate-500" /> Workspaces
                        </h3>
                        <button onClick={() => setWorkspacePromptOpen(true)} className="text-cyan-500 hover:text-cyan-400 p-1 hover:bg-cyan-500/10 rounded">
                            <FolderPlus size={16} />
                        </button>
                    </div>
                    
                    <ul className="space-y-1">
                        <li>
                            <button 
                                onClick={() => setActiveWorkspace('all')}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${activeWorkspace === 'all' && urlFilter !== 'recent' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                All Documents
                                <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{docs.length}</span>
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => { setActiveWorkspace('all'); window.history.replaceState(null, '', '?filter=recent'); }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${urlFilter === 'recent' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                Recent Documents
                            </button>
                        </li>
                        {workspaces.map(ws => (
                            <li key={ws.id}>
                                <button 
                                    onClick={() => { setActiveWorkspace(ws.id); window.history.replaceState(null, '', '?'); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${activeWorkspace === ws.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-slate-800'}`}
                                >
                                    {ws.name}
                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">
                                        {docs.filter(d => d.workspace_id === ws.id).length}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tags Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Tag size={16} className="text-slate-500" /> Filter by Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={() => setActiveTag('all')}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${activeTag === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        >
                            Any Tag
                        </button>
                        {tags.map(tag => (
                            <button 
                                key={tag.id}
                                onClick={() => setActiveTag(tag.id)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${activeTag === tag.id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:w-3/4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-4 border border-slate-800 rounded-2xl">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by document title..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                            <List size={18} />
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/admin/documents/spreadsheet/new"
                            className="bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0"
                            title="Create Spreadsheet"
                        >
                            <FileSpreadsheet size={20}/> 
                            <span className="hidden sm:inline">New Spreadsheet</span>
                        </Link>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all shrink-0"
                        >
                            <Upload size={20}/> 
                            <span>Upload File</span>
                        </button>
                    </div>
                </div>

                {/* Expiry Widget */}
                {(() => {
                    const expiringDocs = docs.filter(d => {
                        if (d.is_archived || !d.expiry_date) return false;
                        const expiry = new Date(d.expiry_date);
                        const now = new Date();
                        const diffTime = expiry - now;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays >= 0 && diffDays <= 30; // expiring in next 30 days
                    }).sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));

                    if (expiringDocs.length === 0) return null;

                    return (
                        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 shadow-xl shadow-rose-900/10">
                            <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2">
                                <AlertTriangle className="animate-pulse" size={20} />
                                Document Expiry Alerts ({expiringDocs.length} expiring within 30 days)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {expiringDocs.map(doc => {
                                    const diffDays = Math.ceil((new Date(doc.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <div key={doc.id} className="bg-rose-500/5 hover:bg-rose-500/10 transition-colors border border-rose-500/20 rounded-xl p-4 flex items-start gap-4">
                                            <div className="p-2.5 bg-rose-500/20 rounded-lg text-rose-400">
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link to={`/admin/documents/documents/${doc.id}`} className="text-white font-semibold text-sm hover:text-rose-400 transition-colors truncate block">
                                                    {doc.attachment?.name || 'Untitled Document'}
                                                </Link>
                                                <p className="text-rose-300/70 text-xs mt-1">
                                                    Expires in {diffDays} {diffDays === 1 ? 'day' : 'days'} ({new Date(doc.expiry_date).toLocaleDateString()})
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

                {/* Main Content View */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                        {loading && (
                            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                                <Loader2 className="animate-spin text-cyan-400" size={32} />
                            </div>
                        )}
                        {filteredDocs.length === 0 && !loading && (
                            <div className="col-span-full p-20 text-center bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-4 bg-slate-800 rounded-full">
                                        <Files size={40} className="text-slate-700" />
                                    </div>
                                    <p className="text-slate-500 font-medium">No documents matching your search criteria.</p>
                                </div>
                            </div>
                        )}
                        {filteredDocs.map(d => (
                            <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/50 transition-all group flex flex-col shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                                        <FileText size={28} className="text-cyan-400" />
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setSelectedDoc(d); setIsHistoryOpen(true); }} className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"><History size={16} /></button>
                                        <button onClick={() => handleDownload(d)} className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"><Download size={16} /></button>
                                        <button onClick={() => setDocToDelete(d.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <Link to={`/admin/documents/documents/${d.id}`} className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
                                    {d.attachment?.name || 'Untitled'}
                                </Link>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(d.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><User size={12} /> {d.owner_name || 'System'}</span>
                                    <span className="font-mono text-cyan-500/70 bg-cyan-500/10 px-1.5 rounded">v{d.version}</span>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-400">{d.workspace_name || 'Unassigned'}</span>
                                    <div className="flex items-center gap-1.5">
                                        {d.is_archived && <Archive size={14} className="text-amber-500" title="Archived" />}
                                        {d.is_locked && <Shield size={14} className="text-rose-500" title="Locked" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                    {loading && (
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Loader2 className="animate-spin text-cyan-400" size={32} />
                        </div>
                    )}
                    <table className="w-full text-left font-['Inter']">
                        <thead>
                            <tr className="bg-slate-950/60 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-800">
                                <th className="p-5">Document Name</th>
                                <th className="p-5">Workspace</th>
                                <th className="p-5">Version</th>
                                <th className="p-5">Owner</th>
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
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredDocs.map((d) => (
                                    <tr key={d.id} className="group hover:bg-cyan-500/5 transition-all">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                                                    <FileText size={20} className="text-cyan-400" />
                                                </div>
                                                <div>
                                                    <Link to={`/admin/documents/documents/${d.id}`} className="text-white font-bold group-hover:text-cyan-400 transition-colors text-base">{d.attachment?.name || 'Untitled'}</Link>
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
                                            <span className="text-sm font-medium text-slate-300">
                                                {d.workspace_name || <span className="text-slate-600">Unassigned</span>}
                                            </span>
                                            {d.tags && d.tags.length > 0 && (
                                                <div className="flex gap-1 mt-1">
                                                    {d.tags.map(t => (
                                                        <span key={t.id} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                                            {t.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-300 font-mono text-sm">v{d.version}</span>
                                                {d.is_archived && <Archive size={14} className="text-amber-500" title="Archived" />}
                                                {d.is_locked && <Shield size={14} className="text-rose-500" title="Locked" />}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                                                    <User size={12} className="text-slate-500" />
                                                </div>
                                                <span className="text-slate-400 text-sm">{d.owner_name || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 pr-2">
                                                <button 
                                                    onClick={() => { setSelectedDoc(d); setIsHistoryOpen(true); }}
                                                    className="p-2 hover:bg-blue-500/10 rounded-lg text-slate-400 hover:text-blue-400 transition-all"
                                                    title="Version History"
                                                >
                                                    <History size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedDoc(d); setIsModalOpen(true); }}
                                                    className="p-2 hover:bg-emerald-500/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-all"
                                                    title="Upload New Version"
                                                >
                                                    <Upload size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDownload(d)}
                                                    className="p-2 hover:bg-cyan-500/10 rounded-lg text-slate-400 hover:text-cyan-400 transition-all tooltip"
                                                    title="Download File"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => setDocToDelete(d.id)} 
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                )}
            </div>

            <DocumentUploadModal 
                isOpen={isModalOpen} 
                existingDoc={selectedDoc}
                workspaces={workspaces}
                tags={tags}
                activeWorkspace={activeWorkspace}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedDoc(null);
                }} 
                onUploadSuccess={() => {
                    fetchDocuments();
                    setIsModalOpen(false);
                    setSelectedDoc(null);
                }}
            />
            <DocumentHistoryModal 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)} 
                document={selectedDoc}
            />
            {/* Workspace Creation Modal */}
            {workspacePromptOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2">Create Workspace</h3>
                            <p className="text-slate-400 text-sm mb-4">Enter a name for the new document workspace.</p>
                            <input
                                type="text"
                                value={newWorkspaceName}
                                onChange={(e) => setNewWorkspaceName(e.target.value)}
                                placeholder="Workspace Name"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                                autoFocus
                            />
                        </div>
                        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
                            <button onClick={() => setWorkspacePromptOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button onClick={createWorkspace} disabled={!newWorkspaceName.trim()} className="px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {docToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertTriangle className="text-red-500" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Delete Document?</h3>
                            <p className="text-slate-400 text-sm mb-6">Are you sure you want to delete this document? This action cannot be undone.</p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setDocToDelete(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
