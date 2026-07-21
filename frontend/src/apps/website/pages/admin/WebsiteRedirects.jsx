import React, { useState, useEffect } from 'react';
import { Route, Plus, Edit, Trash2, ArrowRight, X } from 'lucide-react';
import websiteService from '../../api/websiteService';

export default function WebsiteRedirects() {
    const [redirects, setRedirects] = useState([]);
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        url_from: '',
        url_to: '',
        type: '301',
        website: '',
        active: true
    });

    useEffect(() => {
        fetchRedirectsAndWebsites();
    }, []);

    const fetchRedirectsAndWebsites = async () => {
        try {
            const [redirectsData, websitesData] = await Promise.all([
                websiteService.getRedirects(),
                websiteService.getWebsites()
            ]);
            setRedirects(redirectsData);
            setWebsites(websitesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (redirect = null) => {
        if (redirect) {
            setEditingId(redirect.id);
            setFormData({
                url_from: redirect.url_from,
                url_to: redirect.url_to,
                type: redirect.type || '301',
                website: redirect.website || (websites.length > 0 ? websites[0].id : ''),
                active: redirect.active !== undefined ? redirect.active : true
            });
        } else {
            setEditingId(null);
            setFormData({
                url_from: '',
                url_to: '',
                type: '301',
                website: websites.length > 0 ? websites[0].id : '',
                active: true
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
            const payload = {
                ...formData,
                website: parseInt(formData.website)
            };
            if (editingId) {
                await websiteService.updateRedirect(editingId, payload);
            } else {
                await websiteService.createRedirect(payload);
            }
            fetchRedirectsAndWebsites();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save redirect:", error);
            alert("Error saving redirect. Please check your data.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this redirect?")) {
            try {
                await websiteService.deleteRedirect(id);
                fetchRedirectsAndWebsites();
            } catch (error) {
                console.error("Failed to delete redirect:", error);
                alert("Error deleting redirect.");
            }
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Route className="text-sky-400" size={28} /> URL Redirects
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage 301 and 302 page redirections</p>
                </div>
                <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95">
                    <Plus size={18} /> Add Redirect
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading...</div>
            ) : redirects.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500 bg-slate-900/50">
                    <Route size={40} className="mx-auto mb-3 text-slate-700" />
                    <p className="font-bold text-slate-400">No Redirects Found</p>
                    <p className="text-sm mt-1">Create URL mapping to prevent broken links.</p>
                </div>
            ) : (
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-800">
                                <th className="p-4 font-medium">URL From</th>
                                <th className="p-4 font-medium">URL To</th>
                                <th className="p-4 font-medium text-center">Type</th>
                                <th className="p-4 font-medium text-center">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {redirects.map((red) => (
                                <tr key={red.id} className="hover:bg-slate-800/20 transition-colors group">
                                    <td className="p-4 text-white font-mono text-sm">{red.url_from}</td>
                                    <td className="p-4 text-sky-400 font-mono text-sm flex items-center gap-2">
                                        <ArrowRight size={14} className="text-slate-500" />
                                        {red.url_to}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="px-2 py-1 rounded bg-slate-800 text-xs font-bold text-slate-300">
                                            {red.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${red.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {red.active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(red)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(red.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
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
                                {editingId ? 'Edit Redirect' : 'New Redirect'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">URL From</label>
                                <input
                                    type="text"
                                    name="url_from"
                                    required
                                    value={formData.url_from}
                                    onChange={handleChange}
                                    placeholder="e.g. /old-page"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">URL To</label>
                                <input
                                    type="text"
                                    name="url_to"
                                    required
                                    value={formData.url_to}
                                    onChange={handleChange}
                                    placeholder="e.g. /new-page"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all font-mono"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="301">301 (Permanent)</option>
                                        <option value="302">302 (Temporary)</option>
                                        <option value="404">404 (Not Found)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300">Website</label>
                                    <select
                                        name="website"
                                        required
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Select...</option>
                                        {websites.map(w => (
                                            <option key={w.id} value={w.id}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                                />
                                <label htmlFor="active" className="text-sm font-medium text-slate-300 cursor-pointer">
                                    Active Redirect
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-800">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-sky-600/20 active:scale-95">
                                    {editingId ? 'Update Redirect' : 'Create Redirect'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
