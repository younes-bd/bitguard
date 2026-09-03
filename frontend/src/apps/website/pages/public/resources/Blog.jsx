import React from 'react';
import PageMeta from '@/core/components/shared/PageMeta';

const Blog = () => {
    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen pt-32 pb-20 transition-colors duration-300">
            <PageMeta title="Enterprise Blog" description="Insights, news, and technical deep-dives from the BitGuard engineering and security teams." />
            
            <div className="container mx-auto px-4 max-w-5xl text-center">
                <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">BitGuard Insights</span>
                <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                    Enterprise IT Blog
                </h1>
                <p className="dark:text-slate-400 text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed mb-16 transition-colors duration-300">
                    Discover the latest trends in cloud architecture, managed IT, and cybersecurity directly from our experts.
                </p>

                <div className="p-16 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-3xl shadow-sm">
                    <div className="w-20 h-20 mx-auto bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
                        <i className="bi bi-journal-text text-4xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">Coming Soon</h2>
                    <p className="dark:text-slate-400 text-slate-600">
                        We are migrating our technical articles and thought leadership pieces to a new enterprise platform. Check back soon for deep-dives into our SOC operations, infrastructure automation, and more.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Blog;
