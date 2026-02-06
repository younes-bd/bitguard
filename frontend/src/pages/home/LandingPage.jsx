import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import client from '../../shared/core/services/client'; // Use unified client
import '../../styles/landing.css';

const LandingPage = () => {
    const [videoOpen, setVideoOpen] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);

    const openVideo = () => setVideoOpen(true);
    const closeVideo = () => setVideoOpen(false);
    const toggleAccordion = (index) => setActiveAccordion(activeAccordion === index ? null : index);

    // Newsletter State
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState('idle');
    const [newsletterMessage, setNewsletterMessage] = useState('');

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        setNewsletterStatus('loading');
        setNewsletterMessage('');
        try {
            await client.post('home/signups/', { email: newsletterEmail });
            setNewsletterStatus('success');
            setNewsletterMessage('Thank you for subscribing!');
            setNewsletterEmail('');
        } catch (error) {
            setNewsletterStatus('error');
            setNewsletterMessage('Something went wrong. Please try again.');
        }
    };

    // Announcement State
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        // Fetch latest announcements
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

    // Dashboard Animation Logic
    const dashboardRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            const dashboard = dashboardRef.current;
            if (!container || !dashboard) return;
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const triggerPoint = windowHeight * 0.85;
            const progress = Math.max(0, Math.min(1, (triggerPoint - rect.top) / (windowHeight * 0.6)));
            const scale = 0.8 + (progress * 0.2);
            const rotateX = 70 - (progress * 70);
            const translateY = 12 - (progress * 12);
            dashboard.style.transform = `perspective(1200px) translateX(0px) translateY(${translateY}px) scale(${scale}) rotate(0deg) rotateX(${rotateX}deg)`;
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const heroAnnouncement = announcements.length > 0 ? announcements[0] : null;

    return (
        <div className="bg-slate-950 font-sans text-slate-300">
            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-visible bg-slate-950" id="hero-section">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[128px] opacity-40 animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[128px] opacity-30 pointer-events-none"></div>

                {/* Video Modal */}
                {videoOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
                            <button onClick={closeVideo} className="absolute top-4 right-4 text-white hover:text-red-500 z-10 transition-colors">
                                <i className="bi bi-x-circle-fill text-3xl"></i>
                            </button>
                            <iframe className="w-full h-full" src="https://www.youtube.com/embed/6j4fPVkA3EA?si=llcTrXPRM-MRXDZB&controls=0&rel=0&showinfo=0&autoplay=1&mute=1" title="Demo" frameBorder="0" allowFullScreen></iframe>
                        </div>
                    </div>
                )}

                <div className="container mx-auto px-4 relative z-10 text-center">
                    {/* Dynamic Announcement Badge (Hero) */}
                    {heroAnnouncement && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up hover:scale-105 transition-transform cursor-default">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            {heroAnnouncement.title}
                        </div>
                    )}
                    {!heroAnnouncement && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Powering Digital Transformation
                        </div>
                    )}

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight font-[Oswald] leading-tight animate-fade-in-up delay-100">
                        The Complete Managed IT <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">& Cybersecurity Partner</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                        From enterprise network management to advanced threat protection, BitGuard provides the end-to-end technology infrastructure your business needs to scale.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
                        <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 flex items-center gap-2 group">
                            <span> Book a Consultation </span>
                            <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                        <button onClick={openVideo} className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold transition-colors">
                            <i className="bi bi-play-circle text-2xl text-blue-500"></i>
                            <span>See Our Solutions</span>
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/5 py-8 bg-white/5 backdrop-blur-sm rounded-2xl">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">5k+</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest">Devices Managed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">99.99%</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest">System Uptime</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">15min</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest">Avg. Response Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">100%</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest">Compliance Success</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DASHBOARD PREVIEW SECTION */}
            <section className="bg-slate-950 pb-32 relative overflow-visible z-20">
                <div ref={containerRef} className="dashboard-outer-container flex justify-center perspective-[1200px]" id="dashboard-container">
                    <div ref={dashboardRef} className="dashboard-main relative z-10 w-full max-w-6xl px-4">
                        <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
                            <img src="/assets/images/home/dashboard-preview.png" alt="BitGuard Dashboard" className="w-full h-auto object-cover opacity-90" onError={(e) => e.target.src = 'https://placehold.co/1200x800/1e293b/white?text=BitGuard+IT+Management+Console'} />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTEGRATIONS SECTION */}
            <section className="py-16 bg-slate-900 border-y border-slate-800">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500 font-bold uppercase tracking-widest mb-10 text-sm">Seamlessly Integrating With Your Stack</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <img src="/assets/images/brand-logos/microsoft.svg" className="h-8 invert brightness-0" alt="Microsoft 365" />
                        <img src="/assets/images/brand-logos/aws.svg" className="h-8 invert brightness-0" alt="AWS" />
                        <img src="/assets/images/brand-logos/google.svg" className="h-8 invert brightness-0" alt="Google Cloud" />
                        <img src="/assets/images/brand-logos/slack.svg" className="h-8 invert brightness-0" alt="Slack" />
                        <img src="/assets/images/brand-logos/jira.svg" className="h-8 invert brightness-0" alt="Jira" />
                    </div>
                </div>
            </section>

            {/* SERVICES OVERVIEW */}
            <section className="py-24 bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-[Oswald] mb-6">Comprehensive IT Services</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">We handle the technology so you can focus on growing your business.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Managed IT Services", desc: "Proactive network monitoring, helpdesk support, and hardware management to keep your operations running smoothly.", icon: "bi-hdd-network" },
                            { title: "Cloud Solutions", desc: "Expert cloud migration, management, and optimization for AWS, Azure, and private cloud infrastructures.", icon: "bi-cloud-check" },
                            { title: "Cybersecurity Defense", desc: "AI-driven threat detection, compliance audits, and 24/7 SOC monitoring to protect your digital assets.", icon: "bi-shield-lock" }
                        ].map((item, i) => (
                            <div key={i} className="relative p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors group">
                                <div className="w-14 h-14 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <i className={`bi ${item.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROCESS SECTION */}
            <section className="py-24 bg-slate-950 border-t border-slate-900">
                {/* ... (Existing Process Section) ... */}
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-bold text-white font-[Oswald] mb-6">Your Partner in Digital Transformation</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Technology shouldn't be a bottleneck. BitGuard helps you modernize legacy systems, automate workflows, and implement scalable infrastructure that grows with your company.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-blue-500 mt-1"></i>
                                    <div>
                                        <strong className="text-white block">Strategic IT Consulting</strong>
                                        <span className="text-slate-500 text-sm">Aligning your tech stack with business goals.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-blue-500 mt-1"></i>
                                    <div>
                                        <strong className="text-white block">Infrastructure Design</strong>
                                        <span className="text-slate-500 text-sm">Building resilient, high-performance networks.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-blue-500 mt-1"></i>
                                    <div>
                                        <strong className="text-white block">Process Automation</strong>
                                        <span className="text-slate-500 text-sm">Reducing manual work with smart integrations.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2">
                            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                                <img src="/assets/images/home/api.png" alt="Digital Transformation" className="w-full opacity-80" onError={(e) => e.target.src = 'https://placehold.co/800x600/1e293b/white?text=IT+Infrastructure+Design'} />
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 to-transparent">
                                    <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700 inline-block">
                                        <span className="text-blue-400 font-mono text-xs">System Status: Optimized</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DEVELOPER / TECHNICAL SECTION */}
            <section className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                {/* ... (Existing Developer Section) ... */}
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>

                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <i className="bi bi-code-slash"></i> For Technical Teams
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-[Oswald] mb-6">
                            Built into your workflow.
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            BitGuard integrates directly with your CI/CD pipeline and IT management tools. Use our comprehensive API to automate asset tracking, fetch audit logs, and trigger maintenance scripts.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <i className="bi bi-check-circle-fill text-indigo-500"></i>
                                <span>Complete RESTful Management API</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <i className="bi bi-check-circle-fill text-indigo-500"></i>
                                <span>Automated Provisioning & Deployment</span>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link to="/docs" className="text-indigo-400 font-bold hover:text-white transition-colors flex items-center gap-2">
                                View Developer Docs <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="rounded-xl bg-[#0f172a] border border-slate-700 shadow-2xl overflow-hidden font-mono text-xs md:text-sm">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-slate-400">POST /api/v1/provision</div>
                            </div>
                            <div className="p-6 text-indigo-300 overflow-x-auto">
                                <pre>
                                    {`// Provision new employee workstation
const bitguard = new BitGuardManager(API_KEY);

const result = await bitguard.provision({
  user: 'new_hire@company.com',
  role: 'developer',
  hardware: 'macbook_pro_m3',
  software: ['vscode', 'docker', 'slack']
});

console.log(result);
/*
  {
    "status": "provisioning",
    "ticket_id": "req_99281",
    "estimated_completion": "2h"
  }
*/`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ANNOUNCEMENT LINKED SECTION (NEW) */}
            {announcements.length > 0 && (
                <section className="py-24 bg-slate-950 border-t border-slate-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white font-[Oswald] mb-4">Latest Updates</h2>
                            <p className="text-slate-400">Stay up to date with the latest from BitGuard.</p>
                        </div>
                        {announcements.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {announcements.map((ann, idx) => (
                                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group">
                                        <div className="relative h-48 overflow-hidden">
                                            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img
                                                src={ann.image || "/assets/images/home/announcement-bg.png"}
                                                alt={ann.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-slate-700 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                                    {new Date(ann.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{ann.title}</h3>
                                            <p className="text-slate-400 text-sm line-clamp-3 mb-4">{ann.content}</p>
                                            <button className="flex items-center gap-2 text-white hover:text-blue-400 text-sm font-semibold transition-colors">
                                                Read More <i className="bi bi-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-slate-500">No announcements available at this time.</div>
                        )}
                    </div>
                </section>
            )}


            {/* NEWSLETTER / SIGNUP SECTION (NEW) */}
            <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-[Oswald] mb-6">Stay Connected</h2>
                        <p className="text-slate-400 mb-10">
                            Join our newsletter to receive the latest updates on managed IT trends, cybersecurity threats, and BitGuard platform features.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="relative max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-slate-950 border border-slate-700 text-white rounded-full py-4 pl-6 pr-36 focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-600"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={newsletterStatus === 'loading'}
                                className="absolute top-1.5 right-1.5 bg-blue-600 text-white rounded-full px-6 py-2.5 font-bold text-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
                            >
                                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                        {newsletterMessage && (
                            <div className={`mt-4 text-sm font-semibold ${newsletterStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {newsletterMessage}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 bg-slate-950 border-t border-slate-800 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 blur-3xl pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold text-white font-[Oswald] mb-8">
                        Stop Managing IT. Start Growing.
                    </h2>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
                        Let BitGuard handle your infrastructure, security, and support.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/contact" className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors shadow-xl">
                            Talk to an Expert
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
