import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

const DocumentUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('other');
    const [version, setVersion] = useState('1.0');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (!title) setTitle(selectedFile.name.split('.')[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please select a file');

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('category', category);
        formData.append('version', version);

        try {
            const res = await client.post('documents/vault/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onUploadSuccess(res.data);
            onClose();
            // Reset form
            setFile(null);
            setTitle('');
            setCategory('other');
            setVersion('1.0');
        } catch (err) {
            console.error('Upload failed:', err);
            setError(err.response?.data?.detail || 'Failed to upload document. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-800/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Upload className="text-purple-500" size={24} />
                        Upload Document
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2 font-['Inter']">Document Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Service Agreement 2024"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 font-['Inter']">Category</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="policy">Policy</option>
                                <option value="contract">Contract</option>
                                <option value="invoice">Invoice</option>
                                <option value="manual">Manual</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 font-['Inter']">Initial Version</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-sm font-medium text-slate-400 mb-2 font-['Inter']">File Selection</label>
                        <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors bg-slate-800/30 group">
                            <input
                                type="file"
                                required
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <FileText size={32} className="text-purple-400 mb-2" />
                                    <span className="text-white text-sm font-medium truncate max-w-full px-4">{file.name}</span>
                                    <span className="text-slate-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload size={32} className="text-slate-600 group-hover:text-purple-400 mb-2 transition-colors" />
                                    <span className="text-slate-400 text-sm">Click or drag & drop file</span>
                                    <span className="text-slate-600 text-xs mt-1">PDF, DOCX, ZIP up to 25MB</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading || !file}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={18} />
                                    <span>Complete Upload</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentUploadModal;
