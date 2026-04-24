import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeProvider, useTheme } from '../context/ThemeProvider';
import EmergencyModal from '../components/shared/EmergencyModal';
import client from '../api/client';
import '../styles/landing.css';

const PublicLayoutInner = ({ children }) => {
    const { theme, toggleTheme, isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const isLanding = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [bannerAnnouncement, setBannerAnnouncement] = useState(null);
    const navRef = useRef(null);
    const hoverTimeoutRef = useRef(null);

    // Footer newsletter state
    const [footerEmail, setFooterEmail] = useState('');
    const [footerStatus, setFooterStatus] = useState({ type: '', message: '' });

    const handleFooterSubscribe = async (e) => {
        e.preventDefault();
        if (!footerEmail) return;
        setFooterStatus({ type: 'loading', message: 'Subscribing...' });
        try {
            await client.post('home/signups/', { email: footerEmail });
            setFooterStatus({ type: 'success', message: 'Subscribed!' });
            setFooterEmail('');
            setTimeout(() => setFooterStatus({ type: '', message: '' }), 3000);
        } catch {
            setFooterStatus({ type: 'error', message: 'Failed. Try again.' });
            setTimeout(() => setFooterStatus({ type: '', message: '' }), 3000);
        }
    };

    // Fetch banner announcement
    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await client.get('home/announcements/');
                const data = response.data || [];
                if (data.length > 0) setBannerAnnouncement(data[0]);
            } catch { /* silent */ }
        };
        fetchBanner();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Hover-based menu with delay
    const handleMenuEnter = useCallback((menuName) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setOpenMenu(menuName);
    }, []);

    const handleMenuLeave = useCallback(() => {
        hoverTimeoutRef.current = setTimeout(() => {
            setOpenMenu(null);
        }, 200);
    }, []);

    const handleDropdownEnter = useCallback(() => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    }, []);

    const handleDropdownLeave = useCallback(() => {
        hoverTimeoutRef.current = setTimeout(() => {
            setOpenMenu(null);
        }, 200);
    }, []);

    // Active route detection
    const isActiveSection = useCallback((section) => {
        const path = location.pathname;
        switch (section) {
            case 'solutions': return path.startsWith('/solutions/');
            case 'platform': return path.startsWith('/platform/');
            case 'resources': return ['/blog', '/events', '/reports', '/podcasts', '/free-tools', '/compliance', '/store'].some(r => path.startsWith(r));
            case 'company': return ['/about', '/team', '/careers', '/contact'].some(r => path.startsWith(r));
            case 'support': return path.startsWith('/support');
            default: return false;
        }
    }, [location.pathname]);

    // Close dropdown on route change
    useEffect(() => {
        setOpenMenu(null);
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    }, [mobileMenuOpen]);

    // Sticky header on scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cleanup hover timeout
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };
    }, []);

    const bannerHeight = (!bannerDismissed && bannerAnnouncement) ? 'pt-[116px]' : 'pt-[80px]';

    return (
        <div className={`landing-page-wrapper font-sans min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'text-slate-300 bg-slate-950' : 'text-slate-700 bg-white'}`}>

            {/* ============================================================ */}
            {/* ANNOUNCEMENT BANNER                                          */}
            {/* ============================================================ */}
            {!bannerDismissed && bannerAnnouncement && (
                <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-3 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse flex-shrink-0"></span>
                    <span className="truncate">
                        <span className="font-bold">{bannerAnnouncement.title}</span>
                        {bannerAnnouncement.content && (
                            <span className="hidden sm:inline text-blue-100 ml-2">— {bannerAnnouncement.content.substring(0, 80)}{bannerAnnouncement.content.length > 80 ? '...' : ''}</span>
                        )}
                    </span>
                    <Link to="/blog" className="flex-shrink-0 text-xs font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors no-underline text-white">
                        Learn More →
                    </Link>
                    <button
                        onClick={() => setBannerDismissed(true)}
                        className="flex-shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors bg-transparent border-0 text-white cursor-pointer text-lg leading-none"
                        aria-label="Dismiss banner"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* ============================================================ */}
            {/* HEADER                                                        */}
            {/* ============================================================ */}
            <header
                className={`fixed w-full z-50 transition-all duration-300
                    ${!bannerDismissed && bannerAnnouncement ? 'top-[36px]' : 'top-0'}
                    ${isScrolled || !isLanding
                        ? (isDark ? 'bg-slate-950/95 backdrop-blur-xl shadow-md border-b border-white/5' : 'bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200')
                        : 'bg-transparent'}
                    ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
                <div className="w-full px-4 md:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div>
                            <Link to="/" className="flex items-center gap-[12px] no-underline group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                                    <img src="/assets/logo/logo.png" alt="BitGuard" className={`relative h-[30px] w-auto brightness-0 ${isDark ? 'invert' : ''} drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-300`} onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <span className="dark:text-white text-slate-900 text-[26px] font-[Oswald] font-semibold tracking-[2px] leading-none inline-block scale-y-[1.3] origin-left uppercase dark:drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] drop-shadow-none group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all duration-300">BITGUARD</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <nav ref={navRef} className="hidden lg:flex items-center gap-7">

                            {/* 1. SERVICES */}
                            <div
                                className="relative h-20 flex items-center"
                                onMouseEnter={() => handleMenuEnter('solutions')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'solutions'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer transition-colors text-sm tracking-wide ${isActiveSection('solutions') ? 'text-blue-500 dark:text-blue-400' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    SERVICES
                                    <i className={`bi bi-chevron-down text-xs ml-1 transition-transform duration-200 ${openMenu === 'solutions' ? 'rotate-180 opacity-100' : 'opacity-50'}`}></i>
                                </button>
                                {isActiveSection('solutions') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full"></div>}
                                {openMenu === 'solutions' && (
                                <div
                                    className="fixed left-0 w-full top-[80px] z-[1000]"
                                    style={{ top: !bannerDismissed && bannerAnnouncement ? '116px' : '80px' }}
                                    onMouseEnter={handleDropdownEnter}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <div className="dark:bg-slate-950 bg-white border-y dark:border-slate-800 border-slate-200 shadow-2xl">
                                        <div className="container max-w-[1400px] mx-auto px-4 py-8">
                                            <div className="grid grid-cols-5 gap-6 xl:gap-8">
                                                {/* Column 1: Managed IT */}
                                                <div>
                                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-2"><i className="bi bi-headset"></i> Managed IT</h3>
                                                    <ul className="space-y-1 m-0 p-0 list-none">
                                                        <li>
                                                            <Link to="/solutions/helpdesk-support" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-white text-slate-900 text-sm font-semibold group-hover/item:text-blue-500 transition-colors">Helpdesk IT Support</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">24/7 technical assistance</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/staff-augmentation" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-blue-500 transition-colors">Co-Managed IT Teams</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Scale your IT team on demand</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/noc" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-blue-500 transition-colors">Network Operations (NOC)</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Proactive infrastructure care</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/hardware-procurement" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-blue-500 transition-colors">Hardware Procurement</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Enterprise supply chain</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/backup-disaster-recovery" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-blue-500 transition-colors">Disaster Recovery</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Automated backups & failover</div>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Column 2: Cloud & Infrastructure */}
                                                <div>
                                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-2"><i className="bi bi-cloud-check"></i> Cloud & Infra</h3>
                                                    <ul className="space-y-1 m-0 p-0 list-none">
                                                        <li>
                                                            <Link to="/solutions/azure-aws" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-white text-slate-900 text-sm font-semibold group-hover/item:text-indigo-500 transition-colors">Cloud Migrations</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">AWS & Azure architectures</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/vdi-solutions" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-indigo-500 transition-colors">Virtual Desktops (VDI)</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Secure remote workspaces</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/microsoft-365" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-indigo-500 transition-colors">Microsoft 365</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Productivity & governance</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/voip-services" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-indigo-500 transition-colors">Unified Comms (VoIP)</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Cloud-based telephony</div>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Column 3: Cybersecurity */}
                                                <div>
                                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-2"><i className="bi bi-shield-lock"></i> Cybersecurity</h3>
                                                    <ul className="space-y-1 m-0 p-0 list-none">
                                                        <li>
                                                            <Link to="/solutions/managed-detection-response" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-white text-slate-900 text-sm font-semibold group-hover/item:text-rose-500 transition-colors">Managed SOC / MDR</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Real-time threat hunting</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/incident-response" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-rose-500 transition-colors">Incident Response</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Emergency breach recovery</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/penetration-testing" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-rose-500 transition-colors">Penetration Testing</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Ethical hacking & audits</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/compliance-consulting" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-rose-500 transition-colors">Compliance Consulting</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">vCISO & SOC2 readiness</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/mfa" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-rose-500 transition-colors">Identity & Zero Trust</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">MFA & Access Management</div>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Column 4: Physical IT & Networking */}
                                                <div>
                                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-2"><i className="bi bi-diagram-2"></i> Physical IT & Net</h3>
                                                    <ul className="space-y-1 m-0 p-0 list-none">
                                                        <li>
                                                            <Link to="/solutions/camera-surveillance" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-white text-slate-900 text-sm font-semibold group-hover/item:text-amber-500 transition-colors">Camera Surveillance</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">AI-powered IP networks</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/alarm-systems" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-amber-500 transition-colors">Advanced Alarm Systems</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">24/7 intrusion monitoring</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/access-control" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-amber-500 transition-colors">Cloud Access Control</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Keyless badge systems</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/structured-cabling" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-amber-500 transition-colors">Structured Cabling</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Cat6 & fiber optic infra</div>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Column 5: Software & Data */}
                                                <div>
                                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-2"><i className="bi bi-code-square"></i> Software & Data</h3>
                                                    <ul className="space-y-1 m-0 p-0 list-none">
                                                        <li>
                                                            <Link to="/solutions/data-analytics-ai" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-white text-slate-900 text-sm font-semibold group-hover/item:text-emerald-500 transition-colors">Data Analytics & AI</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Business Intelligence & LLMs</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/full-stack" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-emerald-500 transition-colors">Custom App Development</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Full-stack engineering</div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/solutions/digital-transformation" className="block p-2.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                <div className="dark:text-slate-300 text-slate-700 text-sm font-medium group-hover/item:text-emerald-500 transition-colors">Digital Transformation</div>
                                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Legacy modernization</div>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>

                            {/* 2. PLATFORM */}
                            <div
                                className="relative h-20 flex items-center"
                                onMouseEnter={() => handleMenuEnter('platform')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'platform'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer transition-colors text-sm tracking-wide ${isActiveSection('platform') ? 'text-blue-500 dark:text-blue-400' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    PLATFORM
                                    <i className={`bi bi-chevron-down text-xs ml-1 transition-transform duration-200 ${openMenu === 'platform' ? 'rotate-180 opacity-100' : 'opacity-50'}`}></i>
                                </button>
                                {isActiveSection('platform') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full"></div>}
                                {openMenu === 'platform' && (
                                <div
                                    className="absolute left-0 top-[100%] dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-3 w-[340px] z-[1000] mt-2 ring-1 dark:ring-white/5 ring-slate-900/5"
                                    onMouseEnter={handleDropdownEnter}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <div className="grid grid-cols-1 gap-0.5">
                                        <Link to="/platform/platform-overview" className="flex items-start gap-3 p-3 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/link">
                                            <i className="bi bi-diagram-3-fill text-blue-500 mt-0.5 text-lg"></i>
                                            <div>
                                                <div className="dark:text-white text-slate-900 font-bold text-sm dark:group-hover/link:text-blue-400 group-hover/link:text-blue-600 transition-colors">Platform Overview</div>
                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Single pane of glass SOC tool</div>
                                            </div>
                                        </Link>
                                        <Link to="/platform/assess" className="flex items-start gap-3 p-3 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/link">
                                            <i className="bi bi-speedometer2 text-indigo-500 mt-0.5 text-lg"></i>
                                            <div>
                                                <div className="dark:text-white text-slate-900 font-bold text-sm dark:group-hover/link:text-indigo-400 group-hover/link:text-indigo-600 transition-colors">Security Posture Dashboard</div>
                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Real-time threat monitoring</div>
                                            </div>
                                        </Link>
                                        <Link to="/platform/defend" className="flex items-start gap-3 p-3 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/link">
                                            <i className="bi bi-rss-fill text-green-500 mt-0.5 text-lg"></i>
                                            <div>
                                                <div className="dark:text-white text-slate-900 font-bold text-sm dark:group-hover/link:text-green-400 group-hover/link:text-green-600 transition-colors">Threat Intelligence Feed</div>
                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Automated AI threat correlation</div>
                                            </div>
                                        </Link>
                                        <Link to="/platform/control" className="flex items-start gap-3 p-3 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/link">
                                            <i className="bi bi-shield-shaded text-purple-500 mt-0.5 text-lg"></i>
                                            <div>
                                                <div className="dark:text-white text-slate-900 font-bold text-sm dark:group-hover/link:text-purple-400 group-hover/link:text-purple-600 transition-colors">Incident Response Console</div>
                                                <div className="dark:text-slate-500 text-slate-500 text-xs mt-0.5">Ticketing & live SOC engineer chat</div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="mt-2 pt-3 border-t dark:border-slate-800 border-slate-200">
                                        <Link to="/platform/security-advisor" className="flex items-center justify-between p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline text-xs font-bold uppercase tracking-wider">
                                            <span><i className="bi bi-code-slash text-blue-500 mr-2"></i>API Integrations</span>
                                            <i className="bi bi-arrow-right text-blue-500"></i>
                                        </Link>
                                    </div>
                                </div>
                                )}
                            </div>

                            {/* 3. INDUSTRIES */}
                            <div
                                className="relative h-20 flex items-center"
                                onMouseEnter={() => handleMenuEnter('industries')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'industries'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer transition-colors text-sm tracking-wide ${isActiveSection('industries') ? 'text-blue-500 dark:text-blue-400' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    INDUSTRIES
                                    <i className={`bi bi-chevron-down text-xs ml-1 transition-transform duration-200 ${openMenu === 'industries' ? 'rotate-180 opacity-100' : 'opacity-50'}`}></i>
                                </button>
                                {isActiveSection('industries') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full"></div>}
                                {openMenu === 'industries' && (
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 top-[100%] dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-3 w-[260px] z-[1000] mt-2 ring-1 dark:ring-white/5 ring-slate-900/5"
                                    onMouseEnter={handleDropdownEnter}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 pt-1 pb-2">Sectors We Serve</div>
                                    <Link to="/industries/healthcare" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline group/ind">
                                        <i className="bi bi-heart-pulse-fill text-lg text-rose-500"></i>
                                        <div>
                                            <div className="font-bold text-sm dark:group-hover/ind:text-rose-400 group-hover/ind:text-rose-600 transition-colors">Healthcare & Medical</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">HIPAA Compliant</div>
                                        </div>
                                    </Link>
                                    <Link to="/industries/finance" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline group/ind">
                                        <i className="bi bi-bank2 text-lg text-emerald-500"></i>
                                        <div>
                                            <div className="font-bold text-sm dark:group-hover/ind:text-emerald-400 group-hover/ind:text-emerald-600 transition-colors">Financial Services</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">FINRA / SEC Focus</div>
                                        </div>
                                    </Link>
                                    <Link to="/industries/government" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline group/ind">
                                        <i className="bi bi-building text-lg text-blue-500"></i>
                                        <div>
                                            <div className="font-bold text-sm dark:group-hover/ind:text-blue-400 group-hover/ind:text-blue-600 transition-colors">Government & Civic</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">FedRAMP Standards</div>
                                        </div>
                                    </Link>
                                    <Link to="/industries/manufacturing" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline group/ind">
                                        <i className="bi bi-nut-fill text-lg text-amber-500"></i>
                                        <div>
                                            <div className="font-bold text-sm dark:group-hover/ind:text-amber-400 group-hover/ind:text-amber-600 transition-colors">Retail & Manufacturing</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Supply Chain Security</div>
                                        </div>
                                    </Link>
                                </div>
                                )}
                            </div>

                            {/* 4. INSIGHTS */}
                            <div
                                className="relative h-20 flex items-center"
                                onMouseEnter={() => handleMenuEnter('resources')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'resources'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer transition-colors text-sm tracking-wide ${isActiveSection('resources') ? 'text-blue-500 dark:text-blue-400' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    INSIGHTS
                                    <i className={`bi bi-chevron-down text-xs ml-1 transition-transform duration-200 ${openMenu === 'resources' ? 'rotate-180 opacity-100' : 'opacity-50'}`}></i>
                                </button>
                                {isActiveSection('resources') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full"></div>}
                                {openMenu === 'resources' && (
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 top-[100%] dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-3 w-[300px] z-[1000] mt-2 ring-1 dark:ring-white/5 ring-slate-900/5"
                                    onMouseEnter={handleDropdownEnter}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 pt-1 pb-2">Learn</div>
                                    <Link to="/blog" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-journal-text text-lg text-blue-400"></i> <span className="font-medium text-sm">Blog</span>
                                    </Link>
                                    <Link to="/events" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-calendar-event text-lg text-indigo-400"></i> <span className="font-medium text-sm">Events & Webinars</span>
                                    </Link>
                                    <Link to="/reports" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-file-earmark-bar-graph text-lg text-emerald-400"></i> <span className="font-medium text-sm">Reports & Whitepapers</span>
                                    </Link>
                                    <Link to="/podcasts" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-mic text-lg text-purple-400"></i> <span className="font-medium text-sm">Podcasts</span>
                                    </Link>
                                    <div className="h-px dark:bg-slate-800 bg-slate-200 my-1.5 mx-2"></div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 pt-1 pb-2">Tools & Compliance</div>
                                    <Link to="/free-tools" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-tools text-lg text-amber-400"></i> <span className="font-medium text-sm">Free IT Tools</span>
                                    </Link>
                                    <Link to="/compliance" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-shield-check text-lg text-cyan-400"></i> <span className="font-medium text-sm">Compliance Center</span>
                                    </Link>
                                </div>
                                )}
                            </div>

                            {/* 5. COMPANY */}
                            <div
                                className="relative h-20 flex items-center"
                                onMouseEnter={() => handleMenuEnter('company')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'company'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer transition-colors text-sm tracking-wide ${isActiveSection('company') ? 'text-blue-500 dark:text-blue-400' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    COMPANY
                                    <i className={`bi bi-chevron-down text-xs ml-1 transition-transform duration-200 ${openMenu === 'company' ? 'rotate-180 opacity-100' : 'opacity-50'}`}></i>
                                </button>
                                {isActiveSection('company') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full"></div>}
                                {openMenu === 'company' && (
                                <div
                                    className="absolute right-0 top-[100%] dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-3 w-[240px] z-[1000] mt-2 ring-1 dark:ring-white/5 ring-slate-900/5"
                                    onMouseEnter={handleDropdownEnter}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <Link to="/about" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-building text-lg text-blue-400"></i> <span className="font-medium text-sm">About Us</span>
                                    </Link>
                                    <Link to="/team" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-people text-lg text-indigo-400"></i> <span className="font-medium text-sm">Our Team</span>
                                    </Link>
                                    <Link to="/careers" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-briefcase text-lg text-emerald-400"></i> <span className="font-medium text-sm">Careers</span>
                                    </Link>
                                    <Link to="/contact" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-envelope text-lg text-amber-400"></i> <span className="font-medium text-sm">Contact Us</span>
                                    </Link>
                                    <div className="h-px dark:bg-slate-800 bg-slate-200 my-1.5 mx-2"></div>
                                    <Link to="/partner" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline text-blue-500 dark:text-blue-400 font-semibold">
                                        <i className="bi bi-handshake text-lg"></i> <span className="text-sm">Partner with Us →</span>
                                    </Link>
                                </div>
                                )}
                            </div>

                            {/* 6. STORE */}
                            <div className="relative h-20 flex items-center">
                                <Link to="/store" className={`font-semibold no-underline transition-colors text-sm tracking-wide flex items-center gap-1 ${isActiveSection('store') ? 'text-blue-500 dark:text-blue-400' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}>
                                    STORE
                                </Link>
                                {isActiveSection('store') && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full"></div>}
                            </div>
                        </nav>

                        {/* CTA Buttons & User Section */}
                        <div className="flex items-center gap-3">
                            <button onClick={() => setEmergencyModalOpen(true)} className="hidden lg:block px-4 py-2 border border-red-500/50 text-red-400 rounded-lg font-bold uppercase text-xs tracking-wider bg-transparent hover:bg-red-500/10 hover:border-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] cursor-pointer">Under Attack?</button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg border border-slate-700/50 hover:border-blue-500/50 bg-transparent hover:bg-blue-500/10 transition-all duration-300 cursor-pointer group"
                                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {isDark ? (
                                    <i className="bi bi-sun-fill text-amber-400 group-hover:rotate-45 transition-transform duration-300"></i>
                                ) : (
                                    <i className="bi bi-moon-stars-fill text-blue-500 group-hover:-rotate-12 transition-transform duration-300"></i>
                                )}
                            </button>

                            {isAuthenticated ? (
                                <div className="group relative">
                                    <button className="flex items-center bg-transparent border-none p-0 cursor-pointer group hover:opacity-100 transition-opacity">
                                        <div className="w-9 h-9 relative">
                                            <img src="/assets/images/user/avatar.png" alt="User" className="w-full h-full object-cover rounded-full border border-slate-700/50 hover:border-blue-500 transition-colors" />
                                        </div>
                                    </button>

                                    {/* User Dropdown */}
                                    <div className="hidden group-hover:block absolute right-0 top-[100%] pt-2 w-[240px] z-[1000]">
                                        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden ring-1 ring-white/5">
                                            <div className="px-4 py-3 border-b border-slate-800">
                                                <div className="font-semibold text-white text-sm">{user?.first_name || user?.email?.split('@')[0] || 'User'}</div>
                                                <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                                            </div>
                                            <div className="py-1">
                                                <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-speedometer2 text-blue-500"></i>
                                                    <span>Dashboard</span>
                                                </Link>
                                                <Link to="/admin/crm" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-people-fill text-indigo-500"></i>
                                                    <span>Staff Portal</span>
                                                </Link>
                                                <Link to="/admin/erp" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-grid-3x3-gap-fill text-green-500"></i>
                                                    <span>ERP Console</span>
                                                </Link>
                                                <div className="h-px bg-slate-800 my-1 mx-2"></div>
                                                <Link to="/account/personal-info" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-person-circle text-slate-400"></i>
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link to="/account/security" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-gear-fill text-slate-400"></i>
                                                    <span>Settings</span>
                                                </Link>
                                                <div className="h-px bg-slate-800 my-1 mx-2"></div>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer text-left">
                                                    <i className="bi bi-box-arrow-right"></i>
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="hidden lg:block dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm font-medium transition-colors no-underline">Sign In</Link>
                                    <Link to="/contact" className="hidden lg:flex px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm no-underline transition-all shadow-lg shadow-blue-600/20 items-center gap-2">
                                        Get Started <i className="bi bi-arrow-right"></i>
                                    </Link>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <button className="lg:hidden p-2 dark:text-white text-slate-900 bg-transparent border-0 cursor-pointer relative z-50 text-2xl w-10 h-10 flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <i className="bi bi-x-lg text-blue-500"></i> : <i className="bi bi-list"></i>}
                            </button>
                        </div>
                    </div>
                </div >
            </header >

            {/* Mobile Menu Content (Full Screen Overlay) */}
            <div className={`fixed inset-0 ${isDark ? 'bg-slate-950/95' : 'bg-white/95'} backdrop-blur-2xl z-40 transition-transform duration-500 ease-in-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full pt-20 px-6 pb-10 overflow-y-auto">

                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl mb-4 font-semibold text-sm transition-all cursor-pointer border-0 ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}
                    >
                        <i className={`bi ${isDark ? 'bi-sun-fill text-amber-400' : 'bi-moon-stars-fill text-blue-500'}`}></i>
                        {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>

                    <div className="flex flex-col gap-2">
                        {/* 1. Services */}
                        <details className="group/details border-b dark:border-slate-800/50 border-slate-200 py-3">
                            <summary className="flex items-center justify-between text-lg font-bold dark:text-white text-slate-900 cursor-pointer list-none">
                                Services
                                <i className="bi bi-chevron-down transition-transform group-open/details:rotate-180 text-slate-500"></i>
                            </summary>
                            <div className="flex flex-col gap-3 pt-4 pl-4 border-l-2 border-blue-600/50 mt-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-blue-500">Managed IT</span>
                                <Link to="/solutions/helpdesk-support" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Helpdesk IT Support</Link>
                                <Link to="/solutions/staff-augmentation" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Co-Managed IT Teams</Link>
                                <Link to="/solutions/noc" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Network Operations (NOC)</Link>
                                <Link to="/solutions/hardware-procurement" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Hardware Procurement</Link>
                                <Link to="/solutions/backup-disaster-recovery" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Disaster Recovery</Link>
                                
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-indigo-500">Cloud & Infra</span>
                                <Link to="/solutions/azure-aws" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Cloud Migrations</Link>
                                <Link to="/solutions/vdi-solutions" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Virtual Desktops (VDI)</Link>
                                <Link to="/solutions/microsoft-365" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Microsoft 365</Link>
                                <Link to="/solutions/voip-services" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Unified Comms (VoIP)</Link>

                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-rose-500">Cybersecurity</span>
                                <Link to="/solutions/managed-detection-response" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Managed SOC / MDR</Link>
                                <Link to="/solutions/incident-response" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Incident Response</Link>
                                <Link to="/solutions/penetration-testing" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Penetration Testing</Link>
                                <Link to="/solutions/compliance-consulting" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Compliance Consulting</Link>
                                <Link to="/solutions/mfa" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Identity & Zero Trust</Link>

                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-amber-500">Physical IT & Net</span>
                                <Link to="/solutions/camera-surveillance" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Camera Surveillance</Link>
                                <Link to="/solutions/alarm-systems" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Advanced Alarm Systems</Link>
                                <Link to="/solutions/access-control" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Cloud Access Control</Link>
                                <Link to="/solutions/structured-cabling" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Structured Cabling</Link>

                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-emerald-500">Software & Data</span>
                                <Link to="/solutions/data-analytics-ai" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Data Analytics & AI</Link>
                                <Link to="/solutions/full-stack" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Custom App Development</Link>
                                <Link to="/solutions/digital-transformation" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Digital Transformation</Link>
                            </div>
                        </details>

                        {/* 2. Platform */}
                        <details className="group/details border-b dark:border-slate-800/50 border-slate-200 py-3">
                            <summary className="flex items-center justify-between text-lg font-bold dark:text-white text-slate-900 cursor-pointer list-none">
                                Platform
                                <i className="bi bi-chevron-down transition-transform group-open/details:rotate-180 text-slate-500"></i>
                            </summary>
                            <div className="flex flex-col gap-3 pt-4 pl-4 border-l-2 border-indigo-600/50 mt-2">
                                <Link to="/platform/platform-overview" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Platform Overview</Link>
                                <Link to="/platform/assess" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Security Posture Dashboard</Link>
                                <Link to="/platform/defend" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Threat Intelligence Feed</Link>
                                <Link to="/platform/control" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Incident Response Console</Link>
                                <Link to="/platform/security-advisor" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">API Integrations</Link>
                            </div>
                        </details>

                        {/* 3. Industries */}
                        <details className="group/details border-b dark:border-slate-800/50 border-slate-200 py-3">
                            <summary className="flex items-center justify-between text-lg font-bold dark:text-white text-slate-900 cursor-pointer list-none">
                                Industries
                                <i className="bi bi-chevron-down transition-transform group-open/details:rotate-180 text-slate-500"></i>
                            </summary>
                            <div className="flex flex-col gap-3 pt-4 pl-4 border-l-2 border-rose-600/50 mt-2">
                                <Link to="/industries/healthcare" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Healthcare & Medical</Link>
                                <Link to="/industries/finance" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Financial Services</Link>
                                <Link to="/industries/government" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Government & Civic</Link>
                                <Link to="/industries/manufacturing" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Retail & Manufacturing</Link>
                            </div>
                        </details>

                        {/* 4. Insights */}
                        <details className="group/details border-b dark:border-slate-800/50 border-slate-200 py-3">
                            <summary className="flex items-center justify-between text-lg font-bold dark:text-white text-slate-900 cursor-pointer list-none">
                                Insights
                                <i className="bi bi-chevron-down transition-transform group-open/details:rotate-180 text-slate-500"></i>
                            </summary>
                            <div className="flex flex-col gap-3 pt-4 pl-4 border-l-2 border-emerald-600/50 mt-2">
                                <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Blog</Link>
                                <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Events & Webinars</Link>
                                <Link to="/reports" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Reports & Whitepapers</Link>
                                <Link to="/podcasts" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Podcasts</Link>
                                <Link to="/free-tools" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Free IT Tools</Link>
                                <Link to="/compliance" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Compliance Center</Link>
                            </div>
                        </details>

                        {/* 4. Company */}
                        <details className="group/details border-b dark:border-slate-800/50 border-slate-200 py-3">
                            <summary className="flex items-center justify-between text-lg font-bold dark:text-white text-slate-900 cursor-pointer list-none">
                                Company
                                <i className="bi bi-chevron-down transition-transform group-open/details:rotate-180 text-slate-500"></i>
                            </summary>
                            <div className="flex flex-col gap-3 pt-4 pl-4 border-l-2 border-amber-600/50 mt-2">
                                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">About Us</Link>
                                <Link to="/team" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Our Team</Link>
                                <Link to="/careers" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Careers</Link>
                                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Contact Us</Link>
                            </div>
                        </details>

                        {/* 6. Store */}
                        <div className="py-3 border-b dark:border-slate-800/50 border-slate-200">
                            <Link to="/store" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold dark:text-white text-slate-900 no-underline flex items-center gap-2 w-max">Store <i className="bi bi-box-seam text-blue-500"></i></Link>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        <a href="#attack" onClick={() => { setMobileMenuOpen(false); setEmergencyModalOpen(true); }} className="w-full py-4 text-center border border-red-500/50 bg-red-500/10 text-red-400 rounded-xl font-bold uppercase tracking-wider hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] no-underline">
                            Under Attack?
                        </a>
                        {!isAuthenticated ? (
                            <>
                                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-blue-600/20 no-underline">
                                    Schedule a Demo
                                </Link>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center text-slate-400 font-medium no-underline">
                                    Already a client? Sign In
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <img src="/assets/images/user/avatar.png" alt="User" className="w-10 h-10 rounded-full border border-slate-700" />
                                    <div>
                                        <div className="text-white font-bold text-sm">{user?.first_name || user?.email?.split('@')[0] || 'User'}</div>
                                        <div className="text-xs text-slate-500">Authenticated</div>
                                    </div>
                                </div>
                                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-500 transition-colors no-underline">Go to App</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1">
                {children || <Outlet />}
            </main>

            {/* ============================================================ */}
            {/* FOOTER                                                        */}
            {/* ============================================================ */}
            <footer className={`footer-section mt-auto w-full border-t transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-300 border-slate-900' : 'bg-slate-900 text-slate-300 border-slate-800'}`}>

                {/* Trust Certifications Row */}
                <div className="border-b border-slate-800/60 py-6">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                            {['SOC2 Type II', 'ISO 27001', 'HIPAA Compliant', 'GDPR Ready', 'NIST CSF'].map((cert, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <i className="bi bi-patch-check-fill text-emerald-500/70"></i>
                                    <span>{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="container mx-auto px-4 md:px-8 pt-12 pb-10">
                    <div className="flex flex-col lg:flex-row gap-12 justify-between items-start w-full">

                        {/* Logo, Description & Newsletter */}
                        <div className="flex flex-col items-start lg:max-w-[320px] gap-6">
                            <Link to="/" className="flex items-center gap-3 no-underline group">
                                <img src="/assets/logo/logo.png" alt="BitGuard" className="h-8 brightness-0 invert drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-300" onError={(e) => e.target.style.display = 'none'} />
                                <div className="text-[22px] font-[Oswald] font-semibold tracking-[2px] scale-y-[1.3] inline-block uppercase text-white drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all">BITGUARD</div>
                            </Link>
                            <p className="text-slate-500 text-sm leading-relaxed">Enterprise-grade managed IT services, cybersecurity defense, and cloud infrastructure for businesses that refuse to compromise.</p>

                            {/* Footer Newsletter */}
                            <div className="w-full">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Stay ahead of threats</p>
                                <form className="flex gap-2" onSubmit={handleFooterSubscribe}>
                                    <input
                                        type="email"
                                        value={footerEmail}
                                        onChange={(e) => setFooterEmail(e.target.value)}
                                        placeholder="Work email"
                                        required
                                        disabled={footerStatus.type === 'loading' || footerStatus.type === 'success'}
                                        className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={footerStatus.type === 'loading' || footerStatus.type === 'success'}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex-shrink-0 disabled:opacity-60"
                                    >
                                        {footerStatus.type === 'loading' ? '...' : footerStatus.type === 'success' ? '✓' : 'Subscribe'}
                                    </button>
                                </form>
                                {footerStatus.message && (
                                    <p className={`text-xs mt-2 ${footerStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{footerStatus.message}</p>
                                )}
                            </div>

                            {/* Social */}
                            <div className="flex gap-4 text-lg">
                                <a href="https://linkedin.com/company/bitguard" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                                <a href="https://twitter.com/bitguard" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
                                <a href="https://github.com/bitguard" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors" aria-label="GitHub"><i className="bi bi-github"></i></a>
                            </div>
                        </div>

                        {/* Links Grid */}
                        <div className="flex flex-wrap gap-8 lg:gap-16 w-full lg:w-auto">

                            {/* Solutions */}
                            <div className="flex flex-col gap-4 min-w-[150px]">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 m-0 mb-1">Solutions</h4>
                                <div className="flex flex-col gap-2.5">
                                    <Link to="/solutions/managed-detection-response" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Managed IT Services</Link>
                                    <Link to="/solutions/bitguard-bundle" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Cybersecurity Defense</Link>
                                    <Link to="/solutions/azure-aws" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Cloud Architecture</Link>
                                    <Link to="/solutions/web-design" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Web & App Development</Link>
                                    <Link to="/solutions/camera-surveillance" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Physical Security</Link>
                                    <Link to="/solutions/full-stack" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Custom Software</Link>
                                    <Link to="/solutions/digital-transformation" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Digital Transformation</Link>
                                    <Link to="/solutions/backup-disaster-recovery" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Disaster Recovery</Link>
                                    <Link to="/solutions/staff-augmentation" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Co-Managed IT Teams</Link>
                                </div>
                            </div>

                            {/* Platform */}
                            <div className="flex flex-col gap-4 min-w-[150px]">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 m-0 mb-1">Capabilities</h4>
                                <div className="flex flex-col gap-2.5">
                                    <Link to="/platform/platform-overview" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Service Delivery Platform</Link>
                                    <Link to="/platform/assess" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">IT Assessments & Auditing</Link>
                                    <Link to="/platform/defend" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Managed SOC & Defense</Link>
                                    <Link to="/platform/control" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Governance & Compliance</Link>
                                    <Link to="/platform/security-advisor" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Executive vCISO Advisory</Link>
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="flex flex-col gap-4 min-w-[150px]">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 m-0 mb-1">Resources</h4>
                                <div className="flex flex-col gap-2.5">
                                    <Link to="/blog" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Blog</Link>
                                    <Link to="/events" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Events & Webinars</Link>
                                    <Link to="/reports" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Reports</Link>
                                    <Link to="/podcasts" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Podcasts</Link>
                                    <Link to="/free-tools" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Free IT Tools</Link>
                                    <Link to="/compliance" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Compliance Center</Link>
                                </div>
                            </div>

                            {/* Company */}
                            <div className="flex flex-col gap-4 min-w-[150px]">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 m-0 mb-1">Company</h4>
                                <div className="flex flex-col gap-2.5">
                                    <Link to="/about" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">About Us</Link>
                                    <Link to="/team" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Our Team</Link>
                                    <Link to="/careers" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Careers</Link>
                                    <Link to="/contact" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Contact Us</Link>
                                    <Link to="/support" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">Support</Link>
                                    <Link to="/store" className="text-slate-400 no-underline hover:text-blue-400 transition-colors text-sm">IT Store</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800">
                    <div className="container mx-auto px-4 md:px-8 py-5">
                        <div className="flex flex-col md:flex-row gap-4 items-center text-xs text-slate-500 justify-between">
                            <div className="flex items-center gap-4">
                                <span>&copy; {new Date().getFullYear()} BitGuard Technologies LLC. All rights reserved.</span>
                                <span className="hidden md:flex items-center gap-1.5 text-emerald-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    All Systems Operational
                                </span>
                            </div>
                            <div className="flex gap-6">
                                <Link to="/privacy" className="text-slate-500 hover:text-slate-300 no-underline transition-colors">Privacy Policy</Link>
                                <Link to="/terms" className="text-slate-500 hover:text-slate-300 no-underline transition-colors">Terms of Service</Link>
                                <a href="mailto:legal@bitguard.com" className="text-slate-500 hover:text-slate-300 no-underline transition-colors">Legal</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Emergency Modal */}
            <EmergencyModal isOpen={emergencyModalOpen} onClose={() => setEmergencyModalOpen(false)} />
        </div>
    );
};

const PublicLayout = ({ children }) => (
    <ThemeProvider>
        <PublicLayoutInner>{children}</PublicLayoutInner>
    </ThemeProvider>
);

export default PublicLayout;
