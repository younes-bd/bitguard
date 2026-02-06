import React from 'react';

const Reports = () => {
    const reports = [
        {
            id: 1,
            title: "2026 Cybersecurity Threat Landscape",
            category: "Annual Report",
            summary: "An in-depth analysis of emerging threats including AI-driven ransomware, quantum decryption risks, and supply chain vulnerabilities.",
            image: "/assets/images/home/unified.jpg",
            pages: 42
        },
        {
            id: 2,
            title: "The CTO's Guide to Zero Trust",
            category: "Whitepaper",
            summary: "Practical steps for enterprise leaders to implement Zero Trust architecture without disrupting business operations.",
            image: "/assets/images/home/security-ops.jpg",
            pages: 18
        },
        {
            id: 3,
            title: "Cloud Migration ROI: A Financial Analysis",
            category: "Case Study",
            summary: "Real-world data on cost savings and efficiency gains from migrating legacy infrastructure to hybrid cloud environments.",
            image: "/assets/images/home/analytics.png",
            pages: 25
        },
        {
            id: 4,
            title: "Compliance Checklist: GDPR & HIPAA 2026",
            category: "Guide",
            summary: "Updated requirements for data privacy and healthcare information security in the new regulatory landscape.",
            image: "/assets/images/home/ai-models.png",
            pages: 12
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-slate-900 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                                <i className="bi bi-file-earmark-text"></i> Intelligence Hub
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[Oswald]">
                                Industry Insights & <br />
                                <span className="text-blue-400">Strategic Reports</span>
                            </h1>
                            <p className="text-xl text-slate-300 max-w-xl mb-8 leading-relaxed">
                                Data-driven research to help you make informed decisions about your technology stack and security posture.
                            </p>
                        </div>
                        <div className="md:w-1/2 relative">
                            {/* Featured Report Card */}
                            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 relative z-10 transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl uppercase tracking-wider">
                                    Featured Analysis
                                </div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Just Released</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">State of AI in Enterprise Security 2026</h3>
                                <p className="text-slate-600 mb-6 line-clamp-3">
                                    How 500+ global enterprises are leveraging artificial intelligence to automate threat detection and response, and the new risks they face.
                                </p>
                                <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                                    Download Full Report (PDF)
                                </button>
                            </div>
                            <div className="absolute top-4 left-4 w-full h-full bg-blue-500/20 rounded-xl -z-10 transform -rotate-3"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reports Grid */}
            <section className="py-20 container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold text-slate-900">Latest Publications</h2>
                    <div className="hidden md:flex gap-2">
                        {['All', 'Whitepapers', 'Case Studies', 'Guides'].map((filter, i) => (
                            <button key={i} className={`px-4 py-2 rounded-full text-sm font-bold ${i === 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reports.map((report) => (
                        <div key={report.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative border-b border-slate-100">
                                <img src={report.image} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Report+Cover'} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <span className="bg-blue-600 px-2 py-1 rounded">{report.category}</span>
                                    <span>{report.pages} Pages</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                                    {report.title}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow">
                                    {report.summary}
                                </p>
                                <button className="mt-auto w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-bold group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all flex items-center justify-center gap-2">
                                    <i className="bi bi-download"></i> Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 bg-blue-600 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold font-[Oswald] mb-6">Research-Driven Security</h2>
                    <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
                        Our dedicated threat intelligence team analyzes over 500 million data points daily to keep you ahead of attackers.
                    </p>
                    <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-2xl">
                        Subscribe to Intelligence Feed
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Reports;
