import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeProvider, useTheme } from '../context/ThemeProvider';
import '../styles/landing.css';

const PublicLayoutInner = ({ children }) => {
    const { theme, toggleTheme, isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const isLanding = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

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

    return (
        <div className={`landing-page-wrapper font-sans min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'text-slate-300 bg-slate-950' : 'text-slate-700 bg-white'}`}>

            {/* Header */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || !isLanding ? (isDark ? 'bg-slate-950/95 backdrop-blur-xl shadow-md border-b border-white/5' : 'bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200') : 'bg-transparent'} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <div className="w-full px-4 md:px-8">
                    <div className="flex items-center justify-between h-16">
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

                        {/* Desktop Nav — Order: Solutions → Platform → Resources → Company → Support */}
                        <nav className="hidden lg:flex items-center gap-7">

                            {/* 1. SOLUTIONS (MEGA MENU) — Lead with buyer problems */}
                            <div className="group h-16 flex items-center">
                                <button className="dark:text-slate-300 text-slate-600 font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer dark:group-hover:text-white group-hover:text-slate-900 transition-colors text-sm tracking-wide">
                                    SOLUTIONS
                                    <i className="bi bi-chevron-down text-xs ml-1 opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                </button>
                                <div className="absolute left-0 w-full top-[100%] hidden group-hover:block z-[1000] pointer-events-auto">
                                    <div className="dark:bg-slate-950 bg-white border-y dark:border-slate-800 border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="container mx-auto px-4 py-8">
                                            <div className="grid grid-cols-4 gap-8">
                                                <div>
                                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2"><i className="bi bi-hdd-network"></i> Managed IT</h3>
                                                    <ul className="space-y-3 m-0 p-0 list-none">
                                                        <li><Link to="/solutions/managed-detection-response" className="dark:text-white text-slate-900 dark:hover:text-blue-400 hover:text-blue-600 text-sm font-semibold transition-colors no-underline block">Managed Detection & Response</Link></li>
                                                        <li><Link to="/solutions/backup-disaster-recovery" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Backup & Disaster Recovery</Link></li>
                                                        <li><Link to="/solutions/mfa" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Multi-Factor Authentication</Link></li>
                                                        <li><Link to="/solutions/voip-services" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">VoIP Services</Link></li>
                                                        <li><Link to="/solutions/noc" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Network Operations Center</Link></li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2"><i className="bi bi-shield-check"></i> Cybersecurity</h3>
                                                    <ul className="space-y-3 m-0 p-0 list-none">
                                                        <li><Link to="/solutions/bitguard-bundle" className="dark:text-white text-slate-900 dark:hover:text-indigo-400 hover:text-indigo-600 text-sm font-semibold transition-colors no-underline block">BitGuard Bundle</Link></li>
                                                        <li><Link to="/solutions/threat-detection" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Threat Detection</Link></li>
                                                        <li><Link to="/solutions/edr" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">EDR Endpoint Defense</Link></li>
                                                        <li><Link to="/solutions/incident-response" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Incident Response</Link></li>
                                                        <li><Link to="/solutions/compliance-audit" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Compliance & Audit Readiness</Link></li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2"><i className="bi bi-cloud-arrow-up"></i> Cloud & Infrastructure</h3>
                                                    <ul className="space-y-3 m-0 p-0 list-none">
                                                        <li><Link to="/solutions/azure-aws" className="dark:text-white text-slate-900 dark:hover:text-cyan-400 hover:text-cyan-600 text-sm font-semibold transition-colors no-underline block">Azure & AWS Management</Link></li>
                                                        <li><Link to="/solutions/microsoft-365" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Microsoft 365</Link></li>
                                                        <li><Link to="/solutions/cloud-storage" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Secure Cloud Storage</Link></li>
                                                        <li><Link to="/solutions/web-design" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Web & App Development</Link></li>
                                                        <li><Link to="/solutions/full-stack" className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 text-sm transition-colors no-underline block">Full Stack Engineering</Link></li>
                                                    </ul>
                                                </div>
                                                <div className="dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl p-6 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full"></div>
                                                    <h3 className="dark:text-white text-slate-900 font-bold text-lg mb-2 relative z-10"><i className="bi bi-lightning-charge-fill text-yellow-500 mr-2"></i> Professional Services</h3>
                                                    <p className="dark:text-slate-400 text-slate-600 text-sm mb-4 leading-relaxed relative z-10">Expand your existing IT capabilities with our expert-led consulting and hybrid support models.</p>
                                                    <ul className="space-y-2 m-0 p-0 list-none relative z-10">
                                                        <li><Link to="/solutions/staff-augmentation" className="dark:text-blue-400 text-blue-600 dark:hover:text-blue-300 hover:text-blue-500 text-sm font-semibold transition-colors no-underline block">Staff Augmentation &rarr;</Link></li>
                                                        <li><Link to="/solutions/digital-transformation" className="dark:text-blue-400 text-blue-600 dark:hover:text-blue-300 hover:text-blue-500 text-sm font-semibold transition-colors no-underline block">Digital Transformation &rarr;</Link></li>
                                                        <li><Link to="/solutions/workflow-automation" className="dark:text-blue-400 text-blue-600 dark:hover:text-blue-300 hover:text-blue-500 text-sm font-semibold transition-colors no-underline block">Workflow Automation &rarr;</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. PLATFORM */}
                            <div className="group relative h-16 flex items-center">
                                <button className="dark:text-slate-300 text-slate-600 font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer dark:group-hover:text-white group-hover:text-slate-900 transition-colors text-sm tracking-wide">
                                    PLATFORM
                                    <i className="bi bi-chevron-down text-xs ml-1 opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                </button>
                                <div className="hidden group-hover:block absolute left-0 top-[100%] dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-4 w-[320px] z-[1000] animate-in fade-in slide-in-from-top-2 duration-200 ring-1 dark:ring-white/5 ring-slate-900/5">
                                    <div className="grid grid-cols-1 gap-2">
                                        <Link to="/platform/platform-overview" className="flex items-start gap-3 p-3 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/link">
                                            <i className="bi bi-grid-1x2-fill text-blue-500 mt-1"></i>
                                            <div>
                                                <div className="dark:text-white text-slate-900 font-bold text-sm dark:group-hover/link:text-blue-400 group-hover/link:text-blue-600 transition-colors">Platform Overview</div>
                                                <div className="dark:text-slate-400 text-slate-500 text-xs mt-0.5">The complete BitGuard ecosystem</div>
                                            </div>
                                        </Link>
                                        <Link to="/platform/assess" className="flex items-start gap-3 p-3 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/link">
                                            <i className="bi bi-clipboard-data-fill text-indigo-500 mt-1"></i>
                                            <div>
                                                <div className="dark:text-white text-slate-900 font-bold text-sm dark:group-hover/link:text-indigo-400 group-hover/link:text-indigo-600 transition-colors">Assess & Audit</div>
                                                <div className="dark:text-slate-400 text-slate-500 text-xs mt-0.5">Continuous risk & compliance scoring</div>
                                            </div>
                                        </Link>
                                        <Link to="/platform/defend" className="flex items-start gap-3 p-3 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/link">
                                            <i className="bi bi-shield-lock-fill text-green-500 mt-1"></i>
                                            <div>
                                                <div className="dark:text-white text-slate-900 font-bold text-sm dark:group-hover/link:text-green-400 group-hover/link:text-green-600 transition-colors">Defend & Protect</div>
                                                <div className="dark:text-slate-400 text-slate-500 text-xs mt-0.5">Automated threat mitigation</div>
                                            </div>
                                        </Link>
                                        <Link to="/platform/control" className="flex items-start gap-3 p-3 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors no-underline group/link">
                                            <i className="bi bi-sliders text-purple-500 mt-1"></i>
                                            <div>
                                                <div className="dark:text-white text-slate-900 font-bold text-sm dark:group-hover/link:text-purple-400 group-hover/link:text-purple-600 transition-colors">Control & Governance</div>
                                                <div className="dark:text-slate-400 text-slate-500 text-xs mt-0.5">Centralized policy management</div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="mt-2 pt-3 border-t dark:border-slate-800 border-slate-200">
                                        <Link to="/platform/security-advisor" className="flex items-center justify-between p-2 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline text-xs font-bold uppercase tracking-wider">
                                            <span>Security Advisor</span>
                                            <i className="bi bi-arrow-right text-blue-500"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* 3. RESOURCES — with Store added */}
                            <div className="group relative h-16 flex items-center">
                                <button className="dark:text-slate-300 text-slate-600 font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer dark:group-hover:text-white group-hover:text-slate-900 transition-colors text-sm tracking-wide">
                                    RESOURCES
                                    <i className="bi bi-chevron-down text-xs ml-1 opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                </button>
                                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-[100%] dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-2 w-[260px] z-[1000] animate-in fade-in slide-in-from-top-2 duration-200 ring-1 dark:ring-white/5 ring-slate-900/5">
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
                                    <Link to="/free-tools" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-tools text-lg text-amber-400"></i> <span className="font-medium text-sm">Free IT Tools</span>
                                    </Link>
                                    <Link to="/compliance" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-shield-check text-lg text-cyan-400"></i> <span className="font-medium text-sm">Compliance Center</span>
                                    </Link>
                                    <div className="h-px dark:bg-slate-800 bg-slate-200 my-1"></div>
                                    <Link to="/store" className="flex items-center gap-3 p-2.5 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-50 dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors no-underline">
                                        <i className="bi bi-shop text-lg text-sky-400"></i> <span className="font-medium text-sm">IT Hardware Store</span>
                                    </Link>
                                </div>
                            </div>

                            {/* 4. COMPANY */}
                            <div className="group relative h-16 flex items-center">
                                <button className="dark:text-slate-300 text-slate-600 font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer dark:group-hover:text-white group-hover:text-slate-900 transition-colors text-sm tracking-wide">
                                    COMPANY
                                    <i className="bi bi-chevron-down text-xs ml-1 opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                </button>
                                <div className="hidden group-hover:block absolute right-0 top-[100%] dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-xl shadow-2xl p-2 w-[220px] z-[1000] animate-in fade-in slide-in-from-top-2 duration-200 ring-1 dark:ring-white/5 ring-slate-900/5">
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
                                </div>
                            </div>

                            {/* 5. SUPPORT */}
                            <div className="h-16 flex items-center">
                                <Link to="/support" className="dark:text-slate-300 text-slate-600 font-semibold no-underline dark:hover:text-white hover:text-slate-900 transition-colors text-sm tracking-wide">SUPPORT</Link>
                            </div>
                        </nav>

                        {/* CTA Buttons & User Section */}
                        <div className="flex items-center gap-3">
                            <a href="#attack" className="hidden lg:block px-4 py-2 border border-red-500/50 text-red-400 rounded-lg font-bold uppercase text-xs tracking-wider no-underline hover:bg-red-500/10 hover:border-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]">Under Attack?</a>

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
                                    <Link to="/contact" className="hidden lg:flex px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold uppercase text-xs tracking-wider no-underline transition-all shadow-lg shadow-blue-600/20 items-center gap-2">
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
                        {/* 1. Solutions */}
                        <details className="group/details border-b dark:border-slate-800/50 border-slate-200 py-3">
                            <summary className="flex items-center justify-between text-lg font-bold dark:text-white text-slate-900 cursor-pointer list-none">
                                Solutions
                                <i className="bi bi-chevron-down transition-transform group-open/details:rotate-180 text-slate-500"></i>
                            </summary>
                            <div className="flex flex-col gap-3 pt-4 pl-4 border-l-2 border-blue-600/50 mt-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Managed IT</span>
                                <Link to="/solutions/managed-detection-response" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Managed Detection & Response</Link>
                                <Link to="/solutions/backup-disaster-recovery" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Backup & Disaster Recovery</Link>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Cybersecurity</span>
                                <Link to="/solutions/bitguard-bundle" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">BitGuard Bundle</Link>
                                <Link to="/solutions/threat-detection" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Threat Detection</Link>
                                <Link to="/solutions/edr" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">EDR Endpoint Defense</Link>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Cloud & Infrastructure</span>
                                <Link to="/solutions/azure-aws" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Azure & AWS Management</Link>
                                <Link to="/solutions/microsoft-365" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Microsoft 365</Link>
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
                                <Link to="/platform/assess" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Assess & Audit</Link>
                                <Link to="/platform/defend" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Defend & Protect</Link>
                                <Link to="/platform/control" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Control & Governance</Link>
                                <Link to="/platform/security-advisor" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Security Advisor</Link>
                            </div>
                        </details>

                        {/* 3. Resources */}
                        <details className="group/details border-b dark:border-slate-800/50 border-slate-200 py-3">
                            <summary className="flex items-center justify-between text-lg font-bold dark:text-white text-slate-900 cursor-pointer list-none">
                                Resources
                                <i className="bi bi-chevron-down transition-transform group-open/details:rotate-180 text-slate-500"></i>
                            </summary>
                            <div className="flex flex-col gap-3 pt-4 pl-4 border-l-2 border-emerald-600/50 mt-2">
                                <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Blog</Link>
                                <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Events & Webinars</Link>
                                <Link to="/reports" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Reports & Whitepapers</Link>
                                <Link to="/podcasts" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Podcasts</Link>
                                <Link to="/free-tools" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Free IT Tools</Link>
                                <Link to="/compliance" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-900 text-base no-underline block">Compliance Center</Link>
                                <Link to="/store" onClick={() => setMobileMenuOpen(false)} className="text-blue-500 hover:text-blue-400 text-base no-underline block font-semibold mt-1">IT Hardware Store &rarr;</Link>
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

                        {/* 5. Support */}
                        <div className="py-3 border-b dark:border-slate-800/50 border-slate-200">
                            <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold dark:text-white text-slate-900 no-underline block">Support</Link>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        <a href="#attack" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center border border-red-500/50 bg-red-500/10 text-red-400 rounded-xl font-bold uppercase tracking-wider hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] no-underline">
                            Under Attack?
                        </a>
                        {!isAuthenticated ? (
                            <>
                                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-blue-600/20 no-underline">
                                    Get Started
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

            {/* Footer — Columns: Solutions → Platform → Resources → Company */}
            <footer className={`footer-section mt-auto w-full pt-[5%] pb-10 px-[10%] border-t transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-300 border-slate-900' : 'bg-slate-900 text-slate-300 border-slate-800'}`}>
                <div className="flex flex-col md:flex-row gap-8 justify-between items-start w-full">

                    {/* Logo & Social */}
                    <div className="flex flex-col items-center md:items-center md:w-[250px] gap-6">
                        <Link to="/" className="flex flex-col items-center gap-3 no-underline group scale-90 md:scale-100 origin-left">
                            <img src="/assets/logo/logo.png" alt="BitGuard" className="max-w-[120px] brightness-0 invert drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-300" onError={(e) => e.target.style.display = 'none'} />
                            <div className="text-[28px] font-[Oswald] font-semibold tracking-[2px] scale-y-[1.4] inline-block uppercase text-center text-white drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all">BITGUARD</div>
                        </Link>
                        <div className="flex gap-4 text-lg">
                            <a href="#" className="text-slate-400 hover:text-[#38bdf8] transition-colors"><i className="bi bi-github"></i></a>
                            <a href="#" className="text-slate-400 hover:text-[#38bdf8] transition-colors"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="text-slate-400 hover:text-[#38bdf8] transition-colors"><i className="bi bi-linkedin"></i></a>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="flex flex-wrap gap-5 w-full justify-between">

                        {/* Solutions — First column */}
                        <div className="flex flex-col gap-4 min-w-[150px]">
                            <h2 className="font-semibold uppercase text-xl m-0 text-white">Solutions</h2>
                            <div className="flex flex-col gap-3">
                                <Link to="/solutions/managed-detection-response" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Managed IT Services</Link>
                                <Link to="/solutions/threat-detection" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Cybersecurity</Link>
                                <Link to="/solutions/azure-aws" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Cloud & Infrastructure</Link>
                                <Link to="/solutions/staff-augmentation" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Professional Services</Link>
                                <Link to="/solutions/web-design" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Digital Services</Link>
                                <Link to="/solutions/digital-transformation" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Digital Transformation</Link>
                            </div>
                        </div>

                        {/* Platform */}
                        <div className="flex flex-col gap-4 min-w-[150px]">
                            <h2 className="font-semibold uppercase text-xl m-0 text-white">Platform</h2>
                            <div className="flex flex-col gap-3">
                                <Link to="/platform/platform-overview" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Platform Overview</Link>
                                <Link to="/platform/assess" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Assess & Audit</Link>
                                <Link to="/platform/defend" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Defend & Protect</Link>
                                <Link to="/platform/control" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Control & Governance</Link>
                                <Link to="/platform/security-advisor" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Security Advisor</Link>
                            </div>
                        </div>

                        {/* Resources — with IT Store */}
                        <div className="flex flex-col gap-4 min-w-[150px]">
                            <h2 className="font-semibold uppercase text-xl m-0 text-white">Resources</h2>
                            <div className="flex flex-col gap-3">
                                <Link to="/blog" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Blog</Link>
                                <Link to="/events" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Events & Webinars</Link>
                                <Link to="/reports" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Reports</Link>
                                <Link to="/podcasts" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Podcasts</Link>
                                <Link to="/free-tools" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Free IT Tools</Link>
                                <Link to="/compliance" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Compliance Center</Link>
                                <Link to="/store" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">IT Hardware Store</Link>
                            </div>
                        </div>

                        {/* Company */}
                        <div className="flex flex-col gap-4 min-w-[150px]">
                            <h2 className="font-semibold uppercase text-xl m-0 text-white">Company</h2>
                            <div className="flex flex-col gap-3">
                                <Link to="/about" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">About Us</Link>
                                <Link to="/team" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Our Team</Link>
                                <Link to="/careers" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Careers</Link>
                                <Link to="/contact" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Contact Us</Link>
                                <Link to="/support" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Support</Link>
                            </div>
                        </div>

                    </div>
                </div>

                <hr className="mt-8 border-t border-slate-800" />

                <div className="mt-2 flex flex-col gap-2 items-center text-xs text-slate-500 text-center justify-around">
                    <span>Copyright &#169; 2023-{new Date().getFullYear()}</span>
                    <span>All trademarks and copyrights belong to their respective owners.</span>
                </div>
            </footer>
        </div>
    );
};

const PublicLayout = ({ children }) => (
    <ThemeProvider>
        <PublicLayoutInner>{children}</PublicLayoutInner>
    </ThemeProvider>
);

export default PublicLayout;
