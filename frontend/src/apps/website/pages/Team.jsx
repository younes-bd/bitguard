import React from 'react';
import SectionDivider from '../../../core/components/SectionDivider';

const Team = () => {
    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen transition-colors duration-300">
            {/* Dark Tech Hero */}
            <section className="relative py-24 lg:py-32 dark:bg-slate-950 bg-slate-50 overflow-hidden transition-colors duration-300">
                {/* Tech Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full dark:bg-blue-500/10 bg-blue-100 border dark:border-blue-500/20 border-blue-200 text-blue-600 dark:text-blue-300 text-xs font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-300">
                        Our Experts
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 dark:text-white text-slate-900 tracking-tight transition-colors duration-300">
                        Meet The Team
                    </h1>
                    <p className="text-xl dark:text-slate-400 text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed transition-colors duration-300">
                        The experts behind your security. We are a diverse group of engineers, analysts, and strategists dedicated to protecting your business.
                    </p>
                </div>
            </section>
            
            <SectionDivider variant="wave" from="dark" to="light" />

            {/* Team Grid */}
            <section className="py-24 dark:bg-slate-900 bg-white relative z-10 -mt-20 rounded-t-[3rem] border-t dark:border-slate-800 border-white/10 transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* Member 1 */}
                        <div className="group relative dark:bg-slate-800 bg-white rounded-2xl overflow-hidden shadow-xl border dark:border-slate-700 border-slate-100 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-500">
                            <div className="h-80 dark:bg-slate-900 bg-slate-100 relative overflow-hidden transition-colors duration-300">
                                {/* Placeholder Image Pattern */}
                                <div className="absolute inset-0 dark:bg-slate-900 bg-slate-200 transition-colors duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 dark:from-slate-800 to-transparent opacity-50"></div>
                                    <div className="w-full h-full flex items-center justify-center dark:text-slate-700 text-slate-400 transition-colors duration-300">
                                        <i className="bi bi-person-fill text-9xl transform translate-y-4 group-hover:scale-110 transition-transform duration-700"></i>
                                    </div>
                                </div>
                                {/* Tech Overlay */}
                                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                                    <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-500 hover:text-white transition-colors shadow-lg">
                                            <i className="bi bi-linkedin text-xl"></i>
                                        </a>
                                        <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-sky-400 hover:bg-sky-500 hover:text-white transition-colors shadow-lg">
                                            <i className="bi bi-twitter text-xl"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 relative">
                                <div className="absolute -top-6 right-8 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                    <i className="bi bi-shield-check text-xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-1 tracking-tight transition-colors duration-300">John Smith</h3>
                                <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">CEO & Founder</p>
                                <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-sm transition-colors duration-300">
                                    Visionary leader with 20+ years of experience in cybersecurity and managed IT services. Prior NSA consultant.
                                </p>
                            </div>
                        </div>

                        {/* Member 2 */}
                        <div className="group relative dark:bg-slate-800 bg-white rounded-2xl overflow-hidden shadow-xl border dark:border-slate-700 border-slate-100 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-2xl transition-all duration-500">
                            <div className="h-80 dark:bg-slate-900 bg-slate-100 relative overflow-hidden transition-colors duration-300">
                                <div className="absolute inset-0 dark:bg-slate-900 bg-slate-200 transition-colors duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 dark:from-slate-800 to-transparent opacity-50"></div>
                                    <div className="w-full h-full flex items-center justify-center dark:text-slate-700 text-slate-400 transition-colors duration-300">
                                        <i className="bi bi-person-fill text-9xl transform translate-y-4 group-hover:scale-110 transition-transform duration-700"></i>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                                    <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-500 hover:text-white transition-colors shadow-lg">
                                            <i className="bi bi-linkedin text-xl"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 relative">
                                <div className="absolute -top-6 right-8 w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                    <i className="bi bi-cpu text-xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-1 tracking-tight transition-colors duration-300">Jane Doe</h3>
                                <p className="text-indigo-500 font-bold uppercase tracking-widest text-xs mb-4">CTO</p>
                                <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-sm transition-colors duration-300">
                                    Expert in cloud architecture and secure infrastructure design. Master of AWS and Azure environments.
                                </p>
                            </div>
                        </div>

                        {/* Member 3 */}
                        <div className="group relative dark:bg-slate-800 bg-white rounded-2xl overflow-hidden shadow-xl border dark:border-slate-700 border-slate-100 hover:border-emerald-200 dark:hover:border-emerald-500 hover:shadow-2xl transition-all duration-500">
                            <div className="h-80 dark:bg-slate-900 bg-slate-100 relative overflow-hidden transition-colors duration-300">
                                <div className="absolute inset-0 dark:bg-slate-900 bg-slate-200 transition-colors duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 dark:from-slate-800 to-transparent opacity-50"></div>
                                    <div className="w-full h-full flex items-center justify-center dark:text-slate-700 text-slate-400 transition-colors duration-300">
                                        <i className="bi bi-person-fill text-9xl transform translate-y-4 group-hover:scale-110 transition-transform duration-700"></i>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                                    <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-500 hover:text-white transition-colors shadow-lg">
                                            <i className="bi bi-linkedin text-xl"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 relative">
                                <div className="absolute -top-6 right-8 w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                    <i className="bi bi-eye text-xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-1 tracking-tight transition-colors duration-300">Mike Johnson</h3>
                                <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4">Head of SOC</p>
                                <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-sm transition-colors duration-300">
                                    Leads our SOC team, ensuring 24/7 monitoring and rapid incident response. Certified CISSP.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="angle" from="light" to="dark" />

            {/* Dark CTA Section */}
            <section className="py-24 dark:bg-slate-950 bg-slate-900 text-white text-center relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight transition-colors duration-300">Want to Join This Team?</h2>
                    <p className="dark:text-slate-400 text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed transition-colors duration-300">
                        We're always looking for passionate, talented people who want to make an impact in cybersecurity and enterprise IT.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/careers" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 no-underline flex items-center gap-2 justify-center">
                            <i className="bi bi-briefcase-fill"></i> View Open Positions
                        </a>
                        <a href="/about" className="px-8 py-4 border border-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-800 transition-all no-underline flex items-center gap-2 justify-center">
                            Learn About BitGuard
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Team;
