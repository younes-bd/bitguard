import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeProvider, useTheme } from '../context/ThemeProvider';
import EmergencyModal from '../components/shared/EmergencyModal';
import LiveChat from '../components/shared/LiveChat';
import client from '../api/client';
import UserAvatarDropdown from '../components/shared/core/UserAvatarDropdown';
import '../styles/landing.css';

const WebsiteLayoutInner = ({ children }) => {
    const { theme, toggleTheme, isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const isLanding = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [bannerAnnouncement, setBannerAnnouncement] = useState(null);
    const [activeServiceTab, setActiveServiceTab] = useState('managed-it');
    const [cookieConsent, setCookieConsent] = useState(true); // Default true, update in useEffect
    const navRef = useRef(null);
    const hoverTimeoutRef = useRef(null);

    // Initialize cookie consent
    useEffect(() => {
        if (!localStorage.getItem('bitguard_cookie_consent')) {
            setCookieConsent(false);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('bitguard_cookie_consent', 'true');
        setCookieConsent(true);
    };

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

    // Global Search Keyboard Shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchModalOpen(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Global Search Logic — wired to real backend /api/home/search/
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await client.get(`home/search/?q=${encodeURIComponent(searchQuery)}`);
                setSearchResults(response.data?.results || []);
            } catch (err) {
                console.error('Search error:', err);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

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
            case 'products': return path.startsWith('/solutions/') || path.startsWith('/platform/');
            case 'solutions': return path.startsWith('/solutions/');
            case 'platform': return path.startsWith('/platform/');
            case 'industries': return path.startsWith('/industries/');
            case 'pricing': return path.startsWith('/pricing');
            case 'store': return path.startsWith('/store');
            case 'resources': return ['/blog', '/events', '/reports', '/podcasts', '/free-tools', '/compliance', '/case-studies'].some(r => path.startsWith(r));
            case 'company': return ['/about', '/team', '/careers', '/contact', '/support', '/security', '/status'].some(r => path.startsWith(r));
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
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // JSON-LD Structured Data
    const orgJsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BitGuard Technologies",
        "url": "https://www.bitguard.com",
        "logo": "https://www.bitguard.com/maintenance/images/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-312-360-1900",
            "contactType": "customer service"
        },
        "sameAs": [
            "https://linkedin.com/company/bitguard"
        ]
    };

    // Cleanup hover timeout
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };
    }, []);




    return (
        <div className={`landing-page-wrapper font-sans min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'text-slate-300 bg-slate-950' : 'text-slate-700 bg-white'}`}>
            {/* JSON-LD Script */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />


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
                    <div ref={navRef} className="flex items-center justify-between h-[72px]">

                        {/* ── LOGO ── */}
                        <div className="flex items-center gap-4 shrink-0">
                            <Link to="/" className="flex items-center gap-[12px] no-underline group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                                    <img src="/maintenance/logo/logo.png" alt="BitGuard" className={`relative h-[30px] w-auto transition-all duration-300 ${isDark ? 'brightness-0 invert drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]' : 'drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]'}`} onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <span className={`text-[32px] font-bold tracking-tight leading-none inline-block transform scale-x-[0.85] origin-left transition-all ${isDark ? 'text-white drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]' : 'text-slate-900 drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]'}`}>
                                    BITGUARD
                                </span>
                            </Link>
                        </div>

                        {/* ── DESKTOP NAV ── */}
                        <nav className="hidden xl:flex items-center h-full">

                            {/* 1. PLATFORM */}
                            <div className="relative h-full flex items-center px-4"
                                onMouseEnter={() => handleMenuEnter('platform')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'platform'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors text-[13px] tracking-wide uppercase ${isActiveSection('platform') ? 'text-blue-500' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    Platform
                                    <i className={`bi bi-chevron-down text-[10px] transition-transform duration-200 opacity-50 ${openMenu === 'platform' ? 'rotate-180' : ''}`}></i>
                                </button>
                                {isActiveSection('platform') && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 rounded-full"></div>}
                                {openMenu === 'platform' && (
                                    <div
                                        className="absolute left-0 top-full mt-2 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-3 w-[275px] z-[1000]"
                                        onMouseEnter={handleDropdownEnter}
                                        onMouseLeave={handleDropdownLeave}
                                    >
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2">BitGuard Platform</div>
                                        {[
                                            { to: '/platform/platform-overview', label: 'Platform Overview', icon: 'bi-grid-1x2', color: 'text-purple-500', sub: 'Unified operations' },
                                            { to: '/platform/assess', label: 'Threat Dashboard', icon: 'bi-shield-check', color: 'text-blue-500', sub: 'Real-time monitoring' },
                                            { to: '/platform/incident-management', label: 'Incident Management', icon: 'bi-exclamation-triangle', color: 'text-rose-500', sub: 'Response workflows' },
                                            { to: '/platform/log-analysis', label: 'Log Analysis (SIEM)', icon: 'bi-journal-text', color: 'text-emerald-500', sub: 'Log aggregation' },
                                            { to: '/integrations', label: 'Integrations Engine', icon: 'bi-plug', color: 'text-amber-500', sub: '100+ native API connectors' },
                                        ].map(item => (
                                            <Link key={item.to} to={item.to} className="flex items-center gap-3 px-2 py-2 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/ind">
                                                <i className={`bi ${item.icon} ${item.color} text-base w-5 text-center shrink-0`}></i>
                                                <div>
                                                    <div className="dark:text-slate-200 text-slate-800 text-sm font-medium group-hover/ind:text-blue-500 transition-colors">{item.label}</div>
                                                    <div className="text-slate-500 text-[10px] uppercase tracking-wider">{item.sub}</div>
                                                </div>
                                            </Link>
                                        ))}
                                        <div className="mt-2 pt-2 border-t dark:border-slate-800 border-slate-100">
                                            <Link to="/pricing" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-2 py-2 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/ind">
                                                <i className="bi bi-tags text-emerald-500 text-base w-5 text-center shrink-0"></i>
                                                <div>
                                                    <div className="dark:text-slate-200 text-slate-800 text-sm font-medium group-hover/ind:text-blue-500 transition-colors">Pricing & Plans</div>
                                                    <div className="text-slate-500 text-[10px] uppercase tracking-wider">Transparent enterprise pricing</div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="mt-2 pt-2 border-t dark:border-slate-800 border-slate-100">
                                            <Link to="/contact" className="block px-3 py-2 text-[12px] font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 no-underline text-center rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-colors">
                                                Request Platform Demo &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 1. SERVICES (Managed IT, Digital, Security, Cloud) */}
                            <div className="relative h-full flex items-center px-4"
                                onMouseEnter={() => handleMenuEnter('products')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'products'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors text-[13px] tracking-wide uppercase ${isActiveSection('products') ? 'text-blue-500' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    Services
                                    <i className={`bi bi-chevron-down text-[10px] transition-transform duration-200 opacity-50 ${openMenu === 'products' ? 'rotate-180' : ''}`}></i>
                                </button>
                                {isActiveSection('products') && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 rounded-full"></div>}
                                {openMenu === 'products' && (
                                    <div
                                        className="fixed left-0 w-full z-[1000]"
                                        style={{ top: !bannerDismissed && bannerAnnouncement ? '108px' : '72px' }}
                                        onMouseEnter={handleDropdownEnter}
                                        onMouseLeave={handleDropdownLeave}
                                    >
                                        <div className="dark:bg-slate-950 bg-white border-y dark:border-slate-800/60 border-slate-200 shadow-2xl">
                                            <div className="container max-w-[1200px] mx-auto px-8 py-8">
                                                {/* SOC Featured Banner */}
                                                <Link to="/solutions/managed-detection-response" className="flex items-center gap-4 mb-6 p-3 rounded-xl bg-red-500/5 border border-red-500/15 hover:bg-red-500/10 transition-all no-underline group/socbanner">
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">SOC Operational — 24/7 Live</span>
                                                    </div>
                                                    <div className="h-3 w-px bg-red-500/20"></div>
                                                    <span className="text-[12px] text-slate-400 group-hover/socbanner:text-slate-300 transition-colors">BitGuard Security Operations Center is actively monitoring threats right now. <span className="text-red-400 font-semibold">View SOC Dashboard →</span></span>
                                                </Link>
                                                <div className="grid grid-cols-4 gap-8">

                                                    {/* Col 1: Managed IT */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="w-5 h-5 bg-blue-500/10 rounded flex items-center justify-center shrink-0">
                                                                <i className="bi bi-headset text-blue-500 text-[10px]"></i>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Managed IT</span>
                                                        </div>
                                                        <ul className="space-y-0.5 list-none m-0 p-0">
                                                            {[
                                                                { to: '/solutions/helpdesk-support', label: 'Helpdesk IT Support', sub: '24/7 technical assistance' },
                                                                { to: '/solutions/noc', label: 'NOC Services', sub: 'Proactive infrastructure care' },
                                                                { to: '/solutions/staff-augmentation', label: 'Co-Managed IT', sub: 'Scale your team on demand' },
                                                                { to: '/solutions/hardware-procurement', label: 'Hardware Procurement', sub: 'Enterprise supply chain' },
                                                                { to: '/solutions/backup-disaster-recovery', label: 'Disaster Recovery', sub: 'Automated backups & failover' },
                                                            ].map(item => (
                                                                <li key={item.to}>
                                                                    <Link to={item.to} className="block px-3 py-1.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                        <div className="dark:text-slate-200 text-slate-800 text-sm font-medium group-hover/item:text-blue-500 transition-colors">{item.label}</div>
                                                                        <div className="text-slate-500 text-[11px]">{item.sub}</div>
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Col 2: Cybersecurity */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="w-5 h-5 bg-rose-500/10 rounded flex items-center justify-center shrink-0">
                                                                <i className="bi bi-shield-lock text-rose-500 text-[10px]"></i>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cybersecurity</span>
                                                        </div>
                                                        <ul className="space-y-0.5 list-none m-0 p-0 mb-4">
                                                            {[
                                                                { to: '/solutions/managed-detection-response', label: 'Managed SOC', sub: 'Real-time threat hunting' },
                                                                { to: '/solutions/incident-response', label: 'Incident Response', sub: 'Emergency breach recovery' },
                                                                { to: '/solutions/penetration-testing', label: 'Pentesting', sub: 'Ethical hacking & audits' },
                                                                { to: '/solutions/compliance-consulting', label: 'Compliance (vCISO)', sub: 'SOC2, HIPAA readiness' },
                                                            ].map(item => (
                                                                <li key={item.to}>
                                                                    <Link to={item.to} className="block px-3 py-1.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                        <div className="dark:text-slate-200 text-slate-800 text-sm font-medium group-hover/item:text-rose-500 transition-colors">{item.label}</div>
                                                                        <div className="text-slate-500 text-[11px]">{item.sub}</div>
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Col 3: Cloud & Infra + Physical IT */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="w-5 h-5 bg-indigo-500/10 rounded flex items-center justify-center shrink-0">
                                                                <i className="bi bi-cloud-check text-indigo-500 text-[10px]"></i>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cloud & Infra</span>
                                                        </div>
                                                        <ul className="space-y-0.5 list-none m-0 p-0 mb-4">
                                                            {[
                                                                { to: '/solutions/azure-aws', label: 'Cloud Migrations', sub: 'AWS & Azure architectures' },
                                                                { to: '/solutions/vdi-solutions', label: 'Virtual Desktops (VDI)', sub: 'Secure remote workspaces' },
                                                                { to: '/solutions/microsoft-365', label: 'Microsoft 365', sub: 'Productivity & governance' },
                                                                { to: '/solutions/voip-services', label: 'Unified Comms (VoIP)', sub: 'Cloud-based telephony' },
                                                            ].map(item => (
                                                                <li key={item.to}>
                                                                    <Link to={item.to} className="block px-3 py-1.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                        <div className="dark:text-slate-200 text-slate-800 text-sm font-medium group-hover/item:text-indigo-500 transition-colors">{item.label}</div>
                                                                        <div className="text-slate-500 text-[11px]">{item.sub}</div>
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="flex items-center gap-2 mb-3 pt-3 border-t dark:border-slate-800/60 border-slate-100">
                                                            <div className="w-5 h-5 bg-amber-500/10 rounded flex items-center justify-center shrink-0">
                                                                <i className="bi bi-diagram-2 text-amber-500 text-[10px]"></i>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physical IT</span>
                                                        </div>
                                                        <ul className="space-y-0.5 list-none m-0 p-0">
                                                            {[
                                                                { to: '/solutions/camera-surveillance', label: 'Camera Surveillance', sub: 'AI-powered IP networks' },
                                                                { to: '/solutions/access-control', label: 'Access Control', sub: 'Keyless badge systems' },
                                                                { to: '/solutions/structured-cabling', label: 'Structured Cabling', sub: 'Cat6 & fiber optic' },
                                                            ].map(item => (
                                                                <li key={item.to}>
                                                                    <Link to={item.to} className="block px-3 py-1.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                        <div className="dark:text-slate-200 text-slate-800 text-sm font-medium group-hover/item:text-amber-500 transition-colors">{item.label}</div>
                                                                        <div className="text-slate-500 text-[11px]">{item.sub}</div>
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Col 4: Digital Services + AI & Data */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="w-5 h-5 bg-violet-500/10 rounded flex items-center justify-center shrink-0">
                                                                <i className="bi bi-code-slash text-violet-500 text-[10px]"></i>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Services</span>
                                                        </div>
                                                        <ul className="space-y-0.5 list-none m-0 p-0 mb-4">
                                                            {[
                                                                { to: '/solutions/web-design', label: 'Web Design', sub: 'Modern, high-converting websites' },
                                                                { to: '/solutions/full-stack', label: 'E-Commerce & Apps', sub: 'Custom platforms' },
                                                                { to: '/solutions/app-development', label: 'Mobile Apps', sub: 'iOS & Android native apps' },
                                                                { to: '/solutions/design-services', label: 'UI/UX Design', sub: 'Identity & product design' },
                                                            ].map(item => (
                                                                <li key={item.to}>
                                                                    <Link to={item.to} className="block px-3 py-1.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                        <div className="dark:text-slate-200 text-slate-800 text-sm font-medium group-hover/item:text-violet-500 transition-colors">{item.label}</div>
                                                                        <div className="text-slate-500 text-[11px]">{item.sub}</div>
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="flex items-center gap-2 mb-3 pt-3 border-t dark:border-slate-800/60 border-slate-100">
                                                            <div className="w-5 h-5 bg-cyan-500/10 rounded flex items-center justify-center shrink-0">
                                                                <i className="bi bi-cpu text-cyan-500 text-[10px]"></i>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI & Data</span>
                                                        </div>
                                                        <ul className="space-y-0.5 list-none m-0 p-0">
                                                            {[
                                                                { to: '/solutions/data-analytics-ai', label: 'AI Automation', sub: 'LLM workflows' },
                                                                { to: '/solutions/digital-transformation', label: 'Digital Trans.', sub: 'Legacy modernization' },
                                                            ].map(item => (
                                                                <li key={item.to}>
                                                                    <Link to={item.to} className="block px-3 py-1.5 rounded-lg dark:hover:bg-slate-900 hover:bg-slate-50 transition-colors no-underline group/item">
                                                                        <div className="dark:text-slate-200 text-slate-800 text-sm font-medium group-hover/item:text-cyan-500 transition-colors">{item.label}</div>
                                                                        <div className="text-slate-500 text-[11px]">{item.sub}</div>
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>



                            {/* 2. INDUSTRIES */}
                            <div className="relative h-full flex items-center px-4"
                                onMouseEnter={() => handleMenuEnter('industries')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'industries'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors text-[13px] tracking-wide uppercase ${isActiveSection('industries') ? 'text-blue-500' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    Industries
                                    <i className={`bi bi-chevron-down text-[10px] transition-transform duration-200 opacity-50 ${openMenu === 'industries' ? 'rotate-180' : ''}`}></i>
                                </button>
                                {isActiveSection('industries') && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 rounded-full"></div>}
                                {openMenu === 'industries' && (
                                    <div
                                        className="absolute left-0 top-full mt-2 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-3 w-[265px] z-[1000]"
                                        onMouseEnter={handleDropdownEnter}
                                        onMouseLeave={handleDropdownLeave}
                                    >
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2">By Industry</div>
                                        {[
                                            { to: '/industries/healthcare', label: 'Healthcare & Medical', icon: 'bi-heart-pulse-fill', color: 'text-rose-500', sub: 'HIPAA Compliant' },
                                            { to: '/industries/finance', label: 'Financial Services', icon: 'bi-bank2', color: 'text-emerald-500', sub: 'FINRA / SEC' },
                                            { to: '/industries/government', label: 'Government & Civic', icon: 'bi-building', color: 'text-blue-500', sub: 'FedRAMP' },
                                            { to: '/industries/manufacturing', label: 'Retail & Manufacturing', icon: 'bi-nut-fill', color: 'text-amber-500', sub: 'PCI-DSS' },
                                            { to: '/industries/legal', label: 'Legal & Professional', icon: 'bi-briefcase-fill', color: 'text-indigo-500', sub: 'Client Data Privacy' },
                                            { to: '/industries/education', label: 'Education & Non-Profit', icon: 'bi-book-fill', color: 'text-purple-500', sub: 'FERPA' },
                                            { to: '/industries/energy', label: 'Energy & Utilities', icon: 'bi-lightning-charge-fill', color: 'text-yellow-500', sub: 'NERC CIP' },
                                        ].map(item => (
                                            <Link key={item.to} to={item.to} className="flex items-center gap-3 px-2 py-2 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/ind">
                                                <i className={`bi ${item.icon} ${item.color} text-base w-5 text-center shrink-0`}></i>
                                                <div>
                                                    <div className="dark:text-slate-200 text-slate-800 text-sm font-medium group-hover/ind:text-blue-500 transition-colors">{item.label}</div>
                                                    <div className="text-slate-500 text-[10px] uppercase tracking-wider">{item.sub}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 3. IT STORE */}
                            <div className="relative h-full flex items-center px-4">
                                <Link to="/ecommerce"
                                    className={`font-semibold text-[13px] tracking-wide uppercase no-underline whitespace-nowrap transition-colors ${isActiveSection('store') ? 'text-blue-500' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    IT Store
                                </Link>
                                {isActiveSection('store') && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 rounded-full"></div>}
                            </div>

                            {/* 4. RESOURCES */}
                            <div className="relative h-full flex items-center px-4"
                                onMouseEnter={() => handleMenuEnter('resources')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'resources'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors text-[13px] tracking-wide uppercase ${isActiveSection('resources') ? 'text-blue-500' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    Resources
                                    <i className={`bi bi-chevron-down text-[10px] transition-transform duration-200 opacity-50 ${openMenu === 'resources' ? 'rotate-180' : ''}`}></i>
                                </button>
                                {isActiveSection('resources') && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 rounded-full"></div>}
                                {openMenu === 'resources' && (
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-3 w-[250px] z-[1000]"
                                        onMouseEnter={handleDropdownEnter}
                                        onMouseLeave={handleDropdownLeave}
                                    >
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2">Learn</div>
                                        {[
                                            { to: '/blog', label: 'Blog', icon: 'bi-journal-text', color: 'text-blue-400' },
                                            { to: '/case-studies', label: 'Case Studies', icon: 'bi-stars', color: 'text-rose-400' },
                                            { to: '/events', label: 'Events & Webinars', icon: 'bi-calendar-event', color: 'text-indigo-400' },
                                            { to: '/reports', label: 'Reports & Whitepapers', icon: 'bi-file-earmark-bar-graph', color: 'text-emerald-400' },
                                            { to: '/podcasts', label: 'Podcasts', icon: 'bi-mic', color: 'text-purple-400' },
                                        ].map(item => (
                                            <Link key={item.to} to={item.to} className="flex items-center gap-3 px-2 py-2 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                                <i className={`bi ${item.icon} ${item.color} text-base w-5 text-center`}></i>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </Link>
                                        ))}
                                        <div className="h-px dark:bg-slate-800 bg-slate-100 my-2 mx-2"></div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2">Tools</div>
                                        {[
                                            { to: '/free-tools', label: 'Free IT Tools', icon: 'bi-tools', color: 'text-amber-400' },
                                            { to: '/compliance', label: 'Compliance Center', icon: 'bi-shield-check', color: 'text-cyan-400' },
                                        ].map(item => (
                                            <Link key={item.to} to={item.to} className="flex items-center gap-3 px-2 py-2 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                                <i className={`bi ${item.icon} ${item.color} text-base w-5 text-center`}></i>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>


                            {/* 5. COMPANY (+ Support merged) */}
                            <div className="relative h-full flex items-center px-4"
                                onMouseEnter={() => handleMenuEnter('company')}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    aria-expanded={openMenu === 'company'}
                                    aria-haspopup="true"
                                    className={`font-semibold flex items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors text-[13px] tracking-wide uppercase ${isActiveSection('company') ? 'text-blue-500' : 'dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900'}`}
                                >
                                    Company
                                    <i className={`bi bi-chevron-down text-[10px] transition-transform duration-200 opacity-50 ${openMenu === 'company' ? 'rotate-180' : ''}`}></i>
                                </button>
                                {isActiveSection('company') && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 rounded-full"></div>}
                                {openMenu === 'company' && (
                                    <div
                                        className="absolute right-0 top-full mt-2 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-3 w-[230px] z-[1000]"
                                        onMouseEnter={handleDropdownEnter}
                                        onMouseLeave={handleDropdownLeave}
                                    >
                                        {[
                                            { to: '/about', label: 'About Us', icon: 'bi-building', color: 'text-blue-400' },
                                            { to: '/team', label: 'Our Team', icon: 'bi-people', color: 'text-indigo-400' },
                                            { to: '/careers', label: 'Careers', icon: 'bi-briefcase', color: 'text-emerald-400' },
                                            { to: '/security', label: 'Trust Center', icon: 'bi-shield-lock', color: 'text-purple-400' },
                                            { to: '/support', label: 'Support', icon: 'bi-headset', color: 'text-cyan-400' },
                                            { to: '/status', label: 'System Status', icon: 'bi-activity', color: 'text-emerald-400' },
                                            { to: '/contact', label: 'Contact Us', icon: 'bi-envelope', color: 'text-amber-400' },
                                        ].map(item => (
                                            <Link key={item.to} to={item.to} className="flex items-center gap-3 px-2 py-2 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                                <i className={`bi ${item.icon} ${item.color} text-base w-5 text-center`}></i>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </Link>
                                        ))}
                                        <div className="h-px dark:bg-slate-800 bg-slate-100 my-2 mx-2"></div>
                                        <Link to="/partner" className="flex items-center gap-3 px-2 py-2 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline text-blue-500 font-semibold">
                                            <i className="bi bi-handshake text-base w-5 text-center"></i>
                                            <span className="text-sm">Partner with Us →</span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                        </nav>

                        {/* ── RIGHT SIDE ACTIONS ── */}
                        <div className="flex items-center gap-1.5">

                            {/* Search */}
                            <button
                                onClick={() => setSearchModalOpen(true)}
                                className="hidden xl:flex items-center gap-2 px-3 h-8 rounded-lg dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800 hover:bg-slate-100 transition-all cursor-pointer bg-transparent border-0"
                                title="Search (Cmd+K)"
                            >
                                <i className="bi bi-search text-sm"></i>
                                <span className="text-[10px] font-bold dark:bg-slate-800 bg-slate-200 px-1.5 py-0.5 rounded border dark:border-slate-700 border-slate-300 tracking-widest text-slate-400">⌘K</span>
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="hidden xl:flex w-8 h-8 items-center justify-center rounded-lg dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800 hover:bg-slate-100 transition-all cursor-pointer bg-transparent border-0"
                                title={isDark ? 'Light mode' : 'Dark mode'}
                            >
                                {isDark
                                    ? <i className="bi bi-sun-fill text-amber-400 text-sm"></i>
                                    : <i className="bi bi-moon-stars-fill text-blue-500 text-sm"></i>
                                }
                            </button>

                            {/* Divider */}
                            <div className="hidden xl:block h-5 w-px dark:bg-slate-700 bg-slate-200 mx-1"></div>

                            {isAuthenticated ? (
                                <div className="hidden xl:flex items-center gap-1.5">
                                    <Link to="/admin" className="px-3 py-1.5 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-[13px] font-medium transition-colors no-underline rounded-lg dark:hover:bg-slate-800 hover:bg-slate-100">
                                        Dashboard
                                    </Link>
                                    {/* Avatar Dropdown */}
                                    <UserAvatarDropdown user={user} onLogout={handleLogout} variant="public" />
                                </div>
                            ) : (
                                <div className="hidden xl:flex items-center gap-2">
                                    <Link to="/ecommerce" className="flex items-center gap-1.5 px-3 py-1.5 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-[13px] font-medium transition-colors no-underline rounded-lg dark:hover:bg-slate-800 hover:bg-slate-100">
                                        <i className="bi bi-shop text-blue-500 text-sm"></i>
                                        IT Store
                                    </Link>
                                    <Link to="/support" className="flex items-center gap-1.5 px-3 py-1.5 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-[13px] font-medium transition-colors no-underline rounded-lg dark:hover:bg-slate-800 hover:bg-slate-100">
                                        <i className="bi bi-life-preserver text-blue-500 text-sm"></i>
                                        Support
                                    </Link>
                                    <Link to="/login" className="px-3 py-1.5 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-[13px] font-medium transition-colors no-underline">
                                        Sign In
                                    </Link>
                                    <Link to="/contact" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-[13px] no-underline transition-all shadow-lg shadow-blue-600/25 whitespace-nowrap">
                                        Get a Demo
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Hamburger */}
                            <button
                                className="xl:hidden p-2 dark:text-white text-slate-900 bg-transparent border-0 cursor-pointer text-xl w-9 h-9 flex items-center justify-center ml-1"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <i className="bi bi-x-lg text-blue-500"></i> : <i className="bi bi-list"></i>}
                            </button>

                        </div>
                    </div>
                </div>
            </header >

            {/* Mobile Menu Content (Full Screen Overlay) */}
            <div className={`fixed inset-0 ${isDark ? 'bg-slate-950/95' : 'bg-white/95'} backdrop-blur-2xl z-40 transition-transform duration-500 ease-in-out xl:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                                <Link to="/solutions/noc" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Network Operations (NOC)</Link>
                                <Link to="/solutions/staff-augmentation" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Co-Managed IT Teams</Link>
                                
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-indigo-500">Cloud & Infra</span>
                                <Link to="/solutions/azure-aws" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Cloud Migrations</Link>
                                <Link to="/solutions/vdi-solutions" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Virtual Desktops (VDI)</Link>
                                <Link to="/solutions/microsoft-365" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Microsoft 365</Link>

                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-violet-500">Digital Services & AI</span>
                                <Link to="/solutions/web-design" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Web Design & Development</Link>
                                <Link to="/solutions/full-stack" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">E-Commerce & App Dev</Link>
                                <Link to="/solutions/data-analytics-ai" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">AI Automation & Analytics</Link>
                                <Link to="/solutions/digital-transformation" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Digital Transformation</Link>

                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-rose-500">Cybersecurity</span>
                                <Link to="/solutions/managed-detection-response" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Managed SOC / MDR</Link>
                                <Link to="/solutions/incident-response" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Incident Response</Link>
                                <Link to="/solutions/penetration-testing" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Penetration Testing</Link>
                                <Link to="/solutions/compliance-vciso" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Compliance & vCISO</Link>

                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-purple-500">Platform</span>
                                <Link to="/platform/platform-overview" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Platform Overview</Link>
                                <Link to="/platform/assess" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Security Dashboard</Link>
                                <Link to="/integrations" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Integrations</Link>

                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-emerald-500">Physical Security</span>
                                <Link to="/solutions/cctv-systems" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">CCTV & Cameras</Link>
                                <Link to="/solutions/access-control" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Access Control</Link>
                                <Link to="/solutions/structured-cabling" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Structured Cabling</Link>
                            </div>
                        </details>

                        {/* 2. Industries */}
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
                                <Link to="/industries/legal" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Legal & Professional</Link>
                                <Link to="/industries/education" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Education & Non-Profit</Link>
                                <Link to="/industries/energy" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Energy & Utilities</Link>
                            </div>
                        </details>

                        {/* 3. Pricing */}
                        <div className="py-3 border-b dark:border-slate-800/50 border-slate-200">
                            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold dark:text-white text-slate-900 no-underline block">Pricing</Link>
                        </div>

                        {/* IT Store */}
                        <div className="py-3 border-b dark:border-slate-800/50 border-slate-200">
                            <Link to="/ecommerce" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold dark:text-white text-slate-900 no-underline block">IT Store & Hardware</Link>
                        </div>

                        {/* 4. Resources */}
                        <details className="group/details border-b dark:border-slate-800/50 border-slate-200 py-3">
                            <summary className="flex items-center justify-between text-lg font-bold dark:text-white text-slate-900 cursor-pointer list-none">
                                Resources
                                <i className="bi bi-chevron-down transition-transform group-open/details:rotate-180 text-slate-500"></i>
                            </summary>
                            <div className="flex flex-col gap-3 pt-4 pl-4 border-l-2 border-emerald-600/50 mt-2">
                                <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Blog</Link>
                                <Link to="/case-studies" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Case Studies</Link>
                                <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Events & Webinars</Link>
                                <Link to="/reports" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Reports & Whitepapers</Link>
                                <Link to="/free-tools" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Free IT Tools</Link>
                                <Link to="/compliance" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Compliance Center</Link>
                            </div>
                        </details>

                        {/* 5. Company */}
                        <details className="group/details border-b dark:border-slate-800/50 border-slate-200 py-3">
                            <summary className="flex items-center justify-between text-lg font-bold dark:text-white text-slate-900 cursor-pointer list-none">
                                Company
                                <i className="bi bi-chevron-down transition-transform group-open/details:rotate-180 text-slate-500"></i>
                            </summary>
                            <div className="flex flex-col gap-3 pt-4 pl-4 border-l-2 border-amber-600/50 mt-2">
                                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">About Us</Link>
                                <Link to="/team" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Our Team</Link>
                                <Link to="/careers" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Careers</Link>
                                <Link to="/security" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Trust Center</Link>
                                <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Support</Link>
                                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Contact Us</Link>
                            </div>
                        </details>
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        <a href="#attack" onClick={() => { setMobileMenuOpen(false); setEmergencyModalOpen(true); }} className="w-full py-4 text-center border border-red-500/50 bg-red-500/10 text-red-400 rounded-xl font-bold uppercase tracking-wider hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] no-underline">
                            Under Attack?
                        </a>
                        {!isAuthenticated ? (
                            <>
                                <Link to="/ecommerce" onClick={() => setMobileMenuOpen(false)} className="w-full py-3.5 text-center border dark:border-slate-700 border-slate-200 dark:text-white text-slate-800 rounded-xl font-bold uppercase tracking-wider no-underline flex items-center justify-center gap-2 dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors">
                                    <i className="bi bi-shop text-blue-500"></i> IT Store
                                </Link>
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
                                    <img src={user?.avatar || "/maintenance/images/user/avatar.png"} alt="User" className="w-10 h-10 rounded-full border border-slate-700" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent((user?.first_name || user?.email?.split('@')[0] || 'U')) + '&background=2563EB&color=fff&size=64'; }} />
                                    <div>
                                        <div className="text-white font-bold text-sm">{user?.first_name || user?.email?.split('@')[0] || 'User'}</div>
                                        <div className="text-xs text-slate-500">{user?.is_superuser || user?.is_staff ? (user?.is_superuser ? 'Administrator' : 'Staff') : 'Client'}</div>
                                    </div>
                                </div>
                                <Link to={user?.is_superuser || user?.is_staff ? "/admin" : "/portal"} onClick={() => setMobileMenuOpen(false)} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-500 transition-colors no-underline">Go to App</Link>
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
            {/* PRE-FOOTER CTA                                               */}
            {/* ============================================================ */}
            <div className={`border-t transition-colors duration-300 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="container mx-auto px-4 md:px-8 py-16 lg:py-20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto text-center md:text-left">
                        <div>
                            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Ready to secure and scale your enterprise?</h2>
                            <p className="text-lg text-slate-500 m-0">Join thousands of organizations that trust BitGuard.</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <Link to="/contact" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors no-underline shadow-lg shadow-blue-500/25">Get a Demo</Link>
                            <Link to="/pricing" className={`px-6 py-3 border rounded-lg font-bold transition-colors no-underline ${isDark ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-300 text-slate-900 hover:bg-slate-100'}`}>View Pricing</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================ */}
            {/* FOOTER                                                        */}
            {/* ============================================================ */}
            <footer className={`footer-section mt-auto w-full transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-400 border-t border-slate-800' : 'bg-white text-slate-500 border-t border-slate-200'}`}>
                <div className="container mx-auto px-4 md:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
                        
                        {/* Column 1: Brand & Newsletter (Spans 2 columns on wide screens) */}
                        <div className="col-span-2 md:col-span-4 lg:col-span-2 pr-0 lg:pr-12 flex flex-col gap-8">
                            <Link to="/" className="flex items-center gap-[12px] no-underline group shrink-0">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                                    <img src="/maintenance/logo/logo.png" alt="BitGuard" className={`relative h-[30px] w-auto transition-all duration-300 ${isDark ? 'brightness-0 invert' : ''}`} onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <span className={`text-[28px] font-bold tracking-tight leading-none inline-block transform scale-x-[0.85] origin-left transition-all ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    BITGUARD
                                </span>
                            </Link>
                            
                            <div>
                                <p className="text-[13px] leading-relaxed mb-6">BitGuard provides enterprise-grade Managed IT, Cybersecurity, Cloud Infrastructure, and Digital Transformation services to organizations worldwide.</p>
                                
                                <form className="flex flex-col gap-3 w-full max-w-sm" onSubmit={handleFooterSubscribe}>
                                    <label htmlFor="footer-newsletter" className="sr-only">Email address for newsletter</label>
                                    <div className="flex gap-2 w-full">
                                        <input
                                            id="footer-newsletter"
                                            type="email"
                                            value={footerEmail}
                                            onChange={(e) => setFooterEmail(e.target.value)}
                                            placeholder="Subscribe to our newsletter"
                                            required
                                            disabled={footerStatus.type === 'loading' || footerStatus.type === 'success'}
                                            className={`flex-1 px-4 py-2.5 rounded-lg border text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                                        />
                                        <button
                                            type="submit"
                                            disabled={footerStatus.type === 'loading' || footerStatus.type === 'success'}
                                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[13px] transition-all shrink-0 disabled:opacity-60 border-none cursor-pointer"
                                        >
                                            {footerStatus.type === 'loading' ? '...' : footerStatus.type === 'success' ? '✓' : 'Join'}
                                        </button>
                                    </div>
                                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                        By subscribing, you agree to our <Link to="/privacy" className="underline hover:text-blue-500 transition-colors">Privacy Policy</Link> and consent to receive updates.
                                    </p>
                                </form>
                                {footerStatus.message && (
                                    <p className={`text-xs mt-2 ${footerStatus.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>{footerStatus.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-auto">
                                <a href="https://linkedin.com/company/bitguard" target="_blank" rel="noreferrer" className={`text-lg transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`} aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                            </div>
                        </div>

                        {/* Column 2: Solutions */}
                        <div className="flex flex-col gap-4">
                            <h4 className={`text-[11px] font-bold uppercase tracking-widest m-0 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Solutions</h4>
                            <div className="flex flex-col gap-3">
                                <Link to="/solutions/managed-detection-response" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Managed SOC</Link>
                                <Link to="/solutions/helpdesk-support" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Helpdesk IT</Link>
                                <Link to="/solutions/azure-aws" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Cloud Architecture</Link>
                                <Link to="/solutions/data-analytics-ai" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>AI Automation</Link>
                                <Link to="/solutions/full-stack" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Web & App Dev</Link>
                                <Link to="/solutions/camera-surveillance" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Camera Surveillance</Link>
                                <Link to="/solutions/access-control" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Access Control</Link>
                                <Link to="/solutions/alarm-systems" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Alarm Systems</Link>
                            </div>
                        </div>

                        {/* Column 3: Platform & Store */}
                        <div className="flex flex-col gap-4">
                            <h4 className={`text-[11px] font-bold uppercase tracking-widest m-0 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Platform</h4>
                            <div className="flex flex-col gap-3">
                                <Link to="/platform/platform-overview" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Overview</Link>
                                <Link to="/platform/assess" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Threat Dashboard</Link>
                                <Link to="/platform/incident-management" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Incident Management</Link>
                                <Link to="/platform/log-analysis" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Log Analysis</Link>
                                <Link to="/integrations" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Integrations</Link>
                                <Link to="/pricing" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Pricing</Link>
                                <div className="h-4"></div>
                                <h4 className={`text-[11px] font-bold uppercase tracking-widest m-0 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Hardware</h4>
                                <Link to="/ecommerce" className={`text-[13px] no-underline transition-colors flex items-center gap-1 ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>IT Store <i className="bi bi-box-arrow-up-right text-[10px]"></i></Link>
                            </div>
                        </div>

                        {/* Column 4: Resources */}
                        <div className="flex flex-col gap-4">
                            <h4 className={`text-[11px] font-bold uppercase tracking-widest m-0 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Resources</h4>
                            <div className="flex flex-col gap-3">
                                <Link to="/blog" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Blog</Link>
                                <Link to="/case-studies" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Case Studies</Link>
                                <Link to="/events" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Events & Webinars</Link>
                                <Link to="/reports" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Reports</Link>
                                <Link to="/podcasts" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Podcasts</Link>
                                <Link to="/free-tools" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Free IT Tools</Link>
                            </div>
                        </div>

                        {/* Column 5: Company */}
                        <div className="flex flex-col gap-4">
                            <h4 className={`text-[11px] font-bold uppercase tracking-widest m-0 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Company</h4>
                            <div className="flex flex-col gap-3">
                                <Link to="/about" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>About Us</Link>
                                <Link to="/team" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Team</Link>
                                <Link to="/careers" className={`text-[13px] no-underline transition-colors flex items-center gap-2 ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Careers <span className="text-[9px] bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded font-bold uppercase">Hiring</span></Link>
                                <Link to="/security" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Trust Center</Link>
                                <Link to="/partner" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Partners</Link>
                                <Link to="/contact" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Contact Sales</Link>
                                <Link to="/support" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>Support</Link>
                                <Link to="/status" className={`text-[13px] no-underline transition-colors ${isDark ? 'hover:text-white text-slate-400' : 'hover:text-blue-600 text-slate-500'}`}>System Status</Link>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar: Certs, Copyright, Legal */}
                <div className={`border-t py-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            
                            {/* Certifications Mini Bar */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                {['SOC2 Type II', 'ISO 27001', 'HIPAA', 'GDPR', 'PCI-DSS'].map((cert, i) => (
                                    <Link to="/security" key={i} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors no-underline">
                                        <i className="bi bi-shield-check text-blue-500/70"></i>
                                        <span>{cert}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-8 text-[13px]">
                                <Link to="/status" className={`flex items-center gap-2 font-medium no-underline transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}>
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    All Systems Operational
                                </Link>
                                
                                <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                                    <Link to="/privacy" className={`no-underline transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800'}`}>Privacy</Link>
                                    <Link to="/terms" className={`no-underline transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800'}`}>Terms</Link>
                                    <Link to="/sla" className={`no-underline transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800'}`}>SLA</Link>
                                    <Link to="/accessibility" className={`no-underline transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800'}`}>Accessibility</Link>
                                </div>
                                
                                <span className="text-slate-500">© {new Date().getFullYear()} BitGuard Inc.</span>
                            </div>

                        </div>
                    </div>
                </div>
            </footer>

            {/* Emergency Modal */}
            <EmergencyModal isOpen={emergencyModalOpen} onClose={() => setEmergencyModalOpen(false)} />

            {/* Global Search Modal */}
            {searchModalOpen && (
                <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex justify-center items-start pt-[10vh] px-4" onClick={() => setSearchModalOpen(false)}>
                    <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                            <i className="bi bi-search text-slate-400 text-xl mr-4"></i>
                            <input 
                                type="text" 
                                autoFocus
                                placeholder="Search documentation, services, and resources..." 
                                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white text-lg placeholder-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button onClick={() => setSearchModalOpen(false)} className="ml-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-transparent border-none cursor-pointer">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-4">
                            {isSearching ? (
                                <div className="p-8 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    Searching...
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-2">
                                    {searchResults.map((res, i) => (
                                        <Link key={i} to={res.url} onClick={() => setSearchModalOpen(false)} className="block p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors no-underline">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{res.type}</span>
                                                <h4 className="text-slate-900 dark:text-white font-semibold m-0 text-base">{res.title}</h4>
                                            </div>
                                            <p className="text-slate-500 text-sm m-0 mt-1">{res.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            ) : searchQuery.length >= 2 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <i className="bi bi-search text-3xl mb-3 block opacity-50"></i>
                                    No results found for "{searchQuery}"
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    Type at least 2 characters to search
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cookie Consent Banner */}
            {!cookieConsent && (
                <div className="fixed bottom-6 left-6 z-[9998] max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 animate-fade-in-up">
                    <div className="flex items-start gap-4">
                        <i className="bi bi-cookie text-amber-500 text-2xl"></i>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">We value your privacy</h4>
                            <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                            </p>
                            <div className="flex items-center gap-3">
                                <button onClick={acceptCookies} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-500/20 cursor-pointer border-none">Accept All</button>
                                <Link to="/privacy" className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium no-underline">Privacy Policy</Link>
                            </div>
                        </div>
                        <button onClick={() => setCookieConsent(true)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-transparent border-none cursor-pointer">
                            <i className="bi bi-x text-lg"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Under Attack CTA */}
            <button 
                onClick={() => setEmergencyModalOpen(true)}
                className="fixed bottom-24 right-6 z-50 bg-red-600 hover:bg-red-500 text-white font-bold tracking-widest uppercase text-xs py-3 px-6 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all border-none cursor-pointer flex items-center gap-2 hover:scale-105"
            >
                <i className="bi bi-shield-fill-exclamation text-lg"></i>
                UNDER ATTACK?
            </button>

            {/* Global Live Chat */}
            <LiveChat />
        </div>
    );
};

const WebsiteLayout = ({ children }) => (
    <ThemeProvider>
        <WebsiteLayoutInner>{children}</WebsiteLayoutInner>
    </ThemeProvider>
);

export default WebsiteLayout;
