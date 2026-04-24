import React, { useState, useEffect } from 'react';
import { MousePointerClick, Search, Plus, Loader2, Edit2, Trash2 } from 'lucide-react';
import client from '../../../core/api/client';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const LANDING_PAGE_FIELDS = [
    { name: 'title', label: 'Campaign Title', required: true },
    { name: 'slug', label: 'Access Slug', required: true },
    { name: 'is_published', label: 'Published', type: 'toggle' },
    { name: 'content', label: 'Content', type: 'textarea', rows: 4 },
    { name: 'meta_description', label: 'Meta Description', type: 'textarea', rows: 2 }
];

export default function LandingPages() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await client.get('store/landing-pages/');
            setPages(res.data.results || res.data || []);
        } catch (error) {
            console.error("Failed to fetch landing pages:", error);
            toast.error('Failed to fetch landing pages');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedItem) {
                await client.patch(`store/landing-pages/${selectedItem.id}/`, formData);
                toast.success('Landing page updated');
            } else {
                await client.post('store/landing-pages/', formData);
                toast.success('Landing page created');
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            fetchPages();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save landing page');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await client.delete(`store/landing-pages/${selectedItem.id}/`);
            toast.success('Landing page deleted');
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
            fetchPages();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete landing page');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MousePointerClick className="text-sky-400" /> Campaign Pages
                </h1>
                <button 
                    onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                    className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Create Funnel
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search campaign funnels..." className="bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sky-500" />
                    </div>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-sky-500" />
                        Loading marketing domains...
                    </div>
                ) : pages.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 flex flex-col items-center">
                        <MousePointerClick size={48} className="mb-4 text-slate-700" />
                        No standalone landing pages provisioned.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50">
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Campaign Title</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Access Slug</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Status</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {pages.map(page => (
                                <tr key={page.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 text-white font-medium">{page.title}</td>
                                    <td className="px-6 py-4 text-sky-400 font-mono text-xs">/{page.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${page.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {page.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-400">
                                        <button onClick={() => { setSelectedItem(page); setIsModalOpen(true); }} className="hover:text-white mr-3 transition-colors"><Edit2 size={16} /></button>
                                        <button onClick={() => { setSelectedItem(page); setIsDeleteModalOpen(true); }} className="hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
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
                title={selectedItem ? "Edit Landing Page" : "New Landing Page"}
                fields={LANDING_PAGE_FIELDS}
                initialData={selectedItem}
                onSubmit={handleSave}
                loading={actionLoading}
            />
            
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }}
                onConfirm={handleDelete}
                loading={actionLoading}
                title="Delete Landing Page"
                message={`Are you sure you want to delete "${selectedItem?.title}"?`}
            />
        </div>
    );
}
