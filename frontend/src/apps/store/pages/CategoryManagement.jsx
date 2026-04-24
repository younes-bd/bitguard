import React, { useState, useEffect } from 'react';
import { Layers, Search, Plus, Loader2, Edit2, Trash2 } from 'lucide-react';
import client from '../../../core/api/client';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const CATEGORY_FIELDS = [
    { name: 'name', label: 'Name', required: true },
    { name: 'slug', label: 'Slug', required: true },
    { name: 'is_visible', label: 'Visible', type: 'toggle' },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3 }
];

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await client.get('store/categories/');
            setCategories(res.data.results || res.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedItem) {
                await client.patch(`store/categories/${selectedItem.id}/`, formData);
                toast.success('Category updated');
            } else {
                await client.post('store/categories/', formData);
                toast.success('Category created');
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save category');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await client.delete(`store/categories/${selectedItem.id}/`);
            toast.success('Category deleted');
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete category');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Layers className="text-blue-400" /> Categories
                </h1>
                <button 
                    onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Add Category
                </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search categories..." className="bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
                        Loading catalog hierarchies...
                    </div>
                ) : categories.length === 0 ? (
                    <div className="py-20 text-center text-slate-500">
                        No categories found.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50">
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Name</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Slug</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Visibility</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 text-white font-medium">{cat.name}</td>
                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{cat.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${cat.is_visible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {cat.is_visible ? 'Visible' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-400">
                                        <button onClick={() => { setSelectedItem(cat); setIsModalOpen(true); }} className="hover:text-white mr-3"><Edit2 size={16} /></button>
                                        <button onClick={() => { setSelectedItem(cat); setIsDeleteModalOpen(true); }} className="hover:text-red-400"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
                title={selectedItem ? "Edit Category" : "New Category"}
                fields={CATEGORY_FIELDS}
                initialData={selectedItem}
                onSubmit={handleSave}
                loading={actionLoading}
            />
            
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }}
                onConfirm={handleDelete}
                loading={actionLoading}
                title="Delete Category"
                message={`Are you sure you want to delete "${selectedItem?.name}"?`}
            />
        </div>
    );
}
