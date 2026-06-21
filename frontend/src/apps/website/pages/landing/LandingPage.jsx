import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../../../../core/api/client';
import SolutionReveal from '../../components/SolutionReveal';
import PageMeta from '../../../../core/components/shared/PageMeta';
import '../../../../core/styles/landing.css';

// Static color map to prevent Tailwind purge in production builds
const COLOR_MAP = {
    blue:    { bg: 'bg-blue-600', shadow: 'shadow-blue-600/30', text: 'text-blue-600', darkText: 'dark:text-blue-400', hoverText: 'hover:text-blue-800', darkHoverText: 'dark:hover:text-blue-300', bgLight: 'bg-blue-500/20', border: 'border-blue-500/20' },
    indigo:  { bg: 'bg-indigo-600', shadow: 'shadow-indigo-600/30', text: 'text-indigo-600', darkText: 'dark:text-indigo-400', hoverText: 'hover:text-indigo-800', darkHoverText: 'dark:hover:text-indigo-300', bgLight: 'bg-indigo-500/20', border: 'border-indigo-500/20' },
    emerald: { bg: 'bg-emerald-600', shadow: 'shadow-emerald-600/30', text: 'text-emerald-600', darkText: 'dark:text-emerald-400', hoverText: 'hover:text-emerald-800', darkHoverText: 'dark:hover:text-emerald-300', bgLight: 'bg-emerald-500/20', border: 'border-emerald-500/20' },
    purple:  { bg: 'bg-purple-600', shadow: 'shadow-purple-600/30', text: 'text-purple-600', darkText: 'dark:text-purple-400', hoverText: 'hover:text-purple-800', darkHoverText: 'dark:hover:text-purple-300', bgLight: 'bg-purple-500/20', border: 'border-purple-500/20' },
    amber:   { bg: 'bg-amber-600', shadow: 'shadow-amber-600/30', text: 'text-amber-600', darkText: 'dark:text-amber-400', hoverText: 'hover:text-amber-800', darkHoverText: 'dark:hover:text-amber-300', bgLight: 'bg-amber-500/20', border: 'border-amber-500/20' },
    cyan:    { bg: 'bg-cyan-600', shadow: 'shadow-cyan-600/30', text: 'text-cyan-600', darkText: 'dark:text-cyan-400', hoverText: 'hover:text-cyan-800', darkHoverText: 'dark:hover:text-cyan-300', bgLight: 'bg-cyan-500/20', border: 'border-cyan-500/20' },
    green:   { bg: 'bg-green-600', shadow: 'shadow-green-600/30', text: 'text-green-600', darkText: 'dark:text-green-400', hoverText: 'hover:text-green-800', darkHoverText: 'dark:hover:text-green-300', bgLight: 'bg-green-500/20', border: 'border-green-500/20' },
};

