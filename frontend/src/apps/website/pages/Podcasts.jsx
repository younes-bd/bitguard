import React from 'react';
import SectionDivider from '../../../core/components/SectionDivider';
import PageMeta from '../../../core/components/shared/PageMeta';

const Podcasts = () => {
    const episodes = [
        {
            id: 1,
            title: "Ep. 42: The future of Managed SIEM",
            guest: "Dr. Sarah Chen, CISO at TechFlow",
            duration: "45 min",
            date: "Jan 12, 2026",
            description: "We discuss why traditional SIEM involves too much noise and how managed solutions are using AI to filter false positives.",
            image: "/assets/images/home/unified.jpg"
        },
        {
            id: 2,
            title: "Ep. 41: Cloud Security Myths Debunked",
            guest: "James Wilson, AWS Solutions Architect",
            duration: "38 min",
            date: "Dec 28, 2025",
            description: "Is the cloud really less secure than on-prem? James breaks down the shared responsibility model.",
            image: "/assets/images/home/security-ops.jpg"
        },
        {
            id: 3,
            title: "Ep. 40: Ransomware Retrospective 2025",
            guest: "BitGuard Threat Intel Team",
            duration: "52 min",
            date: "Dec 15, 2025",
            description: "A look back at the biggest attacks of the year and what we can learn from them.",
            image: "/assets/images/home/ai-models.png"
        }
    ];

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen dark:text-slate-300 text-slate-600 font-sans transition-colors duration-300">
            <PageMeta title="Podcasts" description="Listen to BitGuard Tech Talks — weekly conversations with cybersecurity leaders, innovators, and white-hat hackers." />
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b dark:from-blue-900/20 from-blue-100 dark:to-slate-950 to-slate-50 pointer-events-none transition-colors duration-300"></div>
                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-5xl text-white shadow-2xl shadow-blue-500/30 mb-8 rotate-3">
                        <i className="bi bi-mic-fill"></i>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                        BitGuard <span className="text-blue-500">Tech Talks</span>
                    </h1>
                    <p className="text-xl dark:text-slate-400 text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed transition-colors duration-300">
                        Weekly conversations with cybersecurity leaders, innovators, and white-hat hackers.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 rounded-full bg-[#1db954] text-white font-bold hover:brightness-110 transition-all flex items-center gap-2">
                            <i className="bi bi-spotify"></i> Listen on Spotify
                        </button>
                        <button className="px-6 py-3 rounded-full bg-[#8e24aa] text-white font-bold hover:brightness-110 transition-all flex items-center gap-2">
                            <i className="bi bi-apple"></i> Apple Podcasts
                        </button>
                    </div>
                </div>
            </section>

            {/* Episodes List */}
            <section className="py-20 container mx-auto px-4 max-w-4xl">
                <div className="space-y-6">
                    {episodes.map(ep => (
                        <div key={ep.id} className="dark:bg-slate-900/50 bg-white shadow-sm border dark:border-slate-800 border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 dark:hover:border-slate-700 hover:border-slate-300 hover:shadow-md transition-all duration-300 group">
                            <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden relative">
                                <img src={ep.image} alt={ep.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => e.target.src = 'https://placehold.co/300x300/1e293b/white?text=Podcast'} />
                                <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <i className="bi bi-play-circle-fill text-5xl text-white drop-shadow-lg"></i>
                                </button>
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-4 text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-2 transition-colors duration-300">
                                    <span>{ep.date}</span>
                                    <span>&bull;</span>
                                    <span>{ep.duration}</span>
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2 dark:group-hover:text-blue-400 group-hover:text-blue-600 transition-colors duration-300">{ep.title}</h3>
                                <p className="dark:text-indigo-400 text-indigo-600 text-sm font-semibold mb-4 transition-colors duration-300">Guest: {ep.guest}</p>
                                <p className="dark:text-slate-400 text-slate-600 leading-relaxed mb-6 transition-colors duration-300">{ep.description}</p>
                                <div className="flex gap-4">
                                    <button className="text-sm font-bold dark:text-white text-slate-900 dark:bg-slate-800 bg-slate-100 px-4 py-2 rounded-lg dark:hover:bg-slate-700 hover:bg-slate-200 transition-colors duration-300">
                                        <i className="bi bi-play-fill mr-1"></i> Play Episode
                                    </button>
                                    <button className="text-sm font-bold dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 transition-colors px-2 duration-300">
                                        <i className="bi bi-share-fill mr-2"></i> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            
            <SectionDivider variant="angle" from="light" to="dark" />

            {/* Dark CTA Section */}
            <section className="py-24 dark:bg-slate-950 bg-slate-900 text-white text-center relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight transition-colors duration-300">Never Miss an Episode</h2>
                    <p className="dark:text-slate-400 text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed transition-colors duration-300">
                        Subscribe to the BitGuard Security Podcast and get expert insights delivered straight to your ears every week.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="px-6 py-3 rounded-xl bg-[#1db954] text-white font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-lg">
                            <i className="bi bi-spotify"></i> Spotify
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-[#8e24aa] text-white font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-lg">
                            <i className="bi bi-apple"></i> Apple Podcasts
                        </button>
                        <button className="px-6 py-3 rounded-xl dark:bg-slate-800 bg-slate-700 text-white font-bold dark:hover:bg-slate-700 hover:bg-slate-600 transition-all flex items-center gap-2 duration-300">
                            <i className="bi bi-rss-fill"></i> RSS Feed
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Podcasts;
