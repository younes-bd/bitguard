import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../../../../../core/components/shared/PageMeta';

const Integrations = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Security', 'Cloud', 'ITSM', 'Communication'];

    const integrations = [
        { name: 'CrowdStrike Falcon', category: 'Security', icon: 'bi-shield-check', desc: 'Ingest EDR alerts directly into the BitGuard SOC dashboard for rapid response.', maturity: 'GA' },
        { name: 'AWS', category: 'Cloud', icon: 'bi-cloud', desc: 'Native integration with AWS CloudTrail and GuardDuty for continuous cloud monitoring.', maturity: 'GA' },
        { name: 'Microsoft Azure', category: 'Cloud', icon: 'bi-microsoft', desc: 'Seamlessly sync Azure AD identities and monitor Sentinel alerts.', maturity: 'GA' },
        { name: 'ServiceNow', category: 'ITSM', icon: 'bi-diagram-3', desc: 'Two-way ticket synchronization for incident management and SLA tracking.', maturity: 'GA' },
        { name: 'Jira Service Management', category: 'ITSM', icon: 'bi-kanban', desc: 'Automatically create Jira issues from BitGuard critical alerts.', maturity: 'GA' },
        { name: 'Slack', category: 'Communication', icon: 'bi-slack', desc: 'Receive real-time threat notifications and approve access requests via Slack.', maturity: 'GA' },
        { name: 'Microsoft Teams', category: 'Communication', icon: 'bi-microsoft-teams', desc: 'Collaborate with BitGuard SOC analysts directly in your Teams channels.', maturity: 'Beta' },
        { name: 'Palo Alto Networks', category: 'Security', icon: 'bi-router', desc: 'Automate firewall rule changes and block malicious IPs automatically.', maturity: 'GA' },
        { name: 'Datadog', category: 'Cloud', icon: 'bi-graph-up', desc: 'Forward performance metrics to correlate infrastructure health with security events.', maturity: 'Early Access' },
        { name: 'Okta', category: 'Security', icon: 'bi-key', desc: 'Enforce MFA and conditional access policies through BitGuard IAM.', maturity: 'GA' }
    ];

    const filteredIntegrations = integrations.filter(int => {
        const matchesCategory = activeCategory === 'All' || int.category === activeCategory;
        const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase()) || int.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen pt-32 pb-20 transition-colors duration-300">
            <PageMeta title="Integrations Ecosystem" description="Connect BitGuard with your existing technology stack for seamless IT and security operations." />
            
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Ecosystem</span>
                    <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                        Integrates seamlessly with<br />your existing stack.
                    </h1>
                    <p className="dark:text-slate-400 text-slate-600 text-lg max-w-2xl mx-auto transition-colors duration-300">
                        BitGuard connects with {integrations.length} enterprise tools, bringing your entire IT and security infrastructure into a single pane of glass.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border dark:border-slate-700 border-slate-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-72">
                        <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search integrations..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-200 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Integrations Grid */}
                {filteredIntegrations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIntegrations.map((int, idx) => (
                            <div key={idx} className="dark:bg-slate-900 bg-white p-6 rounded-2xl border dark:border-slate-800 border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl dark:bg-slate-800 bg-slate-100 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                                        <i className={`bi ${int.icon} text-2xl`}></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold dark:text-white text-slate-900 text-lg leading-tight">{int.name}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{int.category}</span>
                                            {int.maturity && (
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                    int.maturity === 'GA' ? 'text-emerald-500 bg-emerald-500/10' :
                                                    int.maturity === 'Beta' ? 'text-amber-500 bg-amber-500/10' :
                                                    'text-purple-500 bg-purple-500/10'
                                                }`}>
                                                    {int.maturity}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{int.desc}</p>
                                <Link to="/contact" className="text-sm font-bold text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 mt-auto no-underline">
                                    Request API Access <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 dark:bg-slate-900 bg-white rounded-3xl border dark:border-slate-800 border-slate-200">
                        <div className="text-slate-400 text-5xl mb-4"><i className="bi bi-search"></i></div>
                        <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">No integrations found</h3>
                        <p className="dark:text-slate-400 text-slate-500">We couldn't find anything matching "{searchQuery}".</p>
                        <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-6 text-blue-500 font-bold hover:underline">Clear Filters</button>
                    </div>
                )}
                
                <div className="mt-20 dark:bg-blue-900/10 bg-blue-50 rounded-3xl p-10 text-center border dark:border-blue-800/30 border-blue-100">
                    <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">Don't see your tool?</h3>
                    <p className="dark:text-slate-400 text-slate-600 mb-8 max-w-2xl mx-auto">We offer a robust REST API and custom webhook configurations to connect BitGuard with virtually any enterprise software.</p>
                    <a href="/contact" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-500 transition-colors uppercase tracking-wider text-sm">
                        Request Custom Integration
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Integrations;
