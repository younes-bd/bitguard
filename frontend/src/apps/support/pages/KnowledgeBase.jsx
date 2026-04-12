import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, ChevronRight, Tag, Loader2, Edit2, Trash2 } from 'lucide-react';
import client from '../../../core/api/client';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';

const KnowledgeBase = () => {
    const [search, setSearch] = useState('');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchArticles = () => {
            setLoading(true);
            client.get('support/articles/')
                .then(res => {
                    const data = res.data.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
                    setArticles(data);
                })
                .catch(err => console.error("Failed to load articles", err))
                .finally(() => setLoading(false));
        };
        fetchArticles();
    }, []);

    const fetchOnlyArticles = async () => {
        try {
            const res = await client.get('support/articles/');
            const data = res.data.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
            setArticles(data);
        } catch (error) {
            console.error("Failed to load articles", error);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedArticle) {
                await client.put(`support/articles/${selectedArticle.id}/`, formData);
            } else {
                await client.post('support/articles/', formData);
            }
            setIsModalOpen(false);
            await fetchOnlyArticles();
        } catch (error) {
            alert('Failed to save article');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedArticle) return;
        setActionLoading(true);
        try {
            await client.delete(`support/articles/${selectedArticle.id}/`);
            setIsDeleteModalOpen(false);
            await fetchOnlyArticles();
        } catch (error) {
            alert('Failed to delete article');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const ARTICLE_FIELDS = [
        { name: 'title', label: 'Title', required: true },
        { name: 'category', label: 'Category', type: 'select', options: [
            { value: 'Account', label: 'Account' },
            { value: 'Security', label: 'Security' },
            { value: 'Contracts', label: 'Contracts' },
            { value: 'Support', label: 'Support' },
            { value: 'MSP', label: 'MSP' },
            { value: 'General', label: 'General' }
        ], default: 'General' },
        { name: 'content', label: 'Content', type: 'textarea', required: true }
    ];

    const filtered = articles.filter(a =>
        (a.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.category || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Knowledge Base</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Self-service articles and guides</p>
                </div>
                <button onClick={() => { setSelectedArticle(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /> New Article
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
                {['All', 'Account', 'Security', 'Contracts', 'Support', 'MSP'].map(cat => (
                    <button key={cat}
                        onClick={() => setSearch(cat === 'All' ? '' : cat)}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:border-blue-500/50 hover:text-blue-400 transition-colors">
                        {cat}
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                {loading ? (
                    <div className="py-16 text-center text-slate-500">
                        <Loader2 size={36} className="mx-auto mb-2 animate-spin text-blue-500" />
                        Loading knowledge base...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center text-slate-500">
                        <BookOpen size={36} className="mx-auto mb-2 opacity-30" />
                        No articles found
                    </div>
                ) : filtered.map(article => (
                    <div key={article.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/40 transition-colors cursor-pointer group">
                        <div className="flex items-start gap-4">
                            <BookOpen size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="text-white font-medium group-hover:text-blue-400 transition-colors">{article.title || `Article #${article.id}`}</div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                        <Tag size={10} /> {article.category || 'General'}
                                    </span>
                                    <span className="text-xs text-slate-500">{(article.views || 0).toLocaleString()} views</span>
                                    <span className="text-xs text-slate-600">Updated {new Date(article.updated_at || article.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedArticle(article); setIsModalOpen(true); }}
                                    className="p-1.5 opacity-0 group-hover:opacity-100 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedArticle(article); setIsDeleteModalOpen(true); }}
                                    className="p-1.5 opacity-0 group-hover:opacity-100 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400 transition-colors ml-2" />
                            </div>
                        </div>
                    ))}
                </div>
            
            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Knowledge Base Article"
                fields={ARTICLE_FIELDS}
                initialData={selectedArticle}
                onSubmit={handleSave}
                loading={actionLoading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Article"
                message={`Are you sure you want to delete ${selectedArticle?.title}?`}
                loading={actionLoading}
            />
        </div>
    );
};

export default KnowledgeBase;
