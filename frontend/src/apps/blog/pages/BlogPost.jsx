import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import blogService from '../../../core/api/blogService';
import SectionDivider from '../../../core/components/SectionDivider';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Fetch specific post by slug via the decoupled service
                const response = await blogService.getPostBySlug(slug);
                setPost(response);
                
                // Inject SEO tags to Document Head dynamically
                document.title = `${response.title} | BitGuard Blog`;
                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                    metaDesc = document.createElement('meta');
                    metaDesc.name = "description";
                    document.head.appendChild(metaDesc);
                }
                metaDesc.setAttribute("content", response.meta_description || response.content.replace(/<[^>]*>?/gm, '').substring(0, 160));
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blog post:", err);
                setError('Article not found.');
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen dark:bg-slate-950 bg-slate-50 flex justify-center items-center pt-24">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !post) {
        return <Navigate to="/404" replace />;
    }

    const publishDate = new Date(post.publish_date || post.created_at).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen font-sans selection:bg-sky-500/30 transition-colors duration-300">
            {/* HERO SECTION - ENTERPRISE GRADE */}
            <section className="relative min-h-[50vh] flex items-center pt-32 pb-20 overflow-hidden text-white bg-slate-950 transition-colors duration-300">
                {/* Dynamic Backgrounds */}
                <div className="absolute inset-0 bg-slate-950 z-0"></div>
                
                {/* If featured image exists, show a blurred overlay of it */}
                {post.featured_image && (
                    <div 
                        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center blur-md scale-105"
                        style={{ backgroundImage: `url(${post.featured_image})` }}
                    ></div>
                )}
                
                {/* Glow Effects */}
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
                
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950 z-0"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Eyebrow Label */}
                        <div className="inline-flex flex-wrap items-center justify-center gap-3 mb-6 animate-in fade-in duration-700">
                            <Link to="/blog" className="text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-1 no-underline">
                                <i className="bi bi-arrow-left"></i> Blog Home
                            </Link>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            {post.category && typeof post.category === 'object' && post.category.name && (
                                <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">
                                    {post.category.name}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-white tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {post.title}
                        </h1>
                        
                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 text-sm font-bold animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                    <i className="bi bi-person"></i>
                                </div>
                                <span>{post.author_name || 'BitGuard Team'}</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <div className="flex items-center gap-2">
                                <i className="bi bi-calendar3 text-blue-400"></i>
                                <span>{publishDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STICKY SOCIAL BAR */}
            <div className="sticky top-16 z-40 dark:bg-slate-900/90 bg-white/90 backdrop-blur-xl border-b dark:border-slate-800 border-slate-200 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center h-14">
                    <div className="text-sm font-bold dark:text-slate-400 text-slate-500 uppercase tracking-widest hidden md:block">
                        Share Article
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-center">
                        <button className="w-8 h-8 rounded-full dark:bg-slate-800 bg-slate-100 flex items-center justify-center dark:hover:bg-blue-600 hover:bg-blue-100 hover:text-blue-600 dark:text-slate-300 text-slate-600 cursor-pointer transition-colors border dark:border-slate-700 border-slate-200">
                            <i className="bi bi-twitter-x text-xs"></i>
                        </button>
                        <button className="w-8 h-8 rounded-full dark:bg-slate-800 bg-slate-100 flex items-center justify-center dark:hover:bg-blue-800 hover:bg-blue-100 hover:text-blue-800 dark:text-slate-300 text-slate-600 cursor-pointer transition-colors border dark:border-slate-700 border-slate-200">
                            <i className="bi bi-linkedin text-xs"></i>
                        </button>
                        <button className="w-8 h-8 rounded-full dark:bg-slate-800 bg-slate-100 flex items-center justify-center dark:hover:bg-blue-500 hover:bg-blue-100 hover:text-blue-500 dark:text-slate-300 text-slate-600 cursor-pointer transition-colors border dark:border-slate-700 border-slate-200">
                            <i className="bi bi-facebook text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="container mx-auto px-4 md:px-8 py-16">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Featured Image (If available, otherwise hidden to not take up space) */}
                    {post.featured_image && (
                        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl border dark:border-slate-800 border-slate-200">
                            <img src={post.featured_image} alt={post.title} className="w-full h-auto object-cover" />
                        </div>
                    )}

                    {/* Article Body */}
                    <div className="dark:prose-invert prose prose-lg md:prose-xl prose-slate max-w-none dark:text-slate-300 text-slate-700 marker:text-blue-600 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl">
                        {/* We use dangerouslySetInnerHTML because the rich text editor outputs HTML */}
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-16 pt-8 border-t dark:border-slate-800 border-slate-200 flex flex-wrap gap-2">
                            <span className="text-sm font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mr-4 flex items-center">
                                <i className="bi bi-tags-fill mr-2"></i> Tags:
                            </span>
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded border border-slate-200 dark:border-slate-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Author Bio Section */}
                    <div className="mt-16 flex flex-col md:flex-row items-center md:items-start gap-6 p-8 bg-slate-900 rounded-2xl border border-slate-800 text-center md:text-left">
                        <div className="w-20 h-20 shrink-0 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-3xl uppercase border-2 border-blue-500/30">
                            {post.author_name ? post.author_name.charAt(0) : 'A'}
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2">{post.author_name || 'Admin'}</h4>
                            <p className="text-slate-400 leading-relaxed max-w-2xl">
                                Cybersecurity Engineer and Technology Evangelist at BitGuard. Passionate about enterprise cloud infrastructure, zero-trust architecture, and securing autonomous threat landscapes.
                            </p>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-20 dark:bg-slate-900/50 bg-blue-50/50 rounded-2xl p-8 border dark:border-slate-800 border-blue-100 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors pointer-events-none"></div>
                        <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-4 relative z-10">Secure Your Digital Future</h3>
                        <p className="dark:text-slate-400 text-slate-600 mb-8 max-w-xl mx-auto relative z-10">
                            Ready to implement the strategies discussed in this article? Speak with a BitGuard engineer today to discover how our enterprise platform can protect your organization.
                        </p>
                        <Link to="/contact" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 relative z-10 no-underline">
                            Request Demo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
