import React, { useState, useEffect } from 'react';
import { Menu, Plus, Edit, Trash2, ArrowRight, X } from 'lucide-react';
import websiteService from '../../api/websiteService';

export default function WebsiteMenus() {
    const [menus, setMenus] = useState([]);
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        url: '/',
        website: '',
        parent: '',
        sequence: 10,
        is_mega_menu: false
    });

    useEffect(() => {
        fetchMenusAndWebsites();
    }, []);

    const fetchMenusAndWebsites = async () => {
        try {
            const [menusData, websitesData] = await Promise.all([
                websiteService.getMenus(),
                websiteService.getWebsites()
            ]);
            setMenus(menusData.sort((a, b) => a.sequence - b.sequence));
            setWebsites(websitesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to build tree
    const buildTree = (items) => {
        const rootItems = items.filter(i => !i.parent);
        const mapChildren = (parent) => {
            const children = items.filter(i => i.parent === parent.id);
            return {
                ...parent,
                children: children.map(mapChildren)
            };
        };
        return rootItems.map(mapChildren);
    };

    const menuTree = buildTree(menus);

    const handleOpenModal = (menu = null) => {
        if (menu) {
            setEditingId(menu.id);
            setFormData({
                name: menu.name,
                url: menu.url,
                website: menu.website,
                parent: menu.parent || '',
                sequence: menu.sequence,
                is_mega_menu: menu.is_mega_menu
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                url: '/',
                website: websites.length > 0 ? websites[0].id : '',
                parent: '',
                sequence: 10,
                is_mega_menu: false
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
            // Ensure parent is null if empty string
            const payload = {
                ...formData,
                parent: formData.parent ? parseInt(formData.parent) : null,
                website: parseInt(formData.website)
            };
            if (editingId) {
                await websiteService.updateMenu(editingId, payload);
            } else {
                await websiteService.createMenu(payload);
            }
            fetchMenusAndWebsites();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save menu:", error);
            alert("Error saving menu. Please check your data.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this menu?")) {
            try {
                await websiteService.deleteMenu(id);
                fetchMenusAndWebsites();
            } catch (error) {
                console.error("Failed to delete menu:", error);
                alert("Error deleting menu.");
            }
        }
    };

    const renderMenuNode = (node, depth = 0) => (
        <React.Fragment key={node.id}>
            <tr className="hover:bg-slate-800/20 transition-colors group">
                <td className="p-4 text-white font-medium" style={{ paddingLeft: `${depth * 2 + 1}rem` }}>
                    <div className="flex items-center gap-3">
                        {depth > 0 && <ArrowRight size={14} className="text-slate-500" />}
                        <Menu size={16} className="text-sky-400" />
                        {node.name}
                    </div>
                </td>
                <td className="p-4 text-slate-300">
                    <span className="px-2 py-1 rounded bg-slate-800 text-xs font-mono">{node.url}</span>
                </td>
                <td className="p-4 text-slate-400 text-sm">
                    {node.sequence}
                </td>
                <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(node)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(node.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>
            {node.children && node.children.map(child => renderMenuNode(child, depth + 1))}
        </React.Fragment>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Menu className="text-sky-400" size={28} /> Website Menus
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage navigation menus for the website</p>
                </div>
                <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95">
                    <Plus size={18} /> Create New
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading...</div>
            ) : menus.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500 bg-slate-900/50">
                    <Menu size={40} className="mx-auto mb-3 text-slate-700" />
                    <p className="font-bold text-slate-400">No Website Menus Found</p>
                    <p className="text-sm mt-1">Create your first menu hierarchy.</p>
                </div>
            ) : (
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-800">
                                <th className="p-4 font-medium">Menu Item</th>
                                <th className="p-4 font-medium">URL</th>
                                <th className="p-4 font-medium">Sequence</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {menuTree.map(node => renderMenuNode(node))}
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
                                {editingId ? 'Edit Menu' : 'New Menu'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">Menu Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. About Us"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">URL</label>
                                <input
                                    type="text"
                                    name="url"
                                    required
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="e.g. /about"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
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
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300">Sequence</label>
                                    <input
                                        type="number"
                                        name="sequence"
                                        value={formData.sequence}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">Parent Menu</label>
                                <select
                                    name="parent"
                                    value={formData.parent}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">-- None (Top Level) --</option>
                                    {menus.filter(m => m.id !== editingId).map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-800">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-sky-600/20 active:scale-95">
                                    {editingId ? 'Update Menu' : 'Create Menu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
