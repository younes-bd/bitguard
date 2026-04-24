import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SERVICES from '../../../core/data/servicesData';
import PageMeta from '../../../core/components/shared/PageMeta';

const ServiceDetail = () => {
    const { slug } = useParams();
    const service = SERVICES[slug];
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
            
            // Simple ScrollSpy logic
            const sections = ['overview', 'benefits', 'features', 'process', 'faq'];
            let current = 'overview';
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // Offset by 200px to trigger just as the section enters the viewport nicely
                    if (rect.top <= 300) {
                        current = section;
                    }
                }
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        // Initial setup
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    if (!service) {
        return <Navigate to="/404" replace />;
    }

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen font-sans selection:bg-sky-500/30 transition-colors duration-300">
            <PageMeta title={service.title} description={service.description} />
            
            {/* HERO SECTION - APPLE/STRIPE STYLE (DARK, PREMIUM, HUGE TYPOGRAPHY) */}
            <section 
                className="relative pt-40 pb-32 lg:pt-48 lg:pb-40 overflow-hidden text-white"
                style={{ background: service.hero_bg || '#020617' }}
            >
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjwvZ3JhcGhpYz4=')]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 z-10 pointer-events-none"></div>
                
                <div className="container mx-auto px-4 md:px-8 relative z-20 text-center max-w-5xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <i className={`${service.icon} text-blue-400`}></i> {service.subtitle}
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            {service.title}
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        {service.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
                        <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 no-underline">
                            Deploy Now
                        </Link>
                        <button onClick={() => scrollTo('features')} className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-full font-bold border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all">
                            Explore Capabilities
                        </button>
                    </div>
                </div>
            </section>

            {/* STICKY SUB-NAV (MOBILE ONLY) */}
            <div className={`lg:hidden sticky top-20 z-40 dark:bg-slate-900/95 bg-white/95 backdrop-blur-xl border-b dark:border-slate-800 border-slate-200 py-3 px-4 flex overflow-x-auto gap-4 no-scrollbar shadow-sm transition-transform duration-300 ${scrolled ? 'translate-y-0' : '-translate-y-full'}`}>
                {['overview', 'benefits', 'features', 'process', 'faq'].map((id) => {
                    if (id === 'faq' && !service.faq) return null;
                    if (id === 'process' && !service.process) return null;
                    return (
                        <button key={id} onClick={() => scrollTo(id)} className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors bg-transparent border-none ${activeSection === id ? 'text-blue-500' : 'dark:text-slate-400 text-slate-600'}`}>
                            {id}
                        </button>
                    );
                })}
            </div>

            {/* MAIN CONTENT AREA Grid */}
            <div className="container mx-auto px-4 md:px-8 py-16 lg:py-24">
                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* LEFT SIDEBAR (Desktop Table of Contents) */}
                    <div className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-32 space-y-10">
                            <nav className="flex flex-col gap-4 border-l-2 dark:border-slate-800 border-slate-200 pl-5">
                                {['overview', 'benefits', 'features', 'process', 'faq'].map((id) => {
                                    if (id === 'faq' && !service.faq) return null;
                                    if (id === 'process' && !service.process) return null;
                                    return (
                                        <button 
                                            key={id} 
                                            onClick={() => scrollTo(id)}
                                            className={`text-left text-sm font-bold uppercase tracking-widest transition-all relative bg-transparent border-none cursor-pointer ${
                                                activeSection === id 
                                                ? 'text-blue-500 translate-x-2' 
                                                : 'dark:text-slate-500 text-slate-400 hover:text-slate-800 dark:hover:text-slate-300'
                                            }`}
                                        >
                                            {activeSection === id && <span className="absolute -left-[27px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full ring-4 dark:ring-slate-950 ring-slate-50"></span>}
                                            {id.replace('-', ' ')}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Sidebar CTA */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
                                <h4 className="text-white font-bold mb-2 relative z-10 text-lg">Talk to Sales</h4>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed relative z-10">Skip the line and schedule a technical discovery call.</p>
                                <Link to="/contact" className="block w-full py-3 text-center text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-transform transform active:scale-95 shadow-lg shadow-blue-500/20 no-underline relative z-10">
                                    Book Call
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex-1 space-y-32 min-w-0">
                        {/* OVERVIEW SECTION */}
                        <section id="overview" className="scroll-mt-32">
                            <div className="dark:prose-invert prose prose-xl prose-slate max-w-none dark:text-slate-300 text-slate-600 leading-relaxed font-light marker:text-blue-500 prose-p:mb-6 prose-strong:text-slate-900 dark:prose-strong:text-white" dangerouslySetInnerHTML={{ __html: service.long_description }}></div>
                        </section>

                        {/* BENEFITS BENTO BOX */}
                        {service.benefits && (
                            <section id="benefits" className="scroll-mt-32">
                                <h2 className="text-3xl lg:text-4xl font-bold dark:text-white text-slate-900 mb-10 tracking-tight">The Advantage</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {service.benefits.map((benefit, idx) => (
                                        <div key={idx} className={`p-8 rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                                            <div className="absolute top-0 right-0 w-48 h-48 dark:bg-blue-500/10 bg-blue-50 rounded-full blur-3xl transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>
                                            <div className={`dark:bg-slate-950 bg-slate-50 rounded-2xl flex items-center justify-center dark:text-blue-400 text-blue-600 mb-6 shadow-inner ring-1 dark:ring-white/5 ring-black/5 relative z-10 ${idx === 0 ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-xl'}`}>
                                                <i className={benefit.icon}></i>
                                            </div>
                                            <h3 className={`font-bold dark:text-white text-slate-900 mb-3 relative z-10 ${idx === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{benefit.title}</h3>
                                            <p className={`dark:text-slate-400 text-slate-600 leading-relaxed relative z-10 ${idx === 0 ? 'text-lg max-w-xl' : 'text-base'}`}>{benefit.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FEATURES STACK */}
                        {service.features && (
                            <section id="features" className="scroll-mt-32">
                                <h2 className="text-3xl lg:text-4xl font-bold dark:text-white text-slate-900 mb-10 tracking-tight">Core Capabilities</h2>
                                <div className="space-y-5">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row md:items-center p-8 rounded-3xl dark:bg-slate-800/50 bg-slate-50 border dark:border-slate-800 border-slate-200 dark:hover:bg-slate-800 hover:bg-white transition-all duration-300 gap-6 group">
                                            <div className="w-16 h-16 shrink-0 rounded-full dark:bg-blue-900/30 bg-blue-100 flex items-center justify-center dark:text-blue-400 text-blue-600 text-2xl group-hover:scale-110 transition-transform duration-300 ring-2 dark:ring-blue-900 ring-blue-200">
                                                <i className={feature.icon || 'bi bi-check-lg'}></i>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">{feature.title}</h3>
                                                <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-lg m-0">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PROCESS SECTION */}
                        {service.process && (
                            <section id="process" className="scroll-mt-32">
                                <h2 className="text-3xl lg:text-4xl font-bold dark:text-white text-slate-900 mb-12 tracking-tight">How It Works</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {service.process.map((step, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="hidden md:block absolute top-8 left-16 w-[calc(100%-4rem)] h-px bg-gradient-to-r dark:from-slate-700 from-slate-300 to-transparent z-0"></div>
                                            <div className="w-16 h-16 rounded-2xl dark:bg-slate-800 bg-white border-2 dark:border-blue-500 border-blue-600 dark:text-white text-slate-900 font-black text-xl flex items-center justify-center mb-6 relative z-10 shadow-lg">
                                                {step.step}
                                            </div>
                                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-3">{step.title}</h3>
                                            <p className="dark:text-slate-400 text-slate-600 leading-relaxed">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FAQ SECTION */}
                        {service.faq && (
                            <section id="faq" className="scroll-mt-32 pb-16">
                                <h2 className="text-3xl lg:text-4xl font-bold dark:text-white text-slate-900 mb-8 tracking-tight">Frequently Asked Questions</h2>
                                <div className="divide-y dark:divide-slate-800 divide-slate-200 border-y dark:border-slate-800 border-slate-200">
                                    {service.faq.map((item, idx) => (
                                        <details key={idx} className="group py-6">
                                            <summary className="flex cursor-pointer items-center justify-between text-xl font-bold dark:text-slate-300 text-slate-800 hover:text-blue-600 dark:hover:text-blue-400 marker:content-none list-none transition-colors">
                                                <span>{item.question}</span>
                                                <span className="relative flex-shrink-0 ml-4 w-8 h-8 rounded-full dark:bg-slate-800 bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                                    <i className="bi bi-plus-lg text-lg group-open:hidden"></i>
                                                    <i className="bi bi-dash-lg text-lg hidden group-open:block"></i>
                                                </span>
                                            </summary>
                                            <div className="pr-12 pt-6 dark:text-slate-400 text-slate-600 text-lg leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                                {item.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
