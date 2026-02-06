import React from 'react';

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
        <div className="bg-slate-950 min-h-screen text-slate-300 font-sans">
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-slate-950 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-5xl text-white shadow-2xl shadow-blue-500/30 mb-8 rotate-3">
                        <i className="bi bi-mic-fill"></i>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 font-[Oswald] tracking-tight">
                        BitGuard <span className="text-blue-500">Tech Talks</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
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
                        <div key={ep.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:border-slate-700 transition-colors group">
                            <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden relative">
                                <img src={ep.image} alt={ep.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => e.target.src = 'https://placehold.co/300x300/1e293b/white?text=Podcast'} />
                                <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <i className="bi bi-play-circle-fill text-5xl text-white drop-shadow-lg"></i>
                                </button>
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    <span>{ep.date}</span>
                                    <span>&bull;</span>
                                    <span>{ep.duration}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{ep.title}</h3>
                                <p className="text-indigo-400 text-sm font-semibold mb-4">Guest: {ep.guest}</p>
                                <p className="text-slate-400 leading-relaxed mb-6">{ep.description}</p>
                                <div className="flex gap-4">
                                    <button className="text-sm font-bold text-white bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                                        <i className="bi bi-play-fill mr-1"></i> Play Episode
                                    </button>
                                    <button className="text-sm font-bold text-slate-400 hover:text-white transition-colors px-2">
                                        <i className="bi bi-share-fill mr-2"></i> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Podcasts;
