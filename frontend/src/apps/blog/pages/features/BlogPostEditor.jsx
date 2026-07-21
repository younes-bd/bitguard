import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Globe, FileText, Loader2 } from 'lucide-react';
import blogService from '../../../../core/api/blogService';
import toast from 'react-hot-toast';

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function BlogPostEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        title: '', slug: '', excerpt: '', content: '', category: '',
        tags: '', featured_image: '', meta_description: '', status: 'draft'
    });

    useEffect(() => {
        blogService.getCategories().then(data => setCategories(Array.isArray(data) ? data : [])).catch(() => {});
        if (isEdit) {
            blogService.getPost(id)
                .then(data => {
                    setForm({
                        title: data.title || '',
                        slug: data.slug || '',
                        excerpt: data.excerpt || '',
                        content: data.content || '',
                        category: data.category || '',
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
                        featured_image: data.featured_image || '',
                        meta_description: data.meta_description || '',
                        status: data.status || 'draft',
                    });
                    setLoading(false);
                })
                .catch(() => { toast.error('Failed to load post'); setLoading(false); });
        }
    }, [id]);

    const handleChange = (field, value) => {
        setForm(prev => {
            const updates = { [field]: value };
            if (field === 'title' && !isEdit) updates.slug = slugify(value);
            return { ...prev, ...updates };
        });
    };

    const handleSave = async (publishStatus = null) => {
        if (!form.title.trim()) { toast.error('Title is required'); return; }
        setSaving(true);
        try {
            // Prepare payload
            const payload = { 
                ...form, 
                status: publishStatus || form.status,
                // If tags is a string, convert to array for better backend handling
                tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(t => t) : form.tags
            };
            
            // Remove empty fields that might cause 400s
            if (!payload.category) delete payload.category;
            if (!payload.featured_image) delete payload.featured_image;
            if (isEdit) {
                await blogService.updatePost(id, payload);
                toast.success('Post updated!');
            } else {
                const created = await blogService.createPost(payload);
                toast.success('Post created!');
                navigate(`/admin/blog/${created.id}/edit`, { replace: true });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save post');
        } finally { setSaving(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading post...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/blog')} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">
                            {isEdit ? 'Edit Post' : 'New Post'}
                        </h1>
                        <p className="text-slate-400 text-sm">{isEdit ? `Editing: ${form.title}` : 'Create a new blog post'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleSave('draft')} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                        {saving ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
                        Save Draft
                    </button>
                    <button onClick={() => handleSave('published')} disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50 active:scale-95">
                        {saving ? <Loader2 size={15} className="animate-spin" /> : <Globe size={15} />}
                        Publish
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title *</label>
                            <input value={form.title} onChange={e => handleChange('title', e.target.value)}
                                placeholder="Post title..." type="text"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-semibold placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Slug</label>
                            <input value={form.slug} onChange={e => handleChange('slug', e.target.value)}
                                placeholder="url-friendly-slug" type="text"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 font-mono text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Excerpt</label>
                            <textarea value={form.excerpt} onChange={e => handleChange('excerpt', e.target.value)}
                                placeholder="Short summary shown in listings..." rows={2}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all resize-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Body Content</label>
                            <textarea value={form.content} onChange={e => handleChange('content', e.target.value)}
                                placeholder="Write your post content here..." rows={18}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all resize-y font-mono text-sm leading-relaxed" />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white">Post Settings</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status</label>
                            <select value={form.status} onChange={e => handleChange('status', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                            {categories.length > 0 ? (
                                <select value={form.category} onChange={e => handleChange('category', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all">
                                    <option value="">No category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            ) : (
                                <input value={form.category} onChange={e => handleChange('category', e.target.value)}
                                    placeholder="Category ID..." type="number"
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all" />
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tags</label>
                            <input value={form.tags} onChange={e => handleChange('tags', e.target.value)}
                                placeholder="tag1, tag2, tag3" type="text"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all" />
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white">Media & SEO</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Featured Image URL</label>
                            <input value={form.featured_image} onChange={e => handleChange('featured_image', e.target.value)}
                                placeholder="https://..." type="text"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all" />
                            {form.featured_image && (
                                <img src={form.featured_image} alt="Preview" className="mt-2 rounded-xl w-full h-32 object-cover border border-slate-700" onError={e => e.target.style.display='none'} />
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SEO Meta Description</label>
                            <textarea value={form.meta_description} onChange={e => handleChange('meta_description', e.target.value)}
                                placeholder="160 char SEO summary..." rows={3} maxLength={160}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all resize-none text-sm" />
                            <p className="text-xs text-slate-600 mt-1 text-right">{form.meta_description.length}/160</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

