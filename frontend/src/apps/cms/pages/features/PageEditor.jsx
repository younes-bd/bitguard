import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, Globe, Type, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { cmsApi } from '../../api/cmsApi';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

const PageEditor = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!slug;

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        seo_title: '',
        seo_description: '',
        status: 'draft',
        content: null
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({ openOnClick: false })
        ],
        content: '',
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, content: editor.getJSON() }));
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-6 py-4'
            }
        }
    });

    useEffect(() => {
        if (isEditMode) {
            loadPageOptions();
        }
    }, [slug]);

    const loadPageOptions = async () => {
        try {
            const data = await cmsApi.getPageBySlug(slug);
            setFormData({
                ...data,
                status: data.status || 'draft'
            });
            if (editor && data.content) {
                editor.commands.setContent(data.content);
            }
        } catch (err) {
            setError("Failed to load page data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Update editor content if it loads after editor initialization
    useEffect(() => {
        if (editor && formData.content && !editor.isFocused) {
            editor.commands.setContent(formData.content);
        }
    }, [editor, loading]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'is_published') {
             setFormData(prev => ({ ...prev, status: checked ? 'published' : 'draft' }));
             return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (isEditMode) {
                await cmsApi.updatePage(slug, formData);
            } else {
                await cmsApi.createPage(formData);
            }
            navigate('/admin/cms');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to save page. Please check your data.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400 p-8">Loading Page Data...</div>;

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 pb-20">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <Globe size={20} className="text-red-500/50" />
                    <span>{error}</span>
                </div>
            )}

            {/* Core Settings Layer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-2">
                    <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Type size={16} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Core Properties</h3>
                        <p className="text-xs text-slate-500">The primary identity of this page.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Page Title <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                            placeholder="e.g., About Us"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">URL Slug <span className="text-red-400">*</span></label>
                        <div className="relative flex items-center group/input">
                            <span className="absolute left-4 text-slate-500 group-focus-within/input:text-blue-400 transition-colors">/</span>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                disabled={isEditMode}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="about-us"
                            />
                        </div>
                        <p className="text-[11px] text-slate-500 ml-1 mt-1 font-mono">bitguard.tech/{formData.slug}</p>
                    </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Publishing Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                        >
                            <option value="draft">Draft (Hidden)</option>
                            <option value="published">Published (Live)</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    
                    <label className="flex items-center gap-3 cursor-pointer group/toggle w-fit mt-1 sm:mt-6">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                name="is_published"
                                checked={formData.status === 'published'}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            {formData.status === 'published' ? (
                                <ToggleRight size={32} strokeWidth={1.5} className="text-green-500 peer-focus:ring-4 peer-focus:ring-green-500/20 rounded-full transition-all drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            ) : (
                                <ToggleLeft size={32} strokeWidth={1.5} className="text-slate-600 group-hover/toggle:text-slate-500 transition-colors" />
                            )}
                        </div>
                        <div>
                            <span className={`text-sm font-medium transition-colors ${formData.status === 'published' ? 'text-green-400' : 'text-slate-400'}`}>
                                Quick Toggle: Live
                            </span>
                        </div>
                    </label>
                </div>
            </div>

            {/* SEO Layer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>
                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    <div className="md:w-1/3 space-y-1 mt-1">
                        <div className="flex items-center gap-2 mb-2 text-purple-400">
                           <Globe size={18} />
                           <h3 className="font-semibold text-white">Search Discovery (SEO)</h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed pr-4">How this page appears on search engines and social media platforms when linked.</p>
                    </div>
                    
                    <div className="md:w-2/3 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Meta Title</label>
                            <input
                                type="text"
                                name="seo_title"
                                value={formData.seo_title}
                                onChange={handleChange}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                                placeholder="BitGuard | Enterprise Services"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Meta Description</label>
                            <textarea
                                name="seo_description"
                                value={formData.seo_description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none text-sm leading-relaxed"
                                placeholder="Describe the page content briefly to encourage clicks from search results..."
                            />
                        </div>
                        
                        {/* SEO Preview (Read Only visual flair) */}
                        {formData.seo_title && formData.seo_description && (
                            <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800/80 shadow-inner">
                                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Search Result Preview</p>
                                <div className="space-y-1 font-sans">
                                    <div className="text-sm text-slate-400 tracking-wide font-medium flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                            <span className="text-[10px] text-white font-bold leading-none font-['Oswald'] mt-[-1px]">B</span>
                                        </div>
                                        <span className="truncate">bitguard.tech â€º {formData.slug || 'slug'}</span>
                                    </div>
                                    <div className="text-[17px] text-blue-400 hover:underline cursor-pointer truncate font-medium">
                                        {formData.seo_title}
                                    </div>
                                    <div className="text-sm text-slate-300 leading-snug line-clamp-2">
                                        {formData.seo_description}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Layer (TipTap Editor) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-950/50">
                    <FileText size={18} className="text-blue-400" />
                    <h3 className="font-semibold text-white">Page Content</h3>
                </div>
                
                {editor && (
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 border-b border-slate-800">
                        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-slate-800 ${editor.isActive('bold') ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}><b>B</b></button>
                        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-slate-800 ${editor.isActive('italic') ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}><i>I</i></button>
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-slate-800 ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}>H1</button>
                        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-slate-800 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}>H2</button>
                        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-slate-800 ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}>H3</button>
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-slate-800 ${editor.isActive('bulletList') ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}>• List</button>
                        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-slate-800 ${editor.isActive('orderedList') ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}>1. List</button>
                    </div>
                )}
                
                <div className="bg-slate-950/30 text-slate-300">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/80">
                <button
                    type="button"
                    onClick={() => navigate('/admin/cms')}
                    className="px-5 py-2.5 rounded-lg text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            {isEditMode ? 'Save Changes' : 'Create Page'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default PageEditor;

