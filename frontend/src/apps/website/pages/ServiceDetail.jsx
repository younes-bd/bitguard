import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SERVICES from '../../../core/data/servicesData';
import SectionDivider from '../../../core/components/SectionDivider';

const ServiceDetail = () => {
    const { slug } = useParams();
    const service = SERVICES[slug];
    const [activeTab, setActiveTab] = useState('overview');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!service) {
        return <Navigate to="/404" replace />;
    }

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen font-sans selection:bg-sky-500/30 transition-colors duration-300">
            {/* HERO SECTION - ENTERPRISE GRADE (DARK) */}
            <section className="relative min-h-[60vh] flex items-center pt-24 pb-20 overflow-hidden text-white bg-slate-950 transition-colors duration-300">
                {/* Dynamic Backgrounds */}
                <div className="absolute inset-0 bg-slate-950 z-0"></div>
                
                {/* Cyber Grid */}
                <div className="absolute inset-0 opacity-[0.03] z-0" 
                    style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                
                {/* Glow Effects */}
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none z-0"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-4xl">
                        {/* Eyebrow Label */}
                        <div className="inline-flex flex-wrap items-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-widest uppercase">
                                BitGuard Cloud Services
                            </span>
                            <span className="text-slate-400 text-sm flex items-center gap-2">
                                <i className="bi bi-clock"></i> 5 min read
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400">
                                {service.title}
                            </span>
                        </h1>
                        
                        {/* Subtitle / Description */}
                        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                            {service.description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
                            <Link to="/contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 no-underline group">
                                Request Demo
                                <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </Link>
                            <a href="#technical-specs" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg font-bold transition-all no-underline">
                                View Technical Specs
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* STICKY TAB NAVIGATION */}
            <div className={`sticky top-16 z-40 dark:bg-slate-900/90 bg-white/90 backdrop-blur-xl border-b dark:border-slate-800 border-slate-200 transition-all duration-300 ${scrolled ? 'shadow-md shadow-slate-200/50 dark:shadow-slate-900/50' : ''}`}>
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex overflow-x-auto no-scrollbar gap-8">
                        {['overview', 'features', 'process', 'faq'].map((tab) => {
                            if (tab === 'features' && !service.features) return null;
                            if (tab === 'process' && !service.process) return null;
                            if (tab === 'faq' && !service.faq) return null;
                            
                            return (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-2 whitespace-nowrap border-b-2 font-bold text-sm tracking-wide uppercase transition-colors cursor-pointer bg-transparent list-none ${
                                        activeTab === tab 
                                        ? 'border-blue-600 dark:text-blue-400 text-blue-700' 
                                        : 'border-transparent dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900'
                                    }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="container mx-auto px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column - Content */}
                    <div className="lg:col-span-8 space-y-24">
                        
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="animate-in fade-in duration-500">
                                <div className="dark:prose-invert prose prose-lg prose-slate max-w-none dark:text-slate-300 text-slate-600 leading-relaxed marker:text-blue-600 transition-colors duration-300" dangerouslySetInnerHTML={{ __html: service.long_description }}></div>
                                
                                {/* Key Benefits Grid (Data Visualization Style) */}
                                {service.benefits && (
                                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {service.benefits.map((benefit, idx) => (
                                            <div key={idx} className="dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 shadow-sm p-8 rounded-2xl dark:hover:border-blue-500 hover:border-blue-200 transition-all group relative overflow-hidden duration-300">
                                                <div className="absolute top-0 right-0 w-24 h-24 dark:bg-blue-900/20 bg-blue-50 rounded-full blur-2xl group-hover:dark:bg-blue-800/20 group-hover:bg-blue-100 transition-all duration-300"></div>
                                                <div className="w-12 h-12 dark:bg-slate-900 bg-blue-50 border dark:border-slate-700 border-blue-100 rounded-xl flex items-center justify-center dark:text-blue-400 text-blue-600 text-2xl mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform duration-300">
                                                    <i className={benefit.icon}></i>
                                                </div>
                                                <h4 className="dark:text-white text-slate-900 font-bold text-lg mb-3 relative z-10 transition-colors duration-300">{benefit.title}</h4>
                                                <p className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed relative z-10 transition-colors duration-300">{benefit.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FEATURES TAB */}
                        {activeTab === 'features' && service.features && (
                            <div className="animate-in fade-in duration-500" id="technical-specs">
                                <h3 className="text-3xl font-bold dark:text-white text-slate-900 mb-8 flex items-center gap-3 transition-colors duration-300">
                                    <i className="bi bi-cpu text-blue-600"></i> Technical Capabilities
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="p-6 rounded-2xl dark:bg-slate-800 bg-white shadow-sm border dark:border-slate-700 border-slate-200 dark:hover:border-blue-500 hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-4 duration-300">
                                            <div className="mt-1 dark:text-blue-400 text-blue-600 shrink-0 transition-colors duration-300">
                                                <i className={`${feature.icon || 'bi bi-check-circle-fill'} text-2xl`}></i>
                                            </div>
                                            <div>
                                                <h5 className="font-bold dark:text-white text-slate-900 mb-2 transition-colors duration-300">{feature.title}</h5>
                                                <p className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed transition-colors duration-300">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PROCESS TAB */}
                        {activeTab === 'process' && service.process && (
                            <div className="animate-in fade-in duration-500">
                                <h3 className="text-3xl font-bold dark:text-white text-slate-900 mb-12 flex items-center gap-3 transition-colors duration-300">
                                    <i className="bi bi-diagram-3 text-blue-600"></i> Implementation Workflow
                                </h3>
                                <div className="relative space-y-12 before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-blue-300 before:to-transparent">
                                    {service.process.map((step, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 dark:border-slate-950 border-slate-50 dark:bg-slate-900 bg-white dark:text-blue-400 text-blue-600 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ring-2 dark:ring-blue-900/50 ring-blue-100 transition-colors duration-300">
                                                <span className="font-bold text-sm tracking-tighter">{step.step}</span>
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 shadow-md group-hover:dark:border-blue-500 group-hover:border-blue-300 group-hover:shadow-lg transition-all duration-300">
                                                <h4 className="text-xl font-bold dark:text-white text-slate-900 mb-2 transition-colors duration-300">{step.title}</h4>
                                                <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-sm transition-colors duration-300">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQ TAB */}
                        {activeTab === 'faq' && service.faq && (
                            <div className="animate-in fade-in duration-500">
                                <h3 className="text-3xl font-bold dark:text-white text-slate-900 mb-8 transition-colors duration-300">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {service.faq.map((item, idx) => (
                                        <details key={idx} className="group dark:bg-slate-800 bg-white shadow-sm rounded-xl border dark:border-slate-700 border-slate-200 dark:open:bg-slate-900/50 open:bg-slate-50 transition-colors duration-300">
                                            <summary className="flex cursor-pointer items-center justify-between p-6 font-bold dark:text-white text-slate-900 marker:content-none list-none transition-colors duration-300">
                                                {item.question}
                                                <i className="bi bi-plus-lg transition-transform group-open:rotate-45 text-blue-600"></i>
                                            </summary>
                                            <div className="px-6 pb-6 dark:text-slate-400 text-slate-600 text-sm leading-relaxed border-t dark:border-slate-700 border-slate-100 pt-4 transition-colors duration-300">
                                                {item.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column - Sidebar Widgets */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-40 space-y-8">
                            
                            {/* CTA Widget (Kept dark to stand out, common in modern B2B) */}
                            <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="inline-flex items-center justify-center p-3 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 mb-6">
                                        <i className="bi bi-chat-square-text text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Speak with an Engineer</h3>
                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                        Skip the sales pitch. Schedule a 30-minute discovery call directly with a specialized Solutions Architect.
                                    </p>
                                    <Link to="/contact" className="block w-full py-4 text-center text-white bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20 no-underline">
                                        Schedule Call
                                    </Link>
                                    <div className="mt-6 flex justify-center text-slate-500 text-xs">
                                        NO COMMITMENT REQUIRED
                                    </div>
                                </div>
                            </div>

                            {/* Why Choose Us Widget (Light mode) */}
                            {service.why_choose_us && (
                                <div className="dark:bg-slate-800 bg-white rounded-2xl p-8 border dark:border-slate-700 border-slate-200 shadow-md transition-colors duration-300">
                                    <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-6 uppercase tracking-wider text-xs border-b dark:border-slate-700 border-slate-100 pb-4 transition-colors duration-300">
                                        The BitGuard Advantage
                                    </h3>
                                    <ul className="space-y-4 m-0 p-0 list-none">
                                        {service.why_choose_us.points.map((point, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm dark:text-slate-400 text-slate-600 items-start transition-colors duration-300">
                                                <i className="bi bi-check2 text-blue-600 text-base shrink-0 mt-0.5 font-bold"></i>
                                                <span className="leading-relaxed">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                             {/* Analyst Report Widget  */}
                             <div className="dark:bg-slate-800 bg-white rounded-2xl p-6 border dark:border-slate-700 border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer dark:hover:border-blue-500 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                                <div>
                                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Gartner Magic Quadrant™</div>
                                    <div className="text-sm dark:text-white text-slate-900 font-bold transition-colors duration-300">Download the 2026 Report</div>
                                </div>
                                <div className="w-10 h-10 rounded-full dark:bg-slate-900 bg-slate-50 flex items-center justify-center group-hover:dark:bg-blue-900/20 group-hover:bg-blue-50 transition-colors duration-300">
                                    <i className="bi bi-download dark:text-slate-400 text-slate-500 dark:group-hover:text-blue-400 group-hover:text-blue-600 transition-colors duration-300"></i>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
