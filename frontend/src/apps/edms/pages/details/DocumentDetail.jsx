import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, History, Tag, Lock, Unlock, Archive, Clock, User, Trash2, FileText, Loader2, Share2, Copy, Check } from 'lucide-react';
import edmsService from '../../../../core/api/edmsService';

export default function DocumentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareUrl, setShareUrl] = useState(null);
    const [copied, setCopied] = useState(false);

    const fetchDocument = async () => {
        setLoading(true);
        try {
            const res = await edmsService.getDocument(id);
            setDoc(res);
        } catch (err) {
            console.error('Failed to fetch document:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const handleAction = async (actionStr) => {
        try {
            if (actionStr === 'archive') {
                await edmsService.archiveDocument(id);
                fetchDocument();
            } else if (actionStr === 'lock') {
                await edmsService.lockDocument(id);
                fetchDocument();
            } else if (actionStr === 'share') {
                const res = await edmsService.shareDocument(id);
                setShareUrl(window.location.origin + '/api' + res.share_url);
                fetchDocument();
            }
        } catch (err) {
            console.error(`Failed to ${actionStr} document:`, err);
        }
    };

    const copyToClipboard = () => {
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-cyan-500 w-12 h-12" /></div>;
    if (!doc) return <div className="text-center p-20 text-slate-400">Document not found.</div>;

    const isPdf = doc.attachment?.mimetype === 'application/pdf';

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex justify-between items-start bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <div className="space-y-4">
                    <Link to="/admin/edms" className="text-slate-400 hover:text-cyan-400 text-sm font-medium flex items-center gap-2 w-fit transition-colors">
                        <ArrowLeft size={16} /> Back to Vault
                    </Link>
                    <div>
                        <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
                            {doc.attachment?.name || 'Untitled Document'}
                            {doc.is_locked && <Lock size={18} className="text-amber-500" />}
                            {doc.is_archived && <Archive size={18} className="text-slate-500" />}
                        </h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5"><User size={14} /> {doc.owner_name}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(doc.created_at).toLocaleString()}</span>
                            <span className="flex items-center gap-1.5 bg-slate-800 px-2 rounded font-mono text-cyan-400 text-xs">v{doc.version}</span>
                            {doc.workspace_name && <span className="flex items-center gap-1.5 bg-slate-800 px-2 rounded text-slate-300 text-xs">{doc.workspace_name}</span>}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleAction('archive')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${doc.is_archived ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        <Archive size={16} /> {doc.is_archived ? 'Unarchive' : 'Archive'}
                    </button>
                    <button 
                        onClick={() => handleAction('lock')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${doc.is_locked ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        {doc.is_locked ? <Unlock size={16} /> : <Lock size={16} />} 
                        {doc.is_locked ? 'Unlock' : 'Lock'}
                    </button>
                    <button 
                        onClick={() => handleAction('share')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        <Share2 size={16} /> Share
                    </button>
                    <a 
                        href={doc.attachment?.file} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        <Download size={16} /> Download
                    </a>
                </div>
            </div>

            {/* Share Link Modal/Banner */}
            {shareUrl && (
                <div className="bg-cyan-900/30 border border-cyan-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <h4 className="text-cyan-400 font-bold flex items-center gap-2">
                            <Share2 size={16} /> Public Link Generated
                        </h4>
                        <p className="text-sm text-cyan-200 mt-1">Anyone with this link can view the document.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input 
                            type="text" 
                            readOnly 
                            value={shareUrl} 
                            className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg w-96 text-sm focus:outline-none"
                        />
                        <button 
                            onClick={copyToClipboard}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />} 
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content - Preview */}
                <div className="lg:w-3/4 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl min-h-[600px] flex flex-col">
                        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                            <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-cyan-500" /> Document Preview</h3>
                            {isPdf && <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded">PDF Viewer</span>}
                        </div>
                        <div className="flex-1 bg-slate-950/80 p-0 relative">
                            {isPdf ? (
                                <iframe src={doc.attachment?.file} className="w-full h-full min-h-[600px] border-0" title="PDF Preview" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                                    <FileText size={64} className="mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-slate-400">Preview not available for this file type.</p>
                                    <p className="text-sm mt-2">Please download the file to view its contents.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Metadata */}
                <div className="lg:w-1/4 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Properties</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">File Name</span>
                                <span className="text-sm text-slate-300 break-all">{doc.attachment?.name}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Size</span>
                                <span className="text-sm text-slate-300">{(doc.attachment?.file_size / 1024).toFixed(2)} KB</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Type</span>
                                <span className="text-sm text-slate-300">{doc.attachment?.mimetype || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Tags</h3>
                        {doc.tags?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {doc.tags.map(t => (
                                    <span key={t.id} className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-700">
                                        <Tag size={12} style={{ color: t.color || '#3B82F6' }} />
                                        <span className="text-slate-300">{t.name}</span>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-sm text-slate-500 italic">No tags assigned.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
