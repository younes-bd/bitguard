import React, { useState, useEffect } from 'react';
import { Palette, LayoutTemplate, Save, Loader2, Upload } from 'lucide-react';
import client from '../../../core/api/client';
import toast from 'react-hot-toast';

export default function StoreCustomization() {
    const [theme, setTheme] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('store/customization/')
            .then(res => {
                const data = res.data.results?.[0] || res.data?.[0] || res.data;
                setTheme(data || { active_theme: 'default', logo_url: '' });
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = () => {
        const payload = theme;
        const req = payload.id 
            ? client.put(`/store/customization/${payload.id}/`, payload)
            : client.post(`/store/customization/`, payload);

        req.then(res => {
            setTheme(res.data);
            toast.success('Theme published to live storefront');
        }).catch(err => {
            console.error(err);
            toast.error('Failed to commit theme');
        });
    };

    if (loading) return (
        <div className="py-20 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-500" />
            Loading visual templates...
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Palette className="text-purple-400" /> Branding & Theme
                </h1>
                <button 
                    onClick={handleSave}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Save size={16} /> Publish Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                            <LayoutTemplate size={18} /> Architecture Engine
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Active Web Theme</label>
                                <select 
                                    value={theme?.active_theme || 'default'} 
                                    onChange={e => setTheme({...theme, active_theme: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                                >
                                    <option value="default">BitGuard Enterprise (Default)</option>
                                    <option value="midnight">Obsidian Dark Protocol</option>
                                    <option value="cyber">Neon Cyber Defense</option>
                                    <option value="minimal_white">Minimal White Corporate</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Corporate Primary Asset (Logo URL)</label>
                                <input 
                                    type="url" 
                                    placeholder="https://your-cdn.com/logo.webp"
                                    value={theme?.logo_url || ''} 
                                    onChange={e => setTheme({...theme, logo_url: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 font-mono" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="h-32 w-32 rounded-lg border border-dashed border-slate-600 mb-4 flex items-center justify-center overflow-hidden bg-slate-950">
                            {theme?.logo_url ? (
                                <img src={theme.logo_url} alt="Logo Preview" className="max-h-full max-w-full object-contain p-2" />
                            ) : (
                                <Upload className="text-slate-600" size={32} />
                            )}
                        </div>
                        <h3 className="text-white font-medium text-sm mb-1">Logo Manifest</h3>
                        <p className="text-slate-500 text-xs text-balance">Ensure your vectors are uploaded to the primary enterprise CDN via an absolute path URI.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
