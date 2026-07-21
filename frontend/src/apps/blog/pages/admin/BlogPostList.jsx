import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import blogService from '../../../../core/api/blogService';
import DeleteConfirmationModal from '../../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
    published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    draft: 'bg-slate-700 text-slate-400 border-slate-600',
    archived: 'bg-slate-800 text-slate-500 border-slate-700',
};

export default function BlogPostList() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await blogService.getPosts();
            setPosts(Array.isArray(data) ? data : data.results || []);
        } catch { toast.error('Failed to load blog posts'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleTogglePublish = async (post) => {
        try {
            const newStatus = post.status === 'published' ? 'draft' : 'published';
            await blogService.updatePost(post.id, { status: newStatus });
            toast.success(newStatus === 'published' ? 'Post published!' : 'Post moved to draft');
            fetchPosts();
        } catch { toast.error('Failed to update post status'); }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await blogService.deletePost(deleteTarget.id);
            toast.success('Post deleted');
            setDeleteTarget(null);
            fetchPosts();
        } catch { toast.error('Failed to delete post'); }
        finally { setActionLoading(false); }
    };

    if (loading && posts.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading blog posts...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <BookOpen className="text-sky-400" size={28} /> Blog Manager
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage blog posts and content</p>
                </div>
                <button onClick={() => navigate('/admin/blog/new')}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95">
                    <Plus size={18} /> New Post
                </button>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                    <BookOpen size={40} className="mx-auto mb-3 text-slate-700" />
                    <p className="font-bold text-slate-400">No Blog Posts Yet</p>
                    <p className="text-sm mt-1">Create your first post to get started</p>
                    <button onClick={() => navigate('/admin/blog/new')} className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-bold hover:bg-sky-500 transition-colors">Write First Post</button>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Published</th>
                                <th className="p-4">Views</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="p-4">
                                        <p className="text-white font-semibold text-sm">{post.title}</p>
                                        <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{post.excerpt}</p>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">{post.category || '—'}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleTogglePublish(post)}
                                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:opacity-80 ${STATUS_STYLES[post.status] || STATUS_STYLES.draft}`}>
                                            {post.status}
                                        </button>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">{post.published_date ? new Date(post.published_date).toLocaleDateString() : '—'}</td>
                                    <td className="p-4 text-slate-400 text-sm">{post.views || 0}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => navigate(`/admin/blog/${post.id}/edit`)}
                                                className="p-2 hover:bg-sky-500/10 rounded-lg text-slate-500 hover:text-sky-400 transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => setDeleteTarget(post)}
                                                className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <DeleteConfirmationModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={deleteTarget?.title} loading={actionLoading} />
        </div>
    );
}

