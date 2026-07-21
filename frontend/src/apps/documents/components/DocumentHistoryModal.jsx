import React, { useState, useEffect } from 'react';
import documentsService from '../../../core/api/documentsService';
import { X, History, FileText, Download, User, Calendar, Loader2 } from 'lucide-react';

const DocumentHistoryModal = ({ isOpen, onClose, document }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && document) {
            setLoading(true);
            documentsService.getVersions(document.id)
                .then(res => setHistory(res.results || res))
                .catch(err => console.error('Failed to fetch history:', err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, document]);

    if (!isOpen || !document) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-800/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <History className="text-purple-500" size={24} />
                        Version History: {document.title}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10">
                            <Loader2 size={48} className="mx-auto text-purple-500 mb-3 animate-spin" />
                            <p className="text-slate-500 font-medium">Loading version history...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-10">
                            <FileText size={48} className="mx-auto text-slate-700 mb-3" />
                            <p className="text-slate-500 font-medium">No previous versions found for this document.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((version) => (
                                <div key={version.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between group hover:border-purple-500/50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-700 rounded-lg text-purple-400">
                                            <span className="text-xs font-black">v{version.version_number}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-500" />
                                                <span className="text-slate-300 text-sm font-medium">{version.created_by_name || 'System'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar size={14} className="text-slate-500" />
                                                <span className="text-slate-500 text-xs">{new Date(version.created_at).toLocaleString()}</span>
                                            </div>
                                            {version.notes && (
                                                <p className="text-slate-400 text-xs mt-2 bg-slate-900/50 p-2 rounded italic">"{version.notes}"</p>
                                            )}
                                        </div>
                                    </div>
                                    <a 
                                        href={version.attachment?.file} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl transition-all"
                                        title="Download this version"
                                    >
                                        <Download size={18} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-800/20 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors"
                    >
                        Close History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentHistoryModal;