const LandingPage = () => {
    const [videoOpen, setVideoOpen] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [activeTab, setActiveTab] = useState(0);


    const openVideo = () => { setVideoOpen(true); };
    const closeVideo = () => { setVideoOpen(false); };

    const navigate = useNavigate();

    // Newsletter State
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState({ type: '', message: '' });

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setNewsletterStatus({ type: 'loading', message: 'Subscribing...' });
        try {
            await client.post('home/signups/', { email: newsletterEmail });
            setNewsletterStatus({ type: 'success', message: 'Thanks for subscribing!' });
            setNewsletterEmail('');
            setTimeout(() => setNewsletterStatus({ type: '', message: '' }), 3000);
        } catch (error) {
            setNewsletterStatus({ type: 'error', message: 'Failed to subscribe. Please try again.' });
            setTimeout(() => setNewsletterStatus({ type: '', message: '' }), 3000);
        }
    };

    // Announcements State
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await client.get('home/announcements/');
                setAnnouncements(response.data || []);
            } catch (error) {
                console.error("Failed to fetch announcements:", error);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <div className="dark:bg-slate-950 bg-slate-50 font-sans dark:text-slate-300 text-slate-800 selection:bg-sky-500/30 transition-colors duration-300">
            <PageMeta title="BitGuard — Your Complete Technology Partner | Managed IT, Web Dev, AI & Cybersecurity" description="BitGuard is a do-it-all IT enterprise and MSP. We deliver Managed IT, Web Development, E-Commerce, AI Automation, Cloud Infrastructure, Cybersecurity, and Physical Security — all under one roof." />
            
            {/* ================================================================== */}
            {/* 1. HERO SECTION â€” Asymmetrical, Dark, Tech-Forward                 */}
            {/* ================================================================== */}
            <section className="relative pt-20 pb-8 lg:pt-24 lg:pb-12 dark:bg-slate-950 bg-slate-50 overflow-hidden transition-colors duration-300" id="hero-section">
                {/* Minimal Background Grid */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 dark:bg-[#0a0f1c] dark:mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.03] dark:opacity-[0.06]" style={{ backgroundSize: '40px 40px' }}></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        {/* LEFT: Copywriting */}
                        <div className="lg:col-span-6 text-left">
                            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full dark:bg-blue-500/10 bg-blue-50 border dark:border-blue-500/20 border-blue-200 text-blue-600 dark:text-blue-400 text-[11px] font-bold mb-6 tracking-[0.15em] backdrop-blur-sm transition-colors duration-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                YOUR COMPLETE TECHNOLOGY PARTNER
                            </span>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 dark:text-white text-slate-900 tracking-tight leading-[1.08] transition-colors duration-300">
                                One Partner.<br/>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">Every Technology</span> Need.
                            </h1>

                            <p className="text-base md:text-lg dark:text-slate-400 text-slate-600 mb-6 leading-relaxed max-w-xl transition-colors duration-300">
                                From custom web development and AI automation to managed IT, cloud infrastructure, cybersecurity, and physical security — BitGuard is the only technology partner your business will ever need.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-start gap-3 mb-8">
                                <Link to="/contact" className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center gap-2 transform active:scale-[0.98] no-underline text-sm">
                                    <span>Request a Consultation</span>
                                    <i className="bi bi-arrow-right"></i>
                                </Link>
                                <Link to="/solutions/bitguard-bundle" className="px-7 py-3.5 dark:bg-slate-900/80 bg-white border dark:border-slate-700 border-slate-200 dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-white text-slate-900 rounded-lg font-semibold transition-all flex items-center gap-2 transform active:scale-[0.98] text-sm no-underline">
                                    <span>Explore Solutions</span>
                                    <i className="bi bi-arrow-right opacity-40"></i>
                                </Link>
                            </div>

                            {/* Compliance Badges */}
                            <div className="flex flex-wrap gap-x-5 gap-y-2 items-center">
                                {['SOC 2 Type II', 'ISO 27001', 'HIPAA', 'NIST CSF'].map((cert, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[11px] font-semibold dark:text-slate-500 text-slate-400 tracking-wide">
                                        <i className="bi bi-patch-check-fill text-emerald-500/80 text-xs"></i> {cert}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Dynamic Tech Visual */}
                        <div className="lg:col-span-6 relative">
                            {/* Glow behind visual */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                            
                            {/* Glass Panel */}
                            <div className="relative dark:bg-slate-900/40 bg-white/40 backdrop-blur-2xl border dark:border-slate-700/50 border-slate-200 rounded-2xl p-5 shadow-2xl z-10 overflow-hidden transform md:rotate-1 hover:rotate-0 transition-transform duration-700">
                                {/* Chrome Top */}
                                <div className="flex gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                </div>

                                {/* Actual UI Screenshot / Dynamic Visual */}
                                <div className="w-full h-[260px] rounded-xl overflow-hidden bg-slate-950 border border-slate-700/50 relative">
                                    {/* Animated Grid Background */}
                                    <div className="absolute inset-0 bg-[url('/assets/images/grid.png')] opacity-10"></div>
                                    
                                    {/* Video Stream UI */}
                                    <div className="absolute inset-0">
                                        <img src="/assets/images/home/hero-dashboard.png" alt="BitGuard Dashboard" className="w-full h-full object-cover opacity-80 mix-blend-screen" onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/home/tab-msp.png'; }} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating services widget */}
                            <div className="absolute -right-4 -bottom-4 sm:-right-6 sm:-bottom-6 dark:bg-slate-800/90 bg-white/90 backdrop-blur border dark:border-slate-700 border-slate-200 py-3 px-4 rounded-xl shadow-xl z-20">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Services We Deliver</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Web Dev', 'AI/ML', 'Managed IT', 'Cloud', 'Security', 'Physical IT'].map(s => (
                                        <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Modal */}
                {videoOpen && <SolutionReveal onClose={closeVideo} />}
            </section>

            {/* ================================================================== */}
            {/* 2. TRUST & CREDIBILITY + CORE SOLUTIONS                            */}
            {/* ================================================================== */}
            <section className="dark:bg-slate-900 bg-white relative z-20 pt-16 pb-20 transition-colors duration-300">
                {/* Stats Bar */}
                <div className="container mx-auto px-4 relative z-30 mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { value: "99.999%", label: "Platform Uptime SLA", icon: "bi-activity" },
                            { value: "15M+", label: "Threats Blocked Daily", icon: "bi-shield-check" },
                            { value: "<15min", label: "Critical Response Time", icon: "bi-stopwatch" },
                            { value: "450+", label: "Enterprise Clients", icon: "bi-building" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center dark:bg-slate-800/60 bg-slate-50 rounded-xl border dark:border-slate-700/50 border-slate-200 p-5 relative overflow-hidden group">
                                <i className={`bi ${stat.icon} text-blue-500 text-2xl mb-3 block opacity-80 group-hover:scale-110 transition-transform duration-500`}></i>
                                <div className="text-2xl md:text-3xl font-bold dark:text-white text-slate-900 tracking-tight mb-1 relative z-10">{stat.value}</div>
                                <div className="dark:text-slate-400 text-slate-500 text-xs font-bold uppercase tracking-widest relative z-10">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trusted By Client Logos */}
                <div className="container mx-auto px-4 mb-12 text-center">
                    <p className="text-sm font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-8">Trusted by forward-thinking enterprises</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="text-xl md:text-2xl font-black text-slate-400 dark:text-slate-500 tracking-tighter">ACME Corp</div>
                        <div className="text-xl md:text-2xl font-black text-slate-400 dark:text-slate-500 tracking-tighter flex items-center gap-2"><i className="bi bi-globe"></i> GlobalNet</div>
                        <div className="text-xl md:text-2xl font-black text-slate-400 dark:text-slate-500 tracking-tighter">Stark Industries</div>
                        <div className="text-xl md:text-2xl font-black text-slate-400 dark:text-slate-500 tracking-tighter flex items-center gap-2"><i className="bi bi-shield-lock-fill"></i> SecureTech</div>
                        <div className="text-xl md:text-2xl font-black text-slate-400 dark:text-slate-500 tracking-tighter">Wayne Ent.</div>
                    </div>
                </div>
                              {/* Services Capabilities Marquee — NEW */}
                <div className="w-full py-5 border-b dark:border-slate-800 border-slate-100 overflow-hidden bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 from-slate-50 via-white to-slate-50">
                    <div className="flex overflow-hidden relative w-full [mask-image:_linear-gradient(to_right,transparent_0,_black_80px,_black_calc(100%-80px),transparent_100%)]">
                        <div className="flex gap-0 min-w-full flex-shrink-0 items-center animate-marquee">
                            {['WEB DEVELOPMENT', 'AI AUTOMATION', 'MANAGED IT', 'E-COMMERCE', 'CLOUD MIGRATIONS', 'CYBERSECURITY', 'PHYSICAL SECURITY', 'DIGITAL TRANSFORMATION', 'NOC SERVICES', 'APP DEVELOPMENT', 'BUSINESS INTELLIGENCE', 'HELPDESK SUPPORT'].map(s => (
                                <span key={s} className="whitespace-nowrap px-8 text-[11px] font-black tracking-[0.2em] dark:text-slate-500 text-slate-400 flex items-center gap-3">
                                    <span className="w-1 h-1 rounded-full bg-blue-500 inline-block"></span>{s}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-0 min-w-full flex-shrink-0 items-center animate-marquee" aria-hidden="true">
                            {['WEB DEVELOPMENT', 'AI AUTOMATION', 'MANAGED IT', 'E-COMMERCE', 'CLOUD MIGRATIONS', 'CYBERSECURITY', 'PHYSICAL SECURITY', 'DIGITAL TRANSFORMATION', 'NOC SERVICES', 'APP DEVELOPMENT', 'BUSINESS INTELLIGENCE', 'HELPDESK SUPPORT'].map(s => (
                                <span key={s} className="whitespace-nowrap px-8 text-[11px] font-black tracking-[0.2em] dark:text-slate-500 text-slate-400 flex items-center gap-3">
                                    <span className="w-1 h-1 rounded-full bg-blue-500 inline-block"></span>{s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trusted By — Tech Partners Marquee */}
                <div className="w-full pb-16 pt-10 text-center border-b dark:border-slate-800 border-slate-100 transition-colors duration-300 overflow-hidden">
                    <p className="text-slate-400 font-bold uppercase tracking-widest mb-8 text-xs">Technology Partners & Certifications</p>
                    <div className="flex overflow-hidden relative w-full [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                        <div className="flex space-x-16 min-w-full flex-shrink-0 justify-around items-center animate-marquee opacity-60 grayscale hover:grayscale-0 transition-all duration-[40s] px-8">
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-microsoft text-blue-500"></i> Microsoft Solutions Partner</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-cloud text-amber-500"></i> AWS Advanced Tier</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-shield-lock text-red-500"></i> CrowdStrike Elevate</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-router text-emerald-500"></i> Cisco Gold Integrator</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-fire text-orange-500"></i> Palo Alto Innovator</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-shield-check text-red-600"></i> Fortinet Expert</div>
                        </div>
                        <div className="flex space-x-16 min-w-full flex-shrink-0 justify-around items-center animate-marquee opacity-60 grayscale hover:grayscale-0 transition-all duration-[40s] px-8" aria-hidden="true">
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-microsoft text-blue-500"></i> Microsoft Solutions Partner</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-cloud text-amber-500"></i> AWS Advanced Tier</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-shield-lock text-red-500"></i> CrowdStrike Elevate</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-router text-emerald-500"></i> Cisco Gold Integrator</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-fire text-orange-500"></i> Palo Alto Innovator</div>
                            <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-shield-check text-red-600"></i> Fortinet Expert</div>
                        </div>
                    </div>
                </div>

                {/* Service Cards — Bento Box */}
                <div className="container mx-auto px-4 pt-16 pb-8">
                     <div className="mb-16 text-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">What We Do</span>
                        <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                            Every Technology Service,<br/>One Trusted Partner.
                        </h2>
                        <p className="dark:text-slate-400 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed transition-colors duration-300">
                            From building your website to securing your network, migrating your cloud, and installing your cameras — BitGuard handles your entire technology operation so you can focus on your business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">

                        {/* BENTO 1: Web Dev & E-Commerce — Large featured card */}
                        <Link to="/solutions/full-stack" className="md:col-span-6 group relative rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 md:p-12 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 no-underline block">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-violet-600/20 transition-all duration-700 pointer-events-none"></div>
                            <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-500 text-2xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]">
                                    <i className="bi bi-code-slash"></i>
                                </div>
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded">Web Development</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded">E-Commerce</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 px-2 py-0.5 rounded">App Dev</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold dark:text-white text-slate-900 tracking-tight mb-3">Web Dev, Apps & E-Commerce</h3>
                                    <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-base max-w-md">Custom websites, e-commerce platforms, full-stack business applications, and mobile apps — built with modern frameworks and delivered on time.</p>
                                </div>
                            </div>
                            <div className="absolute bottom-8 right-8 text-violet-500 dark:text-violet-400 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-2xl">
                                <i className="bi bi-arrow-right-circle-fill"></i>
                            </div>
                        </Link>

                        {/* BENTO 2: AI & Automation — Large featured card */}
                        <Link to="/solutions/data-analytics-ai" className="md:col-span-6 group relative rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 md:p-12 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 no-underline block">
                            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] -ml-48 -mt-48 group-hover:bg-cyan-600/20 transition-all duration-700 pointer-events-none"></div>
                            <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-500 text-2xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
                                    <i className="bi bi-cpu-fill"></i>
                                </div>
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">AI Automation</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded">Business Intelligence</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold dark:text-white text-slate-900 tracking-tight mb-3">AI, Automation & Data</h3>
                                    <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-base max-w-md">AI workflow automation, LLM integrations, business intelligence dashboards, and data pipelines that turn raw data into competitive advantage.</p>
                                </div>
                            </div>
                            <div className="absolute bottom-8 right-8 text-cyan-500 dark:text-cyan-400 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-2xl">
                                <i className="bi bi-arrow-right-circle-fill"></i>
                            </div>
                        </Link>

                        {/* BENTO 3: Managed IT */}
                        <Link to="/solutions/helpdesk-support" className="md:col-span-4 group relative rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-500 no-underline">
                            <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none"></div>
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="w-12 h-12 shrink-0 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 text-xl group-hover:rotate-12 transition-transform duration-500">
                                    <i className="bi bi-headset"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold dark:text-white text-slate-900 tracking-tight mb-1">Managed IT & Helpdesk</h3>
                                    <p className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed">24/7 helpdesk, NOC monitoring, patch management, and proactive endpoint lifecycle management.</p>
                                </div>
                            </div>
                        </Link>

                        {/* BENTO 4: Cybersecurity */}
                        <Link to="/solutions/managed-detection-response" className="md:col-span-4 group relative rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-500 no-underline">
                            <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-rose-500/10 rounded-full blur-[60px] group-hover:bg-rose-500/20 transition-all duration-700 pointer-events-none"></div>
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="w-12 h-12 shrink-0 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-500 text-xl group-hover:rotate-12 transition-transform duration-500">
                                    <i className="bi bi-shield-lock-fill"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold dark:text-white text-slate-900 tracking-tight mb-1">Cybersecurity & SOC</h3>
                                    <p className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed">Managed SOC/MDR, penetration testing, compliance (vCISO), and zero-trust identity management.</p>
                                </div>
                            </div>
                        </Link>

                        {/* BENTO 5: Cloud & Physical Security */}
                        <Link to="/solutions/azure-aws" className="md:col-span-2 group relative rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-500 no-underline">
                            <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 shrink-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 text-xl group-hover:rotate-12 transition-transform duration-500">
                                    <i className="bi bi-cloud-arrow-up-fill"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold dark:text-white text-slate-900 tracking-tight mb-1">Cloud</h3>
                                    <p className="dark:text-slate-400 text-slate-600 text-[11px] leading-relaxed">AWS/Azure migration & hosting.</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/solutions/camera-surveillance" className="md:col-span-2 group relative rounded-3xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-8 overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-500 no-underline">
                            <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-amber-500/10 rounded-full blur-[60px] group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 shrink-0 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 text-xl group-hover:rotate-12 transition-transform duration-500">
                                    <i className="bi bi-camera-video-fill"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold dark:text-white text-slate-900 tracking-tight mb-1">Physical Security</h3>
                                    <p className="dark:text-slate-400 text-slate-600 text-[11px] leading-relaxed">Cameras & access control.</p>
                                </div>
                            </div>
                        </Link>

                    </div>
                </div>
            </section>

            {/* ================================================================== */}
            {/* 3. WHY BITGUARD â€” Value Proposition                                */}
            {/* ================================================================== */}
            <section className="py-20 lg:py-28 dark:bg-slate-950 bg-slate-50 dark:text-white text-slate-900 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-1/3 h-full dark:bg-slate-900 bg-white skew-x-12 opacity-50 pointer-events-none border-l dark:border-slate-800 border-slate-200"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div>
                            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 block">Why BitGuard</span>
                            <h2 className="text-4xl lg:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                                One Partner for Every<br />Technology Challenge.
                            </h2>
                            <p className="dark:text-slate-400 text-slate-600 text-lg leading-relaxed mb-10 transition-colors duration-300">
                                We eliminate the complexity of managing multiple IT vendors. BitGuard acts as your outsourced technology department — delivering infrastructure, security, and support under a single SLA.
                            </p>
                            <div className="space-y-3 relative border-l-2 dark:border-slate-800 border-slate-200 ml-4">
                                {[
                                    { title: "Web Dev, AI & Digital Services", desc: "We build modern websites, e-commerce platforms, custom apps, and AI-powered workflows that transform how your business operates. From discovery to launch to support.", icon: "bi-code-slash", color: "purple", tag: "Digital" },
                                    { title: "End-to-End Managed IT", desc: "Managed helpdesk, NOC monitoring, cloud migrations, Microsoft 365 governance, and structured cabling — all under one team with a guaranteed 15-minute response SLA.", icon: "bi-headset", color: "blue", tag: "MSP" },
                                    { title: "Security & Compliance", desc: "24/7 SOC monitoring, penetration testing, vCISO advisory, compliance frameworks (SOC2, HIPAA, NIST), and physical security — so every layer of your business is protected.", icon: "bi-shield-check", color: "green", tag: "Security" }
                                ].map((item, i) => {
                                    const isActive = activeTab === i;
                                    const c = COLOR_MAP[item.color] || COLOR_MAP.blue;
                                    return (
                                    <div 
                                        key={i} 
                                        onClick={() => setActiveTab(i)}
                                        className={`relative pl-8 py-4 cursor-pointer transition-all duration-300 group ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        {/* Active Line Indicator */}
                                        <div className={`absolute top-0 bottom-0 left-[-2px] w-1 rounded-r-md transition-all duration-500 ease-out ${isActive ? c.bg : 'bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-slate-700'}`}></div>
                                        
                                        <div className="flex items-start">
                                            <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center mr-4 mt-0.5 transition-all duration-500 ${isActive ? `${c.bg} text-white shadow-lg ${c.shadow}` : 'dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-500'}`}>
                                                <i className={`bi ${item.icon} text-lg`}></i>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`font-bold transition-colors duration-300 ${isActive ? 'dark:text-white text-slate-900 text-lg' : 'dark:text-slate-400 text-slate-600'}`}>{item.title}</span>
                                                    {isActive && <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${c.text} ${c.bgLight} border ${c.border}`}>{item.tag}</span>}
                                                </div>
                                                <div className={`text-sm leading-relaxed transition-all duration-500 overflow-hidden ${isActive ? 'max-h-32 opacity-100 dark:text-slate-400 text-slate-600 mt-2' : 'max-h-0 opacity-0'}`}>{item.desc}</div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="relative mt-12 lg:mt-0 h-full min-h-[400px] lg:min-h-[500px]">
                            {[
                                { title: "Web Dev, AI & Digital Services", icon: "bi-code-slash", color: "purple", tag: "Digital", image: "tab-digital.png" },
                                { title: "End-to-End Managed IT", icon: "bi-headset", color: "blue", tag: "MSP", image: "tab-msp.png" },
                                { title: "Security & Compliance", icon: "bi-shield-check", color: "green", tag: "Security", image: "hero-dashboard.png" }
                            ].map((item, i) => {
                                const isActive = activeTab === i;
                                const c = COLOR_MAP[item.color] || COLOR_MAP.blue;
                                return (
                                <div 
                                    key={`img-${i}`}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                >
                                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl transform rotate-2 opacity-20 blur-xl"></div>
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white p-2 h-full flex flex-col">
                                        
                                        {/* Native App Top Bar */}
                                        <div className="h-12 border-b dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-slate-50 flex items-center px-4 gap-4 mb-2 justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                                </div>
                                                <div className="h-4 w-px dark:bg-slate-700 bg-slate-300"></div>
                                                <div className="flex items-center gap-2.5">
                                                    <img src="/assets/logo/logo.png" alt="BitGuard" className="w-6 h-6 object-contain brightness-0 dark:invert opacity-90" />
                                                    <span className="text-[24px] font-extrabold tracking-[0.15em] dark:text-slate-200 text-slate-800 leading-none">BITGUARD</span>
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-mono dark:text-slate-500 text-slate-500 font-bold tracking-widest flex items-center gap-2 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-md">
                                                <i className="bi bi-broadcast text-blue-500 animate-pulse"></i> {item.tag.toUpperCase()} LIVE
                                            </div>
                                        </div>

                                        <div className="rounded-xl overflow-hidden relative border dark:border-slate-900 border-slate-100 flex-1 bg-slate-100 dark:bg-slate-900 group/mockup">
                                            <img src={`/assets/images/home/${item.image}`} alt={item.title} className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${isActive ? 'scale-110' : 'scale-100'}`} onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/home/ai-models.png'; }} />
                                            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none mix-blend-overlay"></div>
                                        </div>
                                    </div>
                                    
                                    {isActive && (
                                        <div className="absolute -bottom-8 -left-8 dark:bg-slate-900 bg-white p-6 rounded-2xl shadow-xl border dark:border-slate-800 border-slate-200 max-w-xs hidden lg:block animate-fade-in-up">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className={`w-12 h-12 ${c.bgLight} rounded-xl flex items-center justify-center ${c.text} ${c.darkText} border ${c.border}`}>
                                                    <i className={`bi ${item.icon} text-2xl`}></i>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold dark:text-white text-slate-900 transition-colors duration-300">{item.tag} Active</h4>
                                                    <p className={`text-xs font-bold ${c.text} ${c.darkText} uppercase tracking-widest`}>System Optimal</p>
                                                </div>
                                            </div>
                                            <p className="text-sm dark:text-slate-400 text-slate-600">Enterprise operations fully synced and monitored.</p>
                                        </div>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================================== */}
            {/* 4. HOW IT WORKS â€” 3-Step Process                                   */}
            {/* ================================================================== */}
            <section className="py-20 lg:py-28 dark:bg-slate-900 bg-white relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-[url('/assets/images/grid.png')] opacity-[0.03] dark:opacity-[0.01] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">How It Works</span>
                        <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">From Assessment to Managed Operations</h2>
                        <p className="dark:text-slate-400 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed transition-colors duration-300">A proven onboarding process designed for zero disruption â€” most clients are fully operational within 30 days.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-0 opacity-50 dark:opacity-100"></div>
                        
                        {[
                            { step: "01", title: "Assess & Audit", desc: "Comprehensive audit of your infrastructure, security posture, and compliance gaps â€” prioritized roadmap delivered within 48 hours.", icon: "bi-clipboard-data-fill", color: "blue" },
                            { step: "02", title: "Architect & Secure", desc: "We design and deploy the optimal architecture â€” migrating systems, configuring monitoring, and establishing SLA-backed support.", icon: "bi-shield-lock-fill", color: "indigo" },
                            { step: "03", title: "Manage & Optimize", desc: "Continuous optimization, proactive patching, ticket resolution, and monthly executive reports on your IT health.", icon: "bi-graph-up-arrow", color: "purple" }
                        ].map((item, i) => {
                            const c = COLOR_MAP[item.color] || COLOR_MAP.blue;
                            return (
                            <div key={i} className="text-center px-8 relative z-10">
                                <div className={`w-20 h-20 ${c.bg} rounded-2xl flex items-center justify-center mx-auto mb-8 text-white shadow-xl ${c.shadow} transform hover:rotate-6 hover:scale-110 transition-all duration-300 border-4 dark:border-slate-800 border-white`}>
                                    <i className={`bi ${item.icon} text-3xl`}></i>
                                </div>
                                <div className={`${c.text} ${c.darkText} font-bold text-sm uppercase tracking-widest mb-3 transition-colors duration-300`}>Step {item.step}</div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-4 tracking-tight transition-colors duration-300">{item.title}</h3>
                                <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-sm transition-colors duration-300">{item.desc}</p>
                            </div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-16">
                        <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20 no-underline text-sm">
                            Schedule Your Free Assessment <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================================================================== */}
            {/* 5. STRATEGIC TECH PARTNERS                                         */}
            {/* ================================================================== */}
            <section className="py-20 lg:py-28 dark:bg-slate-950 bg-slate-50 relative overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 block">Certified Expertise</span>
                    <h2 className="text-4xl lg:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">Enterprise Technology Ecosystem</h2>
                    <p className="dark:text-slate-400 text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto mb-16 transition-colors duration-300">
                        We don't force you into proprietary boxes. BitGuard engineers hold elite certifications across the world's most powerful platforms, allowing us to manage, secure, and optimize the exact technology stack you rely on.
                    </p>

                    {/* Partnership Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
                        {[
                            { name: "Microsoft Gold Partner", icon: "bi-microsoft", type: "Cloud & OS", color: "text-blue-500" },
                            { name: "AWS Advanced Partner", icon: "bi-aws", type: "Infrastructure", color: "text-slate-800 dark:text-slate-300" },
                            { name: "CrowdStrike Certified", icon: "bi-shield-shaded", type: "XDR Security", color: "text-red-500" },
                            { name: "Cisco Meraki Provider", icon: "bi-router-fill", type: "Network Hardware", color: "text-emerald-500" },
                            { name: "Google Cloud Platform", icon: "bi-google", type: "Data & Cloud", color: "text-amber-500" },
                            { name: "Palo Alto Networks", icon: "bi-shield-check", type: "Zero-Trust Firewalls", color: "text-orange-500" },
                            { name: "VMware Enterprise", icon: "bi-hdd-network-fill", type: "Virtualization", color: "text-slate-500" },
                            { name: "SentinelOne Managed", icon: "bi-shield-plus", type: "Endpoint Defense", color: "text-purple-500" }
                        ].map((partner, i) => (
                            <div key={i} className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-6 md:p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl group">
                                <i className={`bi ${partner.icon} text-4xl md:text-5xl opacity-80 group-hover:opacity-100 transition-opacity ${partner.color}`}></i>
                                <div className="text-center">
                                    <div className="font-bold dark:text-white text-slate-900 text-xs md:text-sm mb-1">{partner.name}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{partner.type}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="inline-flex items-center gap-4 p-1.5 rounded-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm mx-auto flex-col sm:flex-row text-center sm:text-left w-full sm:w-auto">
                        <span className="px-4 py-2 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase tracking-widest whitespace-nowrap">Vendor Agnostic</span>
                        <span className="sm:pr-4 text-xs sm:text-sm font-semibold dark:text-slate-400 text-slate-600 mb-2 sm:mb-0">We architect the best tool for the job, never a forced ecosystem.</span>
                    </div>
                </div>
            </section>

            {/* ================================================================== */}
            {/* 6. TESTIMONIALS & FAQ                                              */}
            {/* ================================================================== */}
            <section className="py-20 lg:py-28 dark:bg-slate-900 bg-white relative overflow-hidden transition-colors duration-300">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="mb-20 text-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">Client Outcomes</span>
                        <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">Our Technology Partners</h2>
                        <p className="dark:text-slate-400 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed transition-colors duration-300">See how organizations like yours have transformed their IT operations and security posture with BitGuard.</p>
                    </div>

                    {/* Testimonial Cards â€” 3 cards for visual balance */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {[
                            {
                                quote: "BitGuard migrated our entire Azure infrastructure in two weeks with zero downtime. They also identified three critical vulnerabilities our previous vendor had missed during their last audit.",
                                name: "Sarah Jenkins",
                                title: "CTO",
                                company: "Finova Financial Group",
                                logoIcon: "bi-bank",
                                avatar: "https://i.pravatar.cc/150?img=11",
                                metric: "99.9% uptime achieved",
                                color: "blue"
                            },
                            {
                                quote: "The compliance automation alone justified the engagement. BitGuard had us SOC 2 audit-ready in under 30 days, and their continuous monitoring means we never scramble before quarterly reviews.",
                                name: "Marcus Chen",
                                title: "VP of Engineering",
                                company: "HealthTech Inc",
                                logoIcon: "bi-heart-pulse",
                                avatar: "https://i.pravatar.cc/150?img=33",
                                metric: "SOC2 in 28 days",
                                color: "indigo"
                            },
                            {
                                quote: "Their 15-minute SLA is contractual, not aspirational. We had a critical server failure at 2 AM on a Sunday and a Tier-2 engineer was actively working the issue within 8 minutes.",
                                name: "Rachel Torres",
                                title: "COO",
                                company: "DataVault Systems",
                                logoIcon: "bi-database-fill-lock",
                                avatar: "https://i.pravatar.cc/150?img=47",
                                metric: "93% fewer incidents",
                                color: "emerald"
                            }
                        ].map((testimonial, i) => {
                            const c = COLOR_MAP[testimonial.color] || COLOR_MAP.blue;
                            return (
                            <div key={i} className="dark:bg-slate-800 bg-white p-8 rounded-xl shadow-lg border dark:border-slate-700 border-slate-100 flex flex-col relative transition-colors duration-300">
                                <i className="bi bi-quote text-5xl text-blue-500/10 absolute top-4 left-4"></i>
                                
                                {/* Metric Badge */}
                                <div className={`inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-bold mb-6 ${c.bgLight} ${c.text} ${c.darkText} border ${c.border}`}>
                                    <i className="bi bi-graph-up-arrow"></i> {testimonial.metric}
                                </div>

                                <div className="flex text-amber-500 space-x-1 mb-4 relative z-10">
                                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                </div>
                                <p className="dark:text-slate-300 text-slate-700 text-base leading-relaxed mb-8 flex-grow relative z-10 italic transition-colors duration-300">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-4 relative z-10 mt-auto pt-4 border-t dark:border-slate-700/50 border-slate-100">
                                    <div className={`w-12 h-12 rounded-full bg-slate-700 overflow-hidden border-2 ${c.border}`}>
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold dark:text-white text-slate-900 transition-colors duration-300">{testimonial.name}</div>
                                        <div className="dark:text-slate-400 text-slate-600 text-sm transition-colors duration-300">{testimonial.title}</div>
                                    </div>
                                    <div className="flex flex-col items-center opacity-60">
                                        <i className={`bi ${testimonial.logoIcon} text-2xl dark:text-slate-500 text-slate-400`}></i>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1">{testimonial.company}</span>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>

                    {/* FAQ */}
                    <div className="max-w-3xl mx-auto pt-16 border-t dark:border-slate-800 border-slate-200 transition-colors duration-300">
                        <h3 className="text-3xl font-bold text-center dark:text-white text-slate-900 mb-12 tracking-tight transition-colors duration-300">Frequently Asked Questions</h3>
                        <div className="space-y-3">
                            {[
                                { q: "How fast can you migrate our existing infrastructure?", a: "Most standard migrations are completed within 14-30 days. We assign a dedicated architect who builds a phased migration plan to ensure zero disruption to daily operations." },
                                { q: "Do you support hybrid environments (On-premise + Cloud)?", a: "Yes â€” hybrid is our specialty. BitGuard seamlessly integrates on-premise servers, remote endpoints, and multi-cloud architectures (AWS, Azure, GCP) through a single unified dashboard." },
                                { q: "What's your average time-to-resolve?", a: "Our average time to resolve for critical severity incidents is under 22 minutes. We maintain strict SLAs in our Master Service Agreement ensuring a Tier-2 engineer is on the issue within 15 minutes." },
                                { q: "How do you handle compliance reporting?", a: "We provide automated, continuous compliance mapping for SOC 2, HIPAA, ISO 27001, and NIST frameworks. Our platform generates one-click audit reports that save you weeks of manual prep." },
                                { q: "What is included in the flat-rate monthly fee?", a: "24/7 proactive monitoring, unlimited remote helpdesk, managed EDR/antivirus, automated patch management, hardware asset tracking, and quarterly vCIO strategic planning meetings." },
                                { q: "How is pricing structured?", a: "We offer per-user, per-month flat-rate pricing with no hidden fees. Every plan includes our core monitoring, helpdesk, and security stack. Custom enterprise agreements are available for 200+ seats." }
                            ].map((faq, i) => (
                                <div key={i} className={`dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${activeAccordion === i ? 'border-l-2 border-l-blue-500' : ''}`}>
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                                        className="w-full px-8 py-5 text-left flex justify-between items-center focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800/80 transition-colors"
                                    >
                                        <span className="font-bold dark:text-slate-200 text-slate-800 transition-colors duration-300">{faq.q}</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ml-4 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 ${activeAccordion === i ? 'rotate-180 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : ''}`}>
                                            <i className="bi bi-chevron-down"></i>
                                        </div>
                                    </button>
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="px-8 pb-6 dark:text-slate-400 text-slate-600 leading-relaxed border-t dark:border-slate-700 border-slate-100 pt-5 transition-colors duration-300 text-sm">
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>




            {/* ================================================================== */}
            {/* 7. FINAL CTA + NEWSLETTER                                          */}
            {/* ================================================================== */}
            <section className="dark:bg-slate-950 bg-slate-50 relative overflow-hidden transition-colors duration-300 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Announcements */}
                {announcements.length > 0 && (
                    <div className="container mx-auto px-4 pt-20 pb-12 relative z-10 border-b dark:border-slate-800/50 border-slate-200 text-left transition-colors duration-300">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div>
                                <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-2 block">Platform Updates</span>
                                <h2 className="text-3xl font-bold dark:text-white text-slate-900 tracking-tight transition-colors duration-300">The latest from BitGuard.</h2>
                            </div>
                            <button onClick={() => navigate('/blog')} className="text-blue-500 font-bold text-sm flex items-center gap-2 hover:text-blue-400 transition-colors">
                                View All Notes <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {announcements.slice(0, 3).map((ann, idx) => (
                                <div key={idx} className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg dark:hover:border-slate-700 hover:border-slate-300 transition-all cursor-pointer group hover:-translate-y-1">
                                    <div className="p-8">
                                        <div className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <i className="bi bi-calendar-event"></i> {new Date(ann.date).toLocaleDateString()}
                                        </div>
                                        <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-3 group-hover:text-blue-500 transition-colors">
                                            {ann.title}
                                        </h3>
                                        <p className="dark:text-slate-400 text-slate-600 text-sm line-clamp-2 leading-relaxed transition-colors duration-300">{ann.content}</p>
                                        <div className="mt-6 text-sm font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Read more &rarr;</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main CTA */}
                <div className="py-20 lg:py-24 container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-8 tracking-tight transition-colors duration-300">
                        Ready to Modernize <br className="hidden md:block"/>Your IT Operations?
                    </h2>
                    <p className="dark:text-slate-400 text-slate-600 text-lg max-w-2xl mx-auto mb-12 leading-relaxed transition-colors duration-300">
                        Talk to our engineering team about how BitGuard can reduce your attack surface, improve uptime, and simplify vendor management â€” starting this month.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
                        <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 w-full sm:w-auto transform active:scale-[0.98] no-underline text-sm">
                            Schedule a Consultation
                        </Link>
                        <Link to="/solutions/bitguard-bundle" className="dark:text-slate-300 text-slate-700 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors w-full sm:w-auto text-sm flex items-center justify-center gap-2 no-underline">
                           View All Solutions <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="max-w-lg mx-auto">
                        <p className="dark:text-slate-500 text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 transition-colors duration-300">Subscribe to the BitGuard Brief</p>
                        <p className="dark:text-slate-600 text-slate-500 text-xs mb-4 transition-colors duration-300">Monthly cybersecurity intel and IT strategy insights for technology leaders.</p>
                        <form className="flex gap-2" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Enter your work email"
                                required
                                disabled={newsletterStatus.type === 'loading' || newsletterStatus.type === 'success'}
                                className={`flex-1 px-5 py-3 rounded-xl dark:bg-slate-900 bg-white border border-slate-300 dark:border-slate-700 dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm ${newsletterStatus.type === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            />
                            <button disabled={newsletterStatus.type === 'loading' || newsletterStatus.type === 'success'} type="submit" className={`px-6 py-3 dark:bg-white bg-slate-900 dark:text-slate-900 text-white rounded-xl font-bold text-sm dark:hover:bg-slate-100 hover:bg-slate-800 transition-all flex-shrink-0 flex items-center justify-center min-w-[120px] ${newsletterStatus.type === 'loading' || newsletterStatus.type === 'success' ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 shadow-md hover:shadow-lg'}`}>
                                {newsletterStatus.type === 'loading' ? (
                                    <div className="w-5 h-5 border-2 border-slate-400 border-t-white dark:border-slate-400 dark:border-t-slate-900 rounded-full animate-spin"></div>
                                ) : newsletterStatus.type === 'success' ? (
                                    <span className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-emerald-500 dark:text-emerald-500"></i> Done</span>
                                ) : 'Subscribe'}
                            </button>
                        </form>
                        <div className="h-6 mt-3">
                            {newsletterStatus.message && (
                                <p className={`text-xs ${newsletterStatus.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'} font-bold transition-all duration-300 animate-fade-in-up`}>
                                    {newsletterStatus.type === 'success' && <i className="bi bi-shield-check mr-1"></i>}
                                    {newsletterStatus.type === 'error' && <i className="bi bi-exclamation-triangle mr-1"></i>}
                                    {newsletterStatus.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;

