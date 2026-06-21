import React, { useState } from 'react';
import { X, UploadCloud, File, AlertCircle } from 'lucide-react';
import edmsService from '../../../core/api/edmsService';

export default function DocumentUploadModal({ isOpen, onClose, onUploadSuccess, existingDoc, workspaces = [], tags = [] }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [workspaceId, setWorkspaceId] = useState('');
    const [tagIds, setTagIds] = useState([]);
    const [notes, setNotes] = useState('');
    const [version, setVersion] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);

    if (!isOpen) return null;

    const handleTagChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setTagIds(selected);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file && !existingDoc) {
            setError('Please select a file to upload');
            return;
        }

        setLoading(true);
        setError('');
        setProgress(0);

        try {
            const formData = new FormData();
            if (file) formData.append('file', file);
            
            if (existingDoc) {
                if (notes) formData.append('notes', notes);
                if (version) formData.append('version', version);
                
                await edmsService.bumpVersion(existingDoc.id, formData, (evt) => {
                    if (evt.total) setProgress(Math.round((evt.loaded * 100) / evt.total));
                });
            } else {
                if (title) formData.append('title', title);
                if (workspaceId) formData.append('workspace_id', workspaceId);
                tagIds.forEach(id => formData.append('tag_ids', id));
                
                await edmsService.uploadDocument(formData, (evt) => {
                    if (evt.total) setProgress(Math.round((evt.loaded * 100) / evt.total));
                });
            }
            
            setFile(null);
            setTitle('');
            setWorkspaceId('');
            setTagIds([]);
            setNotes('');
            setVersion('');
            onUploadSuccess();
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to upload document. Please check the network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-white font-['Outfit']">
                        {existingDoc ? 'Upload New Version' : 'Upload to EDMS'}
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6">
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleUpload} className="space-y-5">
                        
                        {!existingDoc && (
                            <>
                                <div>
                                    <label className="block text-slate-400 text-sm font-semibold mb-2">Document Title</label>
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                        placeholder="Leave blank to use filename"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm font-semibold mb-2">Workspace</label>
                                        <select 
                                            value={workspaceId}
                                            onChange={(e) => setWorkspaceId(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                        >
                                            <option value="">Unassigned</option>
                                            {workspaces.map(ws => (
                                                <option key={ws.id} value={ws.id}>{ws.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm font-semibold mb-2">Tags</label>
                                        <select 
                                            multiple
                                            value={tagIds}
                                            onChange={handleTagChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all h-[52px]"
                                        >
                                            {tags.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {existingDoc && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm font-semibold mb-2">New Version</label>
                                    <input 
                                        type="text" 
                                        value={version}
                                        onChange={(e) => setVersion(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder={`e.g. ${(parseFloat(existingDoc.version) + 0.1).toFixed(1)}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm font-semibold mb-2">Changelog Notes</label>
                                    <input 
                                        type="text" 
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="What changed?"
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-slate-400 text-sm font-semibold mb-2">File Payload</label>
                            <label className={`w-full border-2 border-dashed ${file ? 'border-cyan-500 bg-cyan-500/5' : 'border-slate-700 hover:border-slate-500 bg-slate-950'} rounded-2xl flex flex-col items-center justify-center py-10 px-4 cursor-pointer transition-all`}>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                {file ? (
                                    <>
                                        <div className="p-3 bg-cyan-500/20 rounded-full mb-3">
                                            <File className="text-cyan-400" size={32} />
                                        </div>
                                        <p className="text-white font-bold text-center">{file.name}</p>
                                        <p className="text-slate-400 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3 bg-slate-800 rounded-full mb-3">
                                            <UploadCloud className="text-slate-400" size={32} />
                                        </div>
                                        <p className="text-white font-bold text-center mb-1">Click to browse or drag & drop</p>
                                        <p className="text-slate-500 text-sm text-center">PDF, DOCX, XLSX, PNG (Max 50MB)</p>
                                    </>
                                )}
                            </label>
                        </div>
                        
                        {loading && (
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-cyan-500 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                        
                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className={`px-6 py-2.5 rounded-xl font-bold text-slate-950 shadow-lg transition-all flex items-center justify-center gap-2 ${loading || !file ? 'bg-cyan-500/50 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 hover:scale-105 shadow-cyan-500/30'}`}
                                disabled={loading || (!file && !existingDoc)}
                            >
                                {loading ? <><Loader2 size={18} className="animate-spin" /> Uploading...</> : 'Secure Upload'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
