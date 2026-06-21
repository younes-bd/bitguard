import React, { useState, useEffect } from 'react';
import { Plus, LayoutTemplate, Globe, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import cmsApi from '../../api/cmsApi';

const LandingPagesManager = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cmsApi.getPages()
            .then(data => {
                setPages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch pages", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <LayoutTemplate className="text-blue-400" size={28} />
                        Landing Pages
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage marketing and promotional landing pages</p>
                </div>
                <Link to="/admin/cms/pages/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                    <Plus size={14} /> Create Page
                </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800 text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">Page Title</th>
                            <th className="px-4 py-3 font-medium">Path / URL</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Views</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan="5" className="px-4 py-4 text-center text-slate-500">Loading pages...</td></tr>
                        ) : pages.length === 0 ? (
                            <tr><td colSpan="5" className="px-4 py-4 text-center text-slate-500">No pages found</td></tr>
                        ) : (
                            pages.map(page => (
                                <tr key={page.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-4">
                                        <div className="font-semibold text-white">{page.title}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Globe size={12} className="text-slate-500" />
                                            /{page.slug}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                            page.is_published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {page.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-400">0</td>
                                    <td className="px-4 py-4 text-right">
                                        <button className="text-slate-400 hover:text-white transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
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

export default LandingPagesManager;
