import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SectionDivider from '../../../core/components/SectionDivider';

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch published posts
                const response = await axios.get('http://127.0.0.1:8000/api/blog/posts/');
                // Depending on DRF pagination, data might be in response.data.results or response.data
                const data = response.data.results || response.data;
                setPosts(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blog posts:", err);
                setError('Failed to load blog posts. Please try again later.');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen font-sans selection:bg-sky-500/30 transition-colors duration-300">
            {/* HERO SECTION */}
            <section className="relative min-h-[40vh] flex flex-col justify-center pt-32 pb-16 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
                <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
                
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold mb-6 uppercase tracking-[0.2em] backdrop-blur-sm">
                        Insights & Updates
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        The BitGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Blog</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Latest news, cybersecurity insights, and product updates from the BitGuard engineering team.
                    </p>
                </div>
            </section>

            <SectionDivider variant="angle" from="dark" to="light" />

            {/* MAIN CONTENT AREA */}
            <section className="py-20 dark:bg-slate-900 bg-white relative z-10 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-32">
                            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-32 dark:text-red-400 text-red-600 font-bold bg-red-500/10 rounded-2xl border border-red-500/20">
                            <i className="bi bi-exclamation-triangle-fill text-3xl block mb-4"></i>
                            {error}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-32 dark:text-slate-400 text-slate-500">
                            <i className="bi bi-journal-x text-5xl block mb-4 opacity-50"></i>
                            <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">No Posts Found</h3>
                            <p>Check back soon for our latest updates and articles.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link to={`/blog/${post.slug}`} key={post.id} className="group block no-underline h-full">
                                    <div className="dark:bg-slate-800/80 bg-white border dark:border-slate-700/50 border-slate-200 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl dark:group-hover:border-blue-500/50 group-hover:border-blue-300 transition-all duration-300 h-full flex flex-col relative transform group-hover:-translate-y-1">
                                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        {/* Image Header */}
                                        <div className="w-full h-52 bg-slate-200 dark:bg-slate-900 relative overflow-hidden">
                                            {post.featured_image ? (
                                                <img 
                                                    src={post.featured_image} 
                                                    alt={post.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                                                    <i className="bi bi-image text-5xl dark:text-slate-700 text-slate-300"></i>
                                                </div>
                                            )}
                                            {/* Category Badge */}
                                            {post.category && typeof post.category === 'object' && post.category.name && (
                                                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 tracking-widest uppercase">
                                                    {post.category.name}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Body */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="text-xs font-bold dark:text-blue-400 text-blue-600 mb-3 tracking-widest uppercase flex items-center gap-2">
                                                <i className="bi bi-calendar3"></i>
                                                {new Date(post.publish_date || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            
                                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                                                {post.title}
                                            </h3>
                                            
                                            {/* Extract text snippet if content is HTML */}
                                            <div className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                                {post.meta_description || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                                            </div>

                                            <div className="mt-auto flex items-center justify-between border-t dark:border-slate-700/50 border-slate-100 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">
                                                        {post.author_name ? post.author_name.charAt(0) : <i className="bi bi-person-fill"></i>}
                                                    </div>
                                                    <span className="text-sm font-bold dark:text-slate-300 text-slate-700">
                                                        {post.author_name || 'Admin'}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold dark:text-blue-400 text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    Read <i className="bi bi-arrow-right-short text-lg"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogList;
