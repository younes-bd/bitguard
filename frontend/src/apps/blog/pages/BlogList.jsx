import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import blogService from '../../../core/api/blogService';
import SectionDivider from '../../../core/components/SectionDivider';
import PageMeta from '../../../core/components/shared/PageMeta';

const CATEGORIES = ['All', 'Engineering', 'Security', 'Releases', 'Cloud'];

const BlogList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, currentPage: 1 });

    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const fetchPosts = useCallback(async (page = 1, category = 'All') => {
        setLoading(true);
        setError('');
        try {
            const params = { page };
            if (category && category !== 'All') {
                params.category = category.toLowerCase();
            }
            const response = await blogService.getPosts(params);
            // Handle both raw array and DRF paginated {results: []} responses
            if (response.results) {
                setPosts(response.results);
                setPagination({
                    count: response.count || response.results.length,
                    next: response.next,
                    previous: response.previous,
                    currentPage: page
                });
            } else {
                const data = Array.isArray(response) ? response : [];
                setPosts(data);
                setPagination({ count: data.length, next: null, previous: null, currentPage: 1 });
            }
        } catch (err) {
            console.error("Error fetching blog posts:", err);
            setError('Failed to load blog posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(currentPage, activeCategory);
    }, [currentPage, activeCategory, fetchPosts]);

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        const newParams = {};
        if (cat !== 'All') newParams.category = cat.toLowerCase();
        setSearchParams(newParams); // resets page to 1
    };

    const handlePageChange = (page) => {
        const newParams = { page: String(page) };
        if (activeCategory !== 'All') newParams.category = activeCategory.toLowerCase();
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.max(1, Math.ceil(pagination.count / 9)); // Assume 9 per page

    // Estimate reading time from content
    const readTime = (content) => {
        if (!content) return '3 min';
        const words = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
        return `${Math.max(1, Math.ceil(words / 250))} min read`;
    };

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen font-sans selection:bg-sky-500/30 transition-colors duration-300">
            <PageMeta title="Blog" description="Latest news, cybersecurity insights, and product updates from the BitGuard engineering team." />
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
            <section className="py-16">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                                    activeCategory === cat
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-600 dark:hover:bg-slate-700 hover:bg-slate-200 border dark:border-slate-700 border-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

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
                            <p>No articles match the selected category. Try selecting "All" to see everything.</p>
                            {activeCategory !== 'All' && (
                                <button onClick={() => handleCategoryChange('All')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-500 transition-colors">
                                    Show All Posts
                                </button>
                            )}
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
                                            <div className="flex items-center gap-3 text-xs font-bold dark:text-blue-400 text-blue-600 mb-3 tracking-widest uppercase">
                                                <span className="flex items-center gap-1.5">
                                                    <i className="bi bi-calendar3"></i>
                                                    {new Date(post.publish_date || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="text-slate-400">·</span>
                                                <span className="flex items-center gap-1 dark:text-slate-500 text-slate-400">
                                                    <i className="bi bi-clock"></i>
                                                    {readTime(post.content)}
                                                </span>
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

                    {/* Pagination Interface */}
                    {!loading && !error && posts.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t dark:border-slate-800 border-slate-200">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                                    currentPage <= 1
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-300 text-slate-600'
                                }`}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                                        page === currentPage
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-300 text-slate-600'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                                    currentPage >= totalPages
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-300 text-slate-600'
                                }`}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogList;
