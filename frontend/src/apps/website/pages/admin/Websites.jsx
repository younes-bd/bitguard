import React, { useState, useEffect } from 'react';
import { Globe, Plus, Edit, Trash2, CheckCircle, XCircle, X } from 'lucide-react';
import websiteService from '../../api/websiteService';

export default function Websites() {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        domain: '',
        language: 'en',
        theme_color: '#3b82f6',
        is_default: false
    });

    useEffect(() => {
        fetchWebsites();
    }, []);

    const fetchWebsites = async () => {
        try {
            const data = await websiteService.getWebsites();
            setWebsites(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (website = null) => {
        if (website) {
            setEditingId(website.id);
            setFormData({
                name: website.name,
                domain: website.domain || '',
                language: website.language || 'en',
                theme_color: website.theme_color || '#3b82f6',
                is_default: website.is_default
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                domain: '',
                language: 'en',
                theme_color: '#3b82f6',
                is_default: false
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await websiteService.updateWebsite(editingId, formData);
            } else {
                await websiteService.createWebsite(formData);
            }
            fetchWebsites();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save website:", error);
            alert("Error saving website. Please check your data.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this website? This action cannot be undone.")) {
            try {
                await websiteService.deleteWebsite(id);
                fetchWebsites();
            } catch (error) {
                console.error("Failed to delete website:", error);
                alert("Error deleting website.");
            }
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Globe className="text-sky-400" size={28} /> Websites
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage multi-website configuration</p>
                </div>
                <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95">
                    <Plus size={18} /> Create New
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading...</div>
            ) : websites.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500 bg-slate-900/50">
                    <Globe size={40} className="mx-auto mb-3 text-slate-700" />
                    <p className="font-bold text-slate-400">No Websites Found</p>
                    <p className="text-sm mt-1">Create your first website to manage domains and languages.</p>
                </div>
            ) : (
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-800">
                                <th className="p-4 font-medium">Website Name</th>
                                <th className="p-4 font-medium">Domain</th>
                                <th className="p-4 font-medium">Language</th>
                                <th className="p-4 font-medium text-center">Default</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {websites.map((site) => (
                                <tr key={site.id} className="hover:bg-slate-800/20 transition-colors group">
                                    <td className="p-4 text-white font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                                            <Globe size={16} className="text-sky-400" />
                                        </div>
                                        {site.name}
                                    </td>
                                    <td className="p-4 text-slate-300">
                                        {site.domain || <span className="text-slate-500 italic">Not set</span>}
                                    </td>
                                    <td className="p-4 text-slate-300 uppercase text-xs font-bold">
                                        {site.language}
                                    </td>
                                    <td className="p-4 text-center">
                                        {site.is_default ? (
                                            <CheckCircle size={18} className="text-emerald-500 mx-auto" />
                                        ) : (
                                            <XCircle size={18} className="text-slate-600 mx-auto" />
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(site)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(site.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white font-['Oswald'] tracking-wide">
                                {editingId ? 'Edit Website' : 'New Website'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">Website Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. My Awesome Site"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">Domain</label>
                                <input
                                    type="text"
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleChange}
                                    placeholder="e.g. https://www.example.com"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="en">English</option>
                                        <option value="fr">French</option>
                                        <option value="es">Spanish</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300">Theme Color</label>
                                    <input
                                        type="color"
                                        name="theme_color"
                                        value={formData.theme_color}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-xl cursor-pointer bg-slate-950 border border-slate-800 p-1"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                                />
                                <label htmlFor="is_default" className="text-sm font-medium text-slate-300 cursor-pointer">
                                    Set as Default Website
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-800">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-sky-600/20 active:scale-95">
                                    {editingId ? 'Update Website' : 'Create Website'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
