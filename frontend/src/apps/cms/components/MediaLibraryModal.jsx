import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Search, CheckCircle } from 'lucide-react';
import { cmsApi } from '../api/cmsApi';

export default function MediaLibraryModal({ isOpen, onClose, onSelect }) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadAssets();
        }
    }, [isOpen]);

    const loadAssets = async () => {
        setLoading(true);
        try {
            // Simulated fetch from cmsApi.getMediaAssets()
            // In a real implementation, you would call your backend here.
            setTimeout(() => {
                setAssets([
                    { id: 1, filename: 'hero-bg.jpg', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80', file_type: 'image/jpeg', created_at: new Date().toISOString() },
                    { id: 2, filename: 'logo-dark.png', url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80', file_type: 'image/png', created_at: new Date().toISOString() }
                ]);
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // Simulated upload process
            // const formData = new FormData();
            // formData.append('file', file);
            // await cmsApi.uploadMedia(formData);
            
            setTimeout(() => {
                loadAssets();
                setUploading(false);
            }, 1000);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    const filteredAssets = assets.filter(a => a.filename.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <ImageIcon size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Media Library</h2>
                            <p className="text-sm text-slate-400">Select or upload media assets.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-hidden flex flex-col gap-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
                            />
                        </div>
                        <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer">
                            <Upload size={18} />
                            {uploading ? 'Uploading...' : 'Upload File'}
                            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                        </label>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                Loading media assets...
                            </div>
                        ) : filteredAssets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                                <ImageIcon size={48} className="opacity-20" />
                                <p>No media assets found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                                {filteredAssets.map(asset => (
                                    <div 
                                        key={asset.id} 
                                        className="group relative aspect-square bg-slate-950 rounded-xl border border-slate-800 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                                        onClick={() => onSelect(asset)}
                                    >
                                        <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                            <p className="text-xs text-white font-medium truncate">{asset.filename}</p>
                                            <p className="text-[10px] text-slate-400">{new Date(asset.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="absolute top-2 right-2 p-1 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                            <CheckCircle size={16} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
