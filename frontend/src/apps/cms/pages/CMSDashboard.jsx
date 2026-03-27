import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Globe, Eye, EyeOff } from 'lucide-react';
import { cmsService } from '../../../core/api/cmsService';

const CMSDashboard = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            setLoading(true);
            const data = await cmsService.getPages();
            setPages(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load pages:", err);
            setError("Could not load pages. Please make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug) => {
        if (window.confirm("Are you sure you want to delete this page?")) {
            try {
                await cmsService.deletePage(slug);
                setPages(pages.filter(p => p.slug !== slug));
            } catch (err) {
                console.error("Failed to delete page:", err);
                alert("Could not delete page.");
            }
        }
    };

    if (loading) return <div className="text-slate-400 p-8">Loading Pages...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Pages</h2>
                <Link
                    to="/admin/cms/pages/new"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={18} />
                    New Page
                </Link>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                    {error}
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400 text-sm">
                            <th className="p-4 font-medium rounded-tl-xl w-[40%]">Title</th>
                            <th className="p-4 font-medium w-[20%]">Slug / URL</th>
                            <th className="p-4 font-medium w-[20%]">Status</th>
                            <th className="p-4 font-medium rounded-tr-xl text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                        {pages.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    <Globe size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No pages found. Create your first page!</p>
                                </td>
                            </tr>
                        ) : (
                            pages.map((page) => (
                                <tr key={page.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{page.title}</div>
                                        <div className="text-xs text-slate-500 truncate max-w-xs">{page.seo_description}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                                            /{page.slug}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${page.is_published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                            {page.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {page.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/admin/cms/pages/${page.slug}/edit`}
                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(page.slug)}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CMSDashboard;
