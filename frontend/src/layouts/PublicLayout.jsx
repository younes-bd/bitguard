import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const PublicLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLanding = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Mock Auth State (Replace with actual auth context later)
    const isAuthenticated = !!localStorage.getItem('access_token');
    const user = {
        username: 'User',
        email: 'user@example.com',
        avatar: null // Use placeholder
    };

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="landing-page-wrapper font-sans text-slate-300 bg-slate-950 min-h-screen flex flex-col">
            {/* Google Fonts - Oswald (Injected here for ensure it exists) */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap');`}
            </style>

            {/* Header */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || !isLanding ? 'bg-slate-950/95 backdrop-blur-xl shadow-md border-b border-white/5' : 'bg-transparent'} text-white`}>
                <div className="w-full px-4 md:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div>
                            <Link to="/" className="flex items-center gap-[12px] no-underline group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                                    <img src="/assets/logo/logo.png" alt="BitGuard" className="relative h-[30px] w-auto brightness-0 invert drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-300" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <span className="text-white text-[24px] font-semibold font-[Oswald] tracking-[2px] leading-none inline-block mt-[-4px] scale-y-[1.4] origin-left drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all">BITGUARD</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-8">

                            {/* PLATFORM */}
                            <div className="group relative">
                                <button className="text-slate-300 font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer py-2 group-hover:text-white transition-colors text-sm tracking-wide">
                                    PLATFORM
                                    <svg className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[220px] z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <Link to="/platform/platform-overview" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Platform Overview</Link>
                                    <Link to="/platform/assess" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Assess & Audit</Link>
                                    <Link to="/platform/defend" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Defend & Protect</Link>
                                    <Link to="/platform/control" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Control & Governance</Link>
                                    <Link to="/platform/security-advisor" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Security Advisor</Link>
                                    <Link to="/solutions/premium-addons" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Premium Add-ons</Link>
                                </div>
                            </div>

                            {/* SOLUTIONS */}
                            <div className="group relative">
                                <button className="text-slate-300 font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer py-2 group-hover:text-white transition-colors text-sm tracking-wide">
                                    SOLUTIONS
                                    <svg className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[260px] z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">

                                    {/* Managed IT Submenu */}
                                    <div className="group/sub relative">
                                        <div className="flex items-center justify-between text-slate-400 font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                                            Managed IT Services
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                        <div className="hidden group-hover/sub:block absolute left-full top-0 ml-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[220px] z-[1001]">
                                            <Link to="/solutions/backup-disaster-recovery" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Backup & Disaster Recovery</Link>
                                            <Link to="/solutions/managed-detection-response" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Managed Detection & Response</Link>
                                            <Link to="/solutions/mfa" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Multi-Factor Authentication</Link>
                                            <Link to="/solutions/voip-services" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">VoIP Services</Link>
                                            <Link to="/solutions/noc" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Network Operations Center</Link>
                                        </div>
                                    </div>

                                    {/* Cybersecurity Submenu */}
                                    <div className="group/sub relative">
                                        <div className="flex items-center justify-between text-slate-400 font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                                            Cybersecurity
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                        <div className="hidden group-hover/sub:block absolute left-full top-0 ml-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[220px] z-[1001]">
                                            <Link to="/solutions/bitguard-bundle" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">BitGuard Bundle</Link>
                                            <Link to="/solutions/threat-detection" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Threat Detection</Link>
                                            <Link to="/solutions/edr" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">EDR</Link>
                                            <Link to="/solutions/incident-response" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Incident Response</Link>
                                            <Link to="/solutions/vulnerability-scanning" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Vuln. Scanning</Link>
                                            <Link to="/solutions/compliance-audit" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Compliance & Audit</Link>
                                        </div>
                                    </div>

                                    {/* Cloud Services Submenu */}
                                    <div className="group/sub relative">
                                        <div className="flex items-center justify-between text-slate-400 font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                                            Cloud Services
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                        <div className="hidden group-hover/sub:block absolute left-full top-0 ml-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[220px] z-[1001]">
                                            <Link to="/solutions/microsoft-365" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Microsoft 365</Link>
                                            <Link to="/solutions/azure-aws" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Azure & AWS</Link>
                                            <Link to="/solutions/cloud-storage" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Cloud Storage</Link>
                                        </div>
                                    </div>

                                    {/* Digital Services Submenu */}
                                    <div className="group/sub relative">
                                        <div className="flex items-center justify-between text-slate-400 font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                                            Digital Services
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                        <div className="hidden group-hover/sub:block absolute left-full top-0 ml-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[220px] z-[1001]">
                                            <Link to="/solutions/web-design" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Web Design & Dev</Link>
                                            <Link to="/solutions/design-services" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Design Services</Link>
                                            <Link to="/solutions/full-stack" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Full Stack Dev</Link>
                                            <Link to="/solutions/app-development" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">App Development</Link>
                                        </div>
                                    </div>

                                    {/* Business Process Improvement Submenu */}
                                    <div className="group/sub relative">
                                        <div className="flex items-center justify-between text-slate-400 font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                                            Business Process Improvement
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                        <div className="hidden group-hover/sub:block absolute left-full top-0 ml-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[220px] z-[1001]">
                                            <Link to="/solutions/workflow-automation" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Workflow Automation</Link>
                                            <Link to="/solutions/erp-consulting" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">ERP Consulting</Link>
                                            <Link to="/solutions/digital-transformation" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Digital Transformation</Link>
                                            <Link to="/solutions/process-audits" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Process Audits</Link>
                                        </div>
                                    </div>

                                    {/* Co-Managed IT Submenu */}
                                    <div className="group/sub relative">
                                        <div className="flex items-center justify-between text-slate-400 font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                                            Co-Managed IT
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                        <div className="hidden group-hover/sub:block absolute left-full top-0 ml-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[220px] z-[1001]">
                                            <Link to="/solutions/staff-augmentation" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Staff Augmentation</Link>
                                            <Link to="/solutions/specialized-projects" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Specialized Projects</Link>
                                            <Link to="/solutions/hybrid-support" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Hybrid Support</Link>
                                            <Link to="/solutions/consulting" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">IT Consulting</Link>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* RESOURCES */}
                            <div className="group relative">
                                <button className="text-slate-300 font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer py-2 group-hover:text-white transition-colors text-sm tracking-wide">
                                    RESOURCES
                                    <svg className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[220px] z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <Link to="/blog" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Blog</Link>
                                    <Link to="/events" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Events</Link>
                                    <Link to="/free-tools" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Free Tools</Link>
                                    <Link to="/reports" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Reports</Link>
                                    <Link to="/podcasts" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Podcasts</Link>
                                    <Link to="/compliance" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Compliance</Link>
                                </div>
                            </div>

                            {/* STORE */}
                            <Link to="/store" className="text-slate-300 font-semibold no-underline hover:text-white transition-colors text-sm tracking-wide">STORE</Link>

                            {/* COMPANY */}
                            <div className="group relative">
                                <button className="text-slate-300 font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer py-2 group-hover:text-white transition-colors text-sm tracking-wide">
                                    COMPANY
                                    <svg className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 w-[200px] z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <Link to="/about" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">About Us</Link>
                                    <Link to="/team" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Our Team</Link>
                                    <Link to="/careers" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Careers</Link>
                                    <Link to="/contact" className="block text-slate-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors no-underline">Contact us</Link>
                                </div>
                            </div>


                            <Link to="/support" className="text-slate-300 font-semibold no-underline hover:text-white transition-colors text-sm tracking-wide">SUPPORT</Link>
                        </nav>

                        {/* CTA Buttons & User Section */}
                        <div className="flex items-center gap-3">
                            <a href="#attack" className="hidden lg:block px-5 py-2.5 border-2 border-red-500/50 text-red-400 rounded-lg font-bold uppercase text-xs tracking-wider no-underline hover:bg-red-500/10 hover:border-red-500 transition-all">Under Attack?</a>

                            {isAuthenticated ? (
                                <div className="group relative">
                                    <button className="flex items-center bg-transparent border-none p-0 cursor-pointer group hover:opacity-100 transition-opacity">
                                        <div className="w-9 h-9 relative">
                                            <img src="/assets/images/user/avatar.png" alt="User" className="w-full h-full object-cover rounded-full border border-slate-700/50" />
                                        </div>
                                    </button>

                                    {/* User Dropdown */}
                                    <div className="hidden group-hover:block absolute right-0 top-full pt-2 w-[240px] z-[1000]">
                                        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden">
                                            {/* User Header */}
                                            <div className="px-4 py-3 border-b border-slate-800">
                                                <div className="font-semibold text-white text-sm">{user.username}</div>
                                                <div className="text-xs text-slate-400 truncate">{user.email}</div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1">
                                                <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-speedometer2"></i>
                                                    <span>Dashboard</span>
                                                </Link>
                                                <Link to="/admin/crm" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-people-fill"></i>
                                                    <span>Staff Portal</span>
                                                </Link>
                                                <Link to="/admin/erp" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-grid-3x3-gap-fill"></i>
                                                    <span>ERP Console</span>
                                                </Link>

                                                <div className="h-px bg-slate-800 my-1 mx-2"></div>

                                                <Link to="/account/personal-info" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-person-circle"></i>
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link to="/account/security" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                                    <i className="bi bi-gear-fill"></i>
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
                                <Link to="/login" className="px-5 py-2.5 bg-[#0ea5e9] text-white rounded-lg font-bold uppercase text-xs tracking-wider no-underline hover:bg-[#0284c7] transition-all shadow-lg shadow-sky-500/20">Sign In</Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button className="lg:hidden p-2 text-white bg-transparent border-0 cursor-pointer relative z-50 text-2xl w-10 h-10 flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <i className="bi bi-x-lg text-blue-500"></i> : <i className="bi bi-list"></i>}
                            </button>
                        </div>
                    </div>
                </div >
            </header >

            {/* Mobile Menu Content (Full Screen Overlay) */}
            < div className={`fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-40 transition-transform duration-500 ease-in-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full pt-28 px-6 pb-10 overflow-y-auto">

                    <div className="flex flex-col gap-6">
                        {/* Mobile Nav Links */}
                        <div className="space-y-4">
                            <div className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-2">Platform</div>
                            <Link to="/platform/platform-overview" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-bold text-white hover:text-blue-400">Overview</Link>
                            <Link to="/platform/assess" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-bold text-white hover:text-blue-400">Assess</Link>
                            <Link to="/platform/defend" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-bold text-white hover:text-blue-400">Defend</Link>
                        </div>

                        <div className="w-full h-px bg-slate-800/50 my-2"></div>

                        <div className="space-y-4">
                            <div className="text-xs text-purple-500 font-bold uppercase tracking-widest mb-2">Solutions</div>
                            <Link to="/solutions/managed-detection-response" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-semibold text-slate-300 hover:text-purple-400">MDR</Link>
                            <Link to="/solutions/backup-disaster-recovery" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-semibold text-slate-300 hover:text-purple-400">Backup & DR</Link>
                            <Link to="/solutions/cloud-storage" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-semibold text-slate-300 hover:text-purple-400">Cloud Services</Link>
                        </div>

                        <div className="w-full h-px bg-slate-800/50 my-2"></div>

                        <div className="space-y-6">
                            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-slate-400 hover:text-white">About Company</Link>
                            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-slate-400 hover:text-white">Contact Us</Link>
                        </div>
                    </div>

                    <div className="mt-auto pt-10 flex flex-col gap-4">
                        <a href="#attack" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center border border-red-500/50 bg-red-500/10 text-red-400 rounded-xl font-bold uppercase tracking-wider hover:bg-red-500/20">
                            Under Attack?
                        </a>
                        {!isAuthenticated ? (
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-blue-600/20">
                                Sign In Portal
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                                <img src="/assets/images/user/avatar.png" alt="User" className="w-12 h-12 rounded-full border-2 border-blue-500" />
                                <div>
                                    <div className="text-white font-bold">{user.username}</div>
                                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm text-blue-400">Go to Dashboard</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >


            {/* Main Content */}
            < main className="flex-1" >
                {children || <Outlet />}
            </main >

            {/* Footer */}
            < footer className="footer-section mt-auto w-full pt-[5%] pb-10 px-[10%] bg-slate-950 text-slate-300 border-t border-slate-900" >
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

                        {/* Platform */}
                        <div className="flex flex-col gap-4 min-w-[150px]">
                            <h2 className="font-semibold uppercase text-xl m-0 text-white">Platform</h2>
                            <div className="flex flex-col gap-3">
                                <Link to="/platform/platform-overview" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Platform Overview</Link>
                                <Link to="/platform/assess" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Assess & Audit</Link>
                                <Link to="/platform/defend" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Defend & Protect</Link>
                                <Link to="/platform/control" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Control & Governance</Link>
                                <Link to="/solutions/premium-addons" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Premium Add-ons</Link>
                                <Link to="/platform/security-advisor" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Security Advisor</Link>
                            </div>
                        </div>

                        {/* Solutions */}
                        <div className="flex flex-col gap-4 min-w-[150px]">
                            <h2 className="font-semibold uppercase text-xl m-0 text-white">Solutions</h2>
                            <div className="flex flex-col gap-3">
                                <Link to="/solutions/backup-disaster-recovery" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Managed IT Services</Link>
                                <Link to="/solutions/threat-detection" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Cybersecurity</Link>
                                <Link to="/solutions/azure-aws" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Cloud Services</Link>
                                <Link to="/solutions/co-managed-it" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Co-Managed IT</Link>
                                <Link to="/solutions/business-process-improvement" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Business Process Improvement</Link>
                                <Link to="/solutions/web-design" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Digital Services</Link>
                            </div>
                        </div>

                        {/* Resources */}
                        <div className="flex flex-col gap-4 min-w-[150px]">
                            <h2 className="font-semibold uppercase text-xl m-0 text-white">Resources</h2>
                            <div className="flex flex-col gap-3">
                                <Link to="/blog" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Blog</Link>
                                <Link to="/events" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Events</Link>
                                <Link to="/free-tools" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Free Tools</Link>
                                <Link to="/reports" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Reports</Link>
                                <Link to="/podcasts" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Podcasts</Link>
                                <Link to="/compliance" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Compliance</Link>
                            </div>
                        </div>

                        {/* Company */}
                        <div className="flex flex-col gap-4 min-w-[150px]">
                            <h2 className="font-semibold uppercase text-xl m-0 text-white">Company</h2>
                            <div className="flex flex-col gap-3">
                                <Link to="/about" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">About Us</Link>
                                <Link to="/team" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Careers</Link>
                                <Link to="/contact" className="text-slate-400 no-underline hover:text-[#38bdf8] transition-colors">Contact us</Link>
                            </div>
                        </div>


                    </div>
                </div>

                <hr className="mt-8 border-t border-slate-800" />

                <div className="mt-2 flex flex-col gap-2 items-center text-xs text-slate-500 text-center justify-around">
                    <span>Copyright &#169; 2023-{new Date().getFullYear()}</span>
                    <span>All trademarks and copyrights belong to their respective owners.</span>
                </div>
            </footer >
        </div >
    );
};

export default PublicLayout;
