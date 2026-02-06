import React from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Dark Tech Hero */}
            <section className="relative py-24 lg:py-32 bg-slate-950 overflow-hidden">
                {/* Tech Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-sm">
                        Join Us
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight font-[Oswald]">
                        Join Our Mission
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Help us secure the future. We're looking for passionate problem-solvers to join our growing team.
                    </p>
                </div>
            </section>

            {/* Intro / Culture */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 font-[Oswald]">Build the Future of Security</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            At BitGuard, we tackle the toughest challenges in cybersecurity and digital transformation.
                            We value curiosity, integrity, and the drive to innovate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:border-blue-200 transition-colors">
                            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                                <i className="bi bi-laptop text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Remote-First</h3>
                            <p className="text-slate-500">Work from anywhere. We believe in output, not hours in a chair.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:border-indigo-200 transition-colors">
                            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                                <i className="bi bi-heart-pulse text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Health & Wellness</h3>
                            <p className="text-slate-500">Comprehensive health coverage and wellness stipends for you and your family.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:border-emerald-200 transition-colors">
                            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                <i className="bi bi-graph-up-arrow text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Growth</h3>
                            <p className="text-slate-500">Annual learning budget and mentorship programs to help you level up.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-24 bg-slate-950 text-white relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-900 to-transparent"></div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-2 block">Open Roles</span>
                            <h2 className="text-4xl font-bold font-[Oswald]">Current Openings</h2>
                        </div>
                        <Link to="/contact" className="hidden md:inline-block text-slate-400 hover:text-white transition-colors">
                            View all positions <i className="bi bi-arrow-right ml-2"></i>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {/* Job Card 1 */}
                        <div className="group bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-blue-600/50 p-8 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Engineering</span>
                                    <span className="bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Remote</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Senior Security Analyst</h3>
                                <p className="text-slate-400">Lead our threat detection team and build next-gen security tools.</p>
                            </div>
                            <Link to="/contact" className="w-full md:w-auto px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-blue-50 transition-colors text-center">
                                Apply Now
                            </Link>
                        </div>

                        {/* Job Card 2 */}
                        <div className="group bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-indigo-600/50 p-8 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Product</span>
                                    <span className="bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">New York, NY</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Solutions Architect</h3>
                                <p className="text-slate-400">Design scalable cloud infrastructure for our enterprise clients.</p>
                            </div>
                            <Link to="/contact" className="w-full md:w-auto px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors text-center">
                                Apply Now
                            </Link>
                        </div>

                        {/* Job Card 3 */}
                        <div className="group bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-emerald-600/50 p-8 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-emerald-600/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Development</span>
                                    <span className="bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Remote</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Frontend Developer</h3>
                                <p className="text-slate-400">Build beautiful, responsive interfaces using React and Tailwind.</p>
                            </div>
                            <Link to="/contact" className="w-full md:w-auto px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-emerald-50 transition-colors text-center">
                                Apply Now
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/contact" className="text-slate-400 hover:text-white transition-colors font-bold">
                            View all positions <i className="bi bi-arrow-right ml-2"></i>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
