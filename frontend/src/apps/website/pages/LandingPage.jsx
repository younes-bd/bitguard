import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import client from '../../../core/api/client';
import SectionDivider from '../../../core/components/SectionDivider';
import '../../../core/styles/landing.css';

const LandingPage = () => {
    const [videoOpen, setVideoOpen] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);

    const openVideo = () => setVideoOpen(true);
    const closeVideo = () => setVideoOpen(false);
    
    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const navigate = useNavigate();

    // Newsletter State
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState({ type: '', message: '' });

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setNewsletterStatus({ type: 'loading', message: 'Subscribing...' });
        try {
            await axios.post('http://127.0.0.1:8000/api/home/signups/', { email: newsletterEmail });
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

    const heroAnnouncement = announcements.length > 0 ? announcements[0] : null;

    return (
        <div className="dark:bg-slate-950 bg-slate-50 font-sans dark:text-slate-300 text-slate-800 selection:bg-sky-500/30 transition-colors duration-300">
            
            {/* ================================================================== */}
            {/* 1. DARK — Hero Section                                            */}
            {/* ================================================================== */}
            <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 dark:bg-slate-950 bg-slate-50 overflow-hidden transition-colors duration-300" id="hero-section">
                {/* Enterprise Mesh Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 dark:bg-[#0a0f1c] dark:mix-blend-multiply"></div>
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(56,189,248,0.05),transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(56,189,248,0.15),transparent)]"></div>
                    <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.03] dark:opacity-10" style={{ backgroundSize: '40px 40px' }}></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full dark:bg-blue-500/10 bg-blue-100 border dark:border-blue-500/20 border-blue-200 text-blue-600 dark:text-blue-300 text-xs font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        {heroAnnouncement ? heroAnnouncement.title : "Enterprise-Grade IT Infrastructure"}
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 dark:text-white text-slate-900 tracking-tight leading-[1.1] transition-colors duration-300">
                        Enterprise Managed IT <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">& Cybersecurity Platform</span>
                    </h1>

                    <p className="text-xl dark:text-slate-400 text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed transition-colors duration-300">
                        From proactive infrastructure management to advanced threat protection, BitGuard provides the complete technology backbone your business needs to scale securely and stay compliant.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link to="/contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] flex items-center gap-2 transform active:scale-[0.98] no-underline">
                            <span>Book a Consultation</span>
                            <i className="bi bi-arrow-right"></i>
                        </Link>
                        <button onClick={openVideo} className="px-8 py-4 dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 dark:hover:bg-white/10 hover:bg-slate-50 dark:text-white text-slate-900 rounded-xl font-bold transition-all flex items-center gap-2 transform active:scale-[0.98]">
                            <i className="bi bi-play-circle-fill text-blue-600 dark:text-blue-400 text-lg"></i>
                            <span>See Our Solutions</span>
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
                        {['SOC2 Type II', 'ISO 27001', 'HIPAA Ready', 'GDPR Compliant', 'NIST CSF'].map((cert, i) => (
                            <div key={i} className="flex items-center gap-2 dark:text-slate-400 text-slate-600 font-semibold text-xs tracking-wide dark:bg-white/5 bg-white/60 px-4 py-2 rounded-full border dark:border-white/10 border-slate-200 backdrop-blur-sm transition-colors duration-300">
                                <i className="bi bi-patch-check-fill text-emerald-500"></i> {cert}
                            </div>
                        ))}
                    </div>

                    {/* Stat Counters */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {[
                            { value: "500+", label: "Clients Protected" },
                            { value: "99.9%", label: "Uptime Guarantee" },
                            { value: "<15min", label: "Response SLA" },
                            { value: "24/7/365", label: "SOC Monitoring" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 tracking-tight transition-colors duration-300">{stat.value}</div>
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Video Modal */}
                {videoOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
                        <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border border-slate-800 ring-4 ring-slate-900/50">
                            <button onClick={closeVideo} className="absolute top-4 right-4 w-10 h-10 bg-slate-900/50 hover:bg-red-500 text-white flex items-center justify-center rounded-full z-10 transition-colors backdrop-blur">
                                <i className="bi bi-x-lg text-xl"></i>
                            </button>
                            <iframe 
                                className="w-full h-full" 
                                src="https://www.youtube.com/embed/uYp8C4P1g6w?si=llcTrXPRM-MRXDZB&controls=0&rel=0&showinfo=0&autoplay=1&mute=1" 
                                title="BitGuard Platform Overview" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            </section>

            <SectionDivider variant="angle" from="dark" to="light" />

            {/* ================================================================== */}
            {/* 2. LIGHT — Dashboard Preview + 6 Service Cards                     */}
            {/* ================================================================== */}
            <section className="dark:bg-slate-900 bg-white relative z-20 pb-24 transition-colors duration-300">
                <div className="container mx-auto px-4 -mt-32 lg:-mt-48 relative z-30 mb-20 md:mb-32">
                    {/* Interactive UI Mockup: BitGuard Command Center */}
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border dark:border-slate-800 border-slate-200 dark:bg-[#0a0f1c] bg-white p-0 hover:-translate-y-2 transition-all duration-700 flex flex-col h-[500px] xl:h-[650px] ring-1 dark:ring-white/10 ring-slate-900/5 group text-left">
                        
                        {/* macOS Window Header */}
                        <div className="h-12 border-b dark:border-slate-800 border-slate-200 dark:bg-slate-900/50 bg-slate-50 flex items-center px-4 justify-between backdrop-blur-md">
                            <div className="flex gap-2 w-16">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="text-xs font-bold dark:text-slate-400 text-slate-500 tracking-widest flex items-center gap-2">
                                <i className="bi bi-shield-lock-fill text-blue-500 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"></i> BITGUARD COMMAND CENTER
                            </div>
                            <div className="w-16 flex justify-end">
                                <i className="bi bi-wifi text-slate-400 text-xs"></i>
                            </div>
                        </div>
                        
                        {/* Dashboard Content */}
                        <div className="flex-1 flex overflow-hidden">
                            
                            {/* Left Sidebar */}
                            <div className="hidden sm:flex w-16 border-r dark:border-slate-800 border-slate-200 flex-col items-center py-6 gap-6 dark:bg-slate-900/30 bg-slate-50">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-500/20 transition-colors border border-blue-500/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]"><i className="bi bi-grid-1x2-fill text-xl"></i></div>
                                <div className="w-10 h-10 rounded-xl dark:text-slate-500 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 transition-colors"><i className="bi bi-map-fill text-xl"></i></div>
                                <div className="w-10 h-10 rounded-xl dark:text-slate-500 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 transition-colors"><i className="bi bi-shield-exclamation text-xl"></i></div>
                                <div className="w-10 h-10 rounded-xl dark:text-slate-500 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 transition-colors"><i className="bi bi-activity text-xl"></i></div>
                                <div className="mt-auto w-10 h-10 rounded-xl dark:text-slate-500 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 transition-colors"><i className="bi bi-gear-fill text-xl"></i></div>
                            </div>

                            {/* Main View Data */}
                            <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                                
                                {/* Top Metrics Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative z-10">
                                    <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-5 backdrop-blur-sm group-hover:border-blue-500/30 transition-colors shadow-sm">
                                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Network Health</div>
                                        <div className="flex items-end gap-3">
                                            <div className="text-3xl font-bold dark:text-white text-slate-900 font-mono tracking-tight">99.999%</div>
                                            <div className="text-emerald-500 text-sm font-bold flex items-center"><i className="bi bi-arrow-up-short text-lg"></i> SLA</div>
                                        </div>
                                    </div>
                                    <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-5 backdrop-blur-sm group-hover:border-red-500/30 transition-colors shadow-sm">
                                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 flex justify-between">
                                            <span>Threats Blocked</span>
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <div className="text-3xl font-bold dark:text-white text-slate-900 font-mono tracking-tight">14,205</div>
                                            <div className="text-red-500 text-sm font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Past 24H</div>
                                        </div>
                                    </div>
                                    <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-5 backdrop-blur-sm group-hover:border-indigo-500/30 transition-colors shadow-sm hidden md:block">
                                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Active Elements</div>
                                        <div className="flex items-end gap-3">
                                            <div className="text-3xl font-bold dark:text-white text-slate-900 font-mono tracking-tight">1,248</div>
                                            <div className="text-indigo-500 text-sm font-bold flex items-center gap-1"><i className="bi bi-hdd-stack-fill"></i> Online</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Split View */}
                                <div className="flex-1 flex flex-col xl:flex-row gap-6 relative z-10 min-h-0">
                                    
                                    {/* Visual Grid Map */}
                                    <div className="flex-[5] dark:bg-slate-900/40 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl p-6 relative overflow-hidden flex flex-col shadow-inner">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-500/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-1000"></div>
                                        <div className="flex justify-between items-center mb-6 relative z-10">
                                            <h4 className="font-bold dark:text-white text-slate-800 flex items-center gap-2"><i className="bi bi-diagram-3-fill text-blue-500"></i> Global Infrastructure</h4>
                                            <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-500/20 shadow-[0_0_10px_rgba(56,189,248,0.2)]">Live Sync</span>
                                        </div>
                                        <div className="flex-1 relative z-10 flex items-center justify-center">
                                            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 sm:gap-4 md:gap-5 w-full h-full p-2 place-content-center place-items-center">
                                                {Array.from({length: 40}).map((_, i) => (
                                                    <div key={i} className="relative group/node w-2 h-2 sm:w-3 sm:h-3">
                                                        <div className={`w-full h-full rounded-full transition-all duration-500 ${[3, 12, 19, 27, 34, 38].includes(i) ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)] scale-125' : 'bg-slate-300 dark:bg-slate-700 group-hover/node:bg-blue-400 group-hover/node:shadow-[0_0_10px_rgba(56,189,248,0.8)]'}`}></div>
                                                        {((i === 12) || (i === 27)) && (
                                                            <div className="absolute -inset-2 border-2 border-emerald-500/40 rounded-full animate-ping"></div>
                                                        )}
                                                        {i === 19 && (
                                                            <div className="absolute top-1/2 left-1/2 w-8 border-t-2 border-dashed border-indigo-500/50 -translate-y-1/2 origin-left rotate-45 pointer-events-none"></div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Live Console Feed */}
                                    <div className="flex-[4] dark:bg-[#050914] bg-slate-900 rounded-xl border dark:border-slate-800 border-slate-700 p-5 flex flex-col font-mono relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50"></div>
                                        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3 mt-1">
                                            <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><i className="bi bi-shield-check text-emerald-500"></i> Event Stream</h4>
                                            <i className="bi bi-terminal text-slate-500"></i>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-end text-[11px] sm:text-xs space-y-3 leading-relaxed">
                                            <div className="text-slate-500">System initialized. Secure connection established.</div>
                                            <div className="text-emerald-400"><span className="text-slate-600 mr-2">[10:41:02]</span> Backup sync completed across 4 regions.</div>
                                            <div className="text-blue-400"><span className="text-slate-600 mr-2">[10:41:15]</span> Policy push: User access control updated remotely.</div>
                                            <div className="text-amber-400"><span className="text-slate-600 mr-2">[10:42:01]</span> Warning: High baseline CPU load on Node-Alpha-7.</div>
                                            <div className="text-red-400 font-bold bg-red-950/40 border border-red-900/50 p-1.5 -mx-1.5 px-1.5 rounded-md"><span className="text-slate-500 mr-2 font-normal">[10:42:19]</span> CRITICAL: Unauthorized login blocked from IP 192.168.1.1</div>
                                            <div className="text-emerald-400"><span className="text-slate-600 mr-2">[10:42:20]</span> Zero-Trust agent successfully dynamically banned IP.</div>
                                            <div className="text-slate-300 flex items-center gap-2 mt-4 bg-slate-800/50 p-2 rounded border border-slate-800">
                                                <span className="text-blue-500 font-bold">root@bitguard:~$</span>
                                                <span className="w-2 h-4 bg-slate-400 animate-pulse"></span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 pb-20 text-center border-b dark:border-slate-800 border-slate-200 transition-colors duration-300">
                    <p className="text-slate-500 font-bold uppercase tracking-widest mb-10 text-sm">Trusted By Industry Leaders</p>
                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <i className="bi bi-microsoft text-4xl md:text-5xl text-blue-600 hover:scale-110 transition-transform"></i>
                        <i className="bi bi-amazon text-4xl md:text-5xl dark:text-slate-400 text-slate-800 hover:scale-110 transition-transform"></i>
                        <i className="bi bi-google text-4xl md:text-5xl text-red-500 hover:scale-110 transition-transform"></i>
                        <div className="h-8 w-px dark:bg-slate-700 bg-slate-300 hidden md:block"></div>
                        <div className="flex items-center gap-2 dark:text-slate-300 text-slate-800 font-bold font-mono text-xl"><i className="bi bi-hexagon-fill text-blue-600"></i> ACME</div>
                        <div className="flex items-center gap-2 dark:text-slate-300 text-slate-800 font-bold font-mono text-xl"><i className="bi bi-triangle-fill text-indigo-600"></i> GLOBEX</div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-24">
                     <div className="mb-16 text-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">Core Solutions</span>
                        <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">Enterprise IT Services</h2>
                        <p className="dark:text-slate-400 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed transition-colors duration-300">We handle the complex technology stacks so you can focus entirely on growing your business and dominating your market.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Managed IT Services", desc: "Proactive 24/7 network monitoring, helpdesk support, patch management, and hardware lifecycle tracking to eliminate downtime and keep every endpoint running at peak performance.", icon: "bi-display", link: "/solutions/managed-detection-response", color: "blue" },
                            { title: "Cybersecurity Defense", desc: "AI-driven threat detection, endpoint protection (EDR/XDR), SIEM monitoring, vulnerability assessments, and 24/7 SOC operations to protect your digital perimeter from advanced threats.", icon: "bi-shield-lock", link: "/solutions/bitguard-bundle", color: "indigo" },
                            { title: "Cloud & Infrastructure", desc: "Expert cloud migration, hybrid architecture design, and continuous optimization across AWS, Azure, and Google Cloud — plus Microsoft 365 management and secure private cloud deployments.", icon: "bi-cloud-arrow-up", link: "/solutions/azure-aws", color: "emerald" },
                            { title: "Digital Transformation", desc: "Modernize legacy systems with workflow automation, custom web & app development, full-stack engineering, and business process re-engineering to accelerate your digital journey.", icon: "bi-lightning-charge", link: "/solutions/digital-transformation", color: "purple" },
                            { title: "Consulting & Co-Managed IT", desc: "Augment your internal IT team with specialized engineers. Our co-managed model provides flexible staff augmentation, strategic CTO advisory, and project-based support exactly when you need it.", icon: "bi-people", link: "/solutions/staff-augmentation", color: "amber" },
                            { title: "Compliance & Governance", desc: "Navigate complex regulatory requirements with automated compliance monitoring for SOC2, HIPAA, GDPR, PCI-DSS, NIST, and ISO 27001 — including audit preparation and continuous risk scoring.", icon: "bi-clipboard-data", link: "/compliance", color: "cyan" }
                        ].map((item, i) => (
                            <div key={i} className="group dark:bg-slate-800 bg-white p-8 rounded-2xl shadow-lg border dark:border-slate-700 border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col" style={{borderTopColor: `var(--tw-shadow-color, transparent)`}}>
                                <div className={`w-16 h-16 bg-${item.color}-600 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg shadow-${item.color}-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    <i className={`bi ${item.icon} text-3xl`}></i>
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-4 tracking-tight transition-colors duration-300">{item.title}</h3>
                                <p className="dark:text-slate-400 text-slate-600 mb-8 leading-relaxed flex-grow text-sm transition-colors duration-300">{item.desc}</p>
                                <Link to={item.link} className={`inline-flex items-center text-${item.color}-600 dark:text-${item.color}-400 font-bold hover:text-${item.color}-800 dark:hover:text-${item.color}-300 tracking-wide uppercase text-sm mt-auto no-underline transition-colors duration-300`}>
                                    Explore Service <i className="bi bi-arrow-right ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="angle" from="light" to="dark" />

            {/* ================================================================== */}
            {/* 3. DARK — Why BitGuard (Value Proposition)                         */}
            {/* ================================================================== */}
            <section className="py-24 dark:bg-slate-950 bg-slate-50 dark:text-white text-slate-900 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-1/3 h-full dark:bg-slate-900 bg-white skew-x-12 opacity-50 pointer-events-none border-l dark:border-slate-800 border-slate-200"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div>
                            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 block">Why 500+ Businesses Trust Us</span>
                            <h2 className="text-4xl lg:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                                Your Unfair Advantage <br />in Technology
                            </h2>
                            <p className="dark:text-slate-400 text-slate-600 text-lg leading-relaxed mb-10 transition-colors duration-300">
                                Technology shouldn't be a bottleneck. BitGuard acts as a force multiplier for your business — eliminating IT complexity so you can focus on growth, innovation, and competitive advantage.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { title: "Single Pane of Glass", desc: "Manage every asset, ticket, endpoint, and compliance check from one unified dashboard — no tool sprawl.", icon: "bi-grid-1x2-fill", color: "blue" },
                                    { title: "Zero-Downtime Migrations", desc: "Our architects handle the heavy lifting of cloud migration, office relocations, and M&A integrations seamlessly.", icon: "bi-arrow-left-right", color: "green" },
                                    { title: "15-Minute SLA Guarantee", desc: "Tier-2 engineers respond in under 15 minutes, 24/7/365. No chatbots, no ticket queues — real humans, real fast.", icon: "bi-stopwatch", color: "amber" },
                                    { title: "Predictable Flat-Rate Pricing", desc: "No surprise invoices. Per-device or per-user monthly pricing that scales transparently with your company.", icon: "bi-receipt", color: "purple" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start dark:bg-slate-900/50 bg-white p-5 rounded-xl border dark:border-slate-800 border-slate-200 shadow-sm hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-colors group">
                                        <div className={`w-12 h-12 flex-shrink-0 bg-${item.color}-500/20 rounded-xl flex items-center justify-center text-${item.color}-600 dark:text-${item.color}-400 border border-${item.color}-500/20 mr-4 mt-0.5 group-hover:scale-110 transition-transform`}>
                                            <i className={`bi ${item.icon} text-xl`}></i>
                                        </div>
                                        <div>
                                            <span className="font-bold dark:text-slate-200 text-slate-800 block mb-1 transition-colors duration-300">{item.title}</span>
                                            <span className="text-sm dark:text-slate-500 text-slate-600 leading-relaxed transition-colors duration-300">{item.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative mt-12 lg:mt-0">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl transform rotate-3 opacity-30 blur-sm"></div>
                            <div className="relative rounded-xl overflow-hidden shadow-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white p-1">
                                <div className="rounded-2xl overflow-hidden relative border dark:border-slate-900 border-slate-100">
                                    <img src="/assets/images/home/unified.jpg" alt="BitGuard Platform" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transform hover:scale-105 transition-all duration-700" onError={(e) => e.target.src = 'https://placehold.co/800x600/1e293b/475569?text=Enterprise+Platform'} />
                                    <div className="absolute inset-0 bg-blue-900/20 pointer-events-none mix-blend-overlay"></div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -left-10 dark:bg-slate-900 bg-white p-6 rounded-2xl shadow-xl border dark:border-slate-800 border-slate-200 max-w-xs hidden lg:block transition-colors duration-300">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 bg-green-900/40 rounded-xl flex items-center justify-center text-green-500 dark:text-green-400 border border-green-500/20">
                                        <i className="bi bi-activity text-2xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold dark:text-white text-slate-900 transition-colors duration-300">System Status</h4>
                                        <p className="text-xs font-bold text-green-500 dark:text-green-400 uppercase tracking-widest">All Systems Operational</p>
                                    </div>
                                </div>
                                <p className="text-sm dark:text-slate-400 text-slate-600 transition-colors duration-300">Real-time monitoring across 12,000+ endpoints.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="wave" from="dark" to="light" />

            {/* ================================================================== */}
            {/* 4. LIGHT — How It Works (3-Step Process)                           */}
            {/* ================================================================== */}
            <section className="py-24 dark:bg-slate-900 bg-white relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.01] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">Getting Started</span>
                        <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">Three Steps to IT Freedom</h2>
                        <p className="dark:text-slate-400 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed transition-colors duration-300">From initial assessment to full managed operations — we make the transition seamless, fast, and zero-disruption.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-0 opacity-50 dark:opacity-100"></div>
                        
                        {[
                            { step: "01", title: "Assess & Audit", desc: "We perform a comprehensive audit of your existing infrastructure, security posture, compliance gaps, and operational pain points — delivering a prioritized roadmap within 48 hours.", icon: "bi-clipboard-data-fill", color: "blue" },
                            { step: "02", title: "Architect & Secure", desc: "Our engineers design and implement the optimal architecture — migrating systems, deploying security layers, configuring monitoring, and establishing SLA-backed support channels.", icon: "bi-shield-lock-fill", color: "indigo" },
                            { step: "03", title: "Manage & Optimize", desc: "With your infrastructure fully managed, we continuously optimize performance, patch vulnerabilities, resolve tickets, and deliver monthly executive reports on your IT health.", icon: "bi-graph-up-arrow", color: "purple" }
                        ].map((item, i) => (
                            <div key={i} className="text-center px-8 relative z-10">
                                <div className={`w-20 h-20 bg-${item.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-8 text-white shadow-xl shadow-${item.color}-600/30 transform hover:rotate-6 hover:scale-110 transition-all duration-300 border-4 dark:border-slate-800 border-white`}>
                                    <i className={`bi ${item.icon} text-3xl`}></i>
                                </div>
                                <div className={`text-${item.color}-600 dark:text-${item.color}-400 font-bold text-sm uppercase tracking-widest mb-3 transition-colors duration-300`}>Step {item.step}</div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-4 tracking-tight transition-colors duration-300">{item.title}</h3>
                                <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-sm transition-colors duration-300">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 dark:bg-blue-600 bg-slate-900 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-xl no-underline">
                            Start Your Free Assessment <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="gradient" from="light" to="dark" />

            {/* ================================================================== */}
            {/* 5. DARK — Developer API + Integration Partners                     */}
            {/* ================================================================== */}
            <section className="py-24 dark:bg-slate-950 bg-slate-50 relative overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
                <div className="container mx-auto px-4 relative z-10">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 block">Developer First</span>
                            <h2 className="text-4xl lg:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">Integrations That Actually Work</h2>
                            <p className="dark:text-slate-400 text-slate-600 text-lg leading-relaxed mb-8 transition-colors duration-300">
                                BitGuard isn't a black box. Our platform features a robust, fully documented REST API that allows you to pipe security events directly into your existing SIEM, sync assets with your HR tools, or trigger custom automated workflows.
                            </p>
                            <div className="flex flex-wrap gap-4 mb-10">
                                {['RESTful API', 'Webhooks', 'GraphQL Beta', '99.99% Uptime'].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm font-bold dark:bg-slate-900 bg-white dark:text-slate-300 text-slate-700 px-4 py-2 rounded-lg border dark:border-slate-800 border-slate-200 shadow-sm transition-colors duration-300">
                                        <i className="bi bi-check2 text-blue-500"></i> {feature}
                                    </div>
                                ))}
                            </div>
                            <Link to="/contact" className="text-blue-500 font-bold hover:text-blue-400 transition-colors flex items-center gap-2 no-underline">
                                Request API Early Access <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>

                        {/* Code Snippet Window */}
                        <div className="rounded-xl overflow-hidden border dark:border-slate-800 border-slate-300 shadow-xl dark:bg-slate-900 bg-slate-800 transition-colors duration-300">
                            <div className="flex items-center gap-2 px-4 py-3 border-b dark:border-slate-800 border-slate-700 bg-slate-900/50">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <div className="text-xs text-slate-500 ml-4 font-mono">bitguard-client.js</div>
                            </div>
                            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-slate-300">
                                <pre className="text-slate-300">
<span className="text-pink-400">import</span> {"{ "}BitGuard{" }"} <span className="text-pink-400">from</span> <span className="text-green-300">'@bitguard/sdk'</span>;

<span className="text-pink-400">const</span> client = <span className="text-pink-400">new</span> <span className="text-yellow-200">BitGuard</span>({"{ "}
    <span className="text-blue-300">apiKey</span>: process.env.<span className="text-purple-300">BG_API_KEY</span>,
{" }"});

<span className="text-slate-500">// Provision a new secure environment</span>
<span className="text-pink-400">const</span> result = <span className="text-pink-400">await</span> client.<span className="text-blue-300">environments</span>.<span className="text-blue-300">create</span>({"{ "}
    <span className="text-blue-300">region</span>: <span className="text-green-300">'us-east-1'</span>,
    <span className="text-blue-300">securityProfile</span>: <span className="text-green-300">'strict-soc2'</span>,
    <span className="text-blue-300">autoScale</span>: <span className="text-orange-300">true</span>
{" }"});

<span className="text-cyan-300">console</span>.<span className="text-blue-300">log</span>(result);
<span className="text-slate-500">// {">"} {'{ "status": "provisioning", "eta_minutes": 15 }'}</span>
                                </pre>
                            </div>
                        </div>
                   </div>

                   {/* Technology Partners */}
                   <div className="mt-32 border-t dark:border-slate-800 border-slate-200 pt-16 transition-colors duration-300">
                       <p className="text-center dark:text-slate-500 text-slate-600 font-bold uppercase tracking-widest text-xs mb-10 transition-colors duration-300">Pre-Built Integrations With Your Existing Stack</p>
                       <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                           {/* Using text representations as placeholders for partner logos */}
                           <div className="text-xl font-bold dark:text-slate-400 text-slate-700 flex items-center gap-2"><i className="bi bi-slack text-2xl"></i> Slack</div>
                           <div className="text-xl font-bold dark:text-slate-400 text-slate-700 flex items-center gap-2"><i className="bi bi-jira text-2xl"></i> Jira</div>
                           <div className="text-xl font-bold dark:text-slate-400 text-slate-700 flex items-center gap-2"><i className="bi bi-github text-2xl"></i> GitHub</div>
                           <div className="text-xl font-bold dark:text-slate-400 text-slate-700 flex items-center gap-2"><i className="bi bi-microsoft-teams text-2xl"></i> Teams</div>
                           <div className="text-xl font-bold dark:text-slate-400 text-slate-700 flex items-center gap-2"><i className="bi bi-aws text-2xl"></i> AWS</div>
                       </div>
                   </div>
                </div>
            </section>
            
            <SectionDivider variant="wave" from="dark" to="light" flip={true} />

            {/* ================================================================== */}
            {/* 6. LIGHT — Testimonials & FAQ                                      */}
            {/* ================================================================== */}
            <section className="py-24 dark:bg-slate-900 bg-white relative overflow-hidden transition-colors duration-300">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="mb-20 text-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">Client Success</span>
                        <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">Don't Just Take Our Word For It</h2>
                    </div>

                    {/* Testimonial Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                        <div className="dark:bg-slate-800 bg-white p-10 rounded-xl shadow-lg border dark:border-slate-700 border-slate-100 flex flex-col relative transition-colors duration-300">
                            <i className="bi bi-quote text-6xl text-blue-500/20 absolute top-6 left-6"></i>
                            <div className="flex text-amber-500 space-x-1 mb-6 relative z-10">
                                <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                            </div>
                            <p className="dark:text-slate-300 text-slate-700 text-lg md:text-xl leading-relaxed mb-10 flex-grow relative z-10 italic transition-colors duration-300">
                                "Moving to BitGuard was the best IT decision we've made. They completely overhauled our cloud infrastructure in two weeks with zero downtime, and their security team caught a phishing attempt that our previous vendor missed entirely."
                            </p>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden border-2 border-blue-500">
                                    <img src="https://i.pravatar.cc/150?img=11" alt="Sarah J." className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-bold dark:text-white text-slate-900 text-lg transition-colors duration-300">Sarah Jenkins</div>
                                    <div className="dark:text-slate-400 text-slate-600 text-sm transition-colors duration-300">CTO, Finova Financial</div>
                                </div>
                            </div>
                        </div>
                        <div className="dark:bg-slate-800 bg-white p-10 rounded-xl shadow-lg border dark:border-slate-700 border-slate-100 flex flex-col relative transition-colors duration-300 md:translate-y-8">
                            <i className="bi bi-quote text-6xl text-blue-500/20 absolute top-6 left-6"></i>
                            <div className="flex text-amber-500 space-x-1 mb-6 relative z-10">
                                <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                            </div>
                            <p className="dark:text-slate-300 text-slate-700 text-lg md:text-xl leading-relaxed mb-10 flex-grow relative z-10 italic transition-colors duration-300">
                                "The compliance automation alone is worth the price. BitGuard got us SOC2 ready in less than a month, and the continuous monitoring means we don't have to scramble before every audit. Absolutely game-changing."
                            </p>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden border-2 border-indigo-500">
                                    <img src="https://i.pravatar.cc/150?img=33" alt="Marcus C." className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-bold dark:text-white text-slate-900 text-lg transition-colors duration-300">Marcus Chen</div>
                                    <div className="dark:text-slate-400 text-slate-600 text-sm transition-colors duration-300">VP Engineering, HealthTech Inc</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="max-w-3xl mx-auto pt-16 border-t dark:border-slate-800 border-slate-200 transition-colors duration-300">
                        <h3 className="text-3xl font-bold text-center dark:text-white text-slate-900 mb-12 tracking-tight transition-colors duration-300">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            {[
                                { q: "How fast can you migrate our existing infrastructure?", a: "Most standard migrations are completed within 14-30 days. We assign a dedicated architect to your account who builds a phased migration plan to ensure absolutely zero disruption to your daily operations during the cutover." },
                                { q: "Do you support hybrid environments (On-premise + Cloud)?", a: "Yes. In fact, hybrid environments are our specialty. BitGuard seamlessly integrates and monitors on-premise servers, remote endpoints, and multi-cloud architectures (AWS, Azure, GCP) through a single unified dashboard." },
                                { q: "What is included in the flat-rate monthly fee?", a: "Our managed IT bundle includes 24/7 proactive monitoring, unlimited remote helpdesk support, managed EDR/antivirus, automated patch management, hardware asset tracking, and quarterly vCIO strategic planning meetings." },
                                { q: "How does the 15-minute SLA work?", a: "If you submit a critical severity ticket, a certified Tier-2 or Tier-3 engineer will actively begin working on it within 15 minutes, 24/7/365. This is backed by financial penalties in our Master Service Agreement." }
                            ].map((faq, i) => (
                                <div key={i} className="dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 rounded-xl overflow-hidden transition-all duration-300">
                                    <button 
                                        onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                                        className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800/80 transition-colors"
                                    >
                                        <span className="font-bold dark:text-slate-200 text-slate-800 text-lg transition-colors duration-300">{faq.q}</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 ${activeAccordion === i ? 'rotate-180 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : ''}`}>
                                            <i className="bi bi-chevron-down"></i>
                                        </div>
                                    </button>
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="px-8 pb-8 dark:text-slate-400 text-slate-600 leading-relaxed border-t dark:border-slate-700 border-slate-100 pt-6 transition-colors duration-300">
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <SectionDivider variant="gradient" from="light" to="dark" />

            {/* ================================================================== */}
            {/* 7. DARK — Final CTA + Newsletter                                  */}
            {/* ================================================================== */}
            <section className="dark:bg-slate-950 bg-slate-50 relative overflow-hidden border-t dark:border-slate-800 border-slate-200 transition-colors duration-300 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Announcements */}
                {announcements.length > 0 && (
                    <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 border-b dark:border-slate-800/50 border-slate-200 text-left transition-colors duration-300">
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
                <div className="py-24 md:py-32 container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold dark:text-white text-slate-900 mb-8 tracking-tight transition-colors duration-300">
                        Stop Managing IT. <br className="hidden md:block"/>Start Growing.
                    </h2>
                    <p className="dark:text-slate-400 text-slate-600 text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed transition-colors duration-300">
                        Offload your infrastructure, security, and support operations to BitGuard so you can focus entirely on scaling your product and delighting your customers.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
                        <Link to="/contact" className="px-10 py-5 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 w-full sm:w-auto transform active:scale-[0.98] no-underline">
                            Talk to an Expert Today
                        </Link>
                        <span className="text-slate-500 text-sm font-bold mx-2 hidden sm:block">OR</span>
                        <button onClick={openVideo} className="dark:text-slate-400 text-slate-600 hover:text-blue-500 dark:hover:text-blue-400 font-bold transition-colors w-full sm:w-auto text-lg flex items-center justify-center gap-2">
                           <i className="bi bi-play-circle text-2xl"></i> Watch the 2 min Demo
                        </button>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="max-w-lg mx-auto">
                        <p className="dark:text-slate-500 text-slate-400 text-sm font-bold uppercase tracking-widest mb-4 transition-colors duration-300">Stay ahead of threats</p>
                        <form className="flex gap-2" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Enter your work email"
                                required
                                className="flex-1 px-5 py-3 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            />
                            <button disabled={newsletterStatus.type === 'loading'} type="submit" className="px-6 py-3 dark:bg-white bg-slate-900 dark:text-slate-900 text-white rounded-xl font-bold text-sm dark:hover:bg-slate-100 hover:bg-slate-800 transition-colors flex-shrink-0 disabled:opacity-50">
                                {newsletterStatus.type === 'loading' ? '...' : 'Subscribe'}
                            </button>
                        </form>
                        {newsletterStatus.message ? (
                            <p className={`text-xs mt-3 ${newsletterStatus.type === 'success' ? 'text-emerald-500' : 'text-red-500'} font-bold transition-colors duration-300`}>
                                {newsletterStatus.message}
                            </p>
                        ) : (
                            <p className="dark:text-slate-600 text-slate-500 text-xs mt-3 transition-colors duration-300">Monthly cybersecurity insights. No spam, unsubscribe anytime.</p>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
