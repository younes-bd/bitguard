import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, FileText, Trash2, Search, Link as LinkIcon, AlertCircle, HardDrive } from 'lucide-react';
import { cmsService } from '../../api/cmsService';

const MediaLibrary = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {
        try {
            setLoading(true);
            const data = await cmsService.getMediaAssets();
            setAssets(Array.isArray(data) ? data : data.results || []);
            setError(null);
        } catch (err) {
            console.error("Failed to load media:", err);
            setError("Could not load media assets. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('file_type', file.type);
        formData.append('file_size', file.size);

        try {
            const newAsset = await cmsService.uploadMedia(formData);
            setAssets([newAsset, ...assets]);
        } catch (err) {
            console.error("Upload failed:", err);
            setError("Failed to upload the file. Please check file size and format.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this asset?")) return;

        try {
            await cmsService.deleteMediaAsset(id);
            setAssets(assets.filter(a => a.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Could not delete asset.");
        }
    };

    const handleCopyLink = (url) => {
        navigator.clipboard.writeText(url);
        // Optional: show a quick toast notification here
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filteredAssets = assets.filter(a => 
        a.filename.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <ImageIcon className="text-blue-400" /> Media Library
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">Manage images, documents, and assets for your web pages.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm w-64"
                        />
                    </div>
                    <button
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {uploading ? <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></div> : <Upload size={18} />}
                        {uploading ? 'Uploading...' : 'Upload File'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-500/50" />
                    <span>{error}</span>
                </div>
            )}

            {/* Storage Stats Box (Visual Flair) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                     <HardDrive size={20} />
                 </div>
                 <div className="flex-1">
                     <div className="flex justify-between text-sm mb-1">
                         <span className="text-slate-300 font-medium">Storage Usage</span>
                         <span className="text-slate-400">{formatBytes(assets.reduce((acc, a) => acc + (a.file_size || 0), 0))} / 5 GB</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-1.5">
                         <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '2%' }}></div>
                     </div>
                 </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64 text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <p>Loading assets...</p>
                    </div>
                </div>
            ) : filteredAssets.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4">
                        <ImageIcon size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No media files found</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-sm">Upload images and documents here to use them across your pages and blog posts.</p>
                    <button onClick={handleUploadClick} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Upload your first file
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredAssets.map(asset => {
                        const isImage = asset.file_type?.startsWith('image/') || asset.file?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
                        
                        return (
                            <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-blue-500/50 transition-colors flex flex-col">
                                {/* Preview Area */}
                                <div className="aspect-square bg-slate-950 flex items-center justify-center relative overflow-hidden p-2">
                                    {isImage ? (
                                        <img src={asset.file} alt={asset.alt_text || asset.filename} className="max-w-full max-h-full object-contain rounded-md" />
                                    ) : (
                                        <FileText size={48} className="text-slate-600" />
                                    )}
                                    
                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => handleCopyLink(asset.file)}
                                            className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 flex items-center justify-center transition-colors shadow-lg"
                                            title="Copy URL"
                                        >
                                            <LinkIcon size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(asset.id)}
                                            className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Info Area */}
                                <div className="p-3 border-t border-slate-800 flex-1 flex flex-col justify-between bg-slate-900">
                                    <p className="text-sm font-medium text-white truncate" title={asset.filename}>
                                        {asset.filename}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                                            {asset.file_type?.split('/')[1] || 'FILE'}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            {formatBytes(asset.file_size)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MediaLibrary;
