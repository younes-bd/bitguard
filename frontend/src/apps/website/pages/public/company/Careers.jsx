import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionDivider from '../../../../../core/components/SectionDivider';
import PageMeta from '../../../../../core/components/shared/PageMeta';

const Careers = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [formStatus, setFormStatus] = useState({ type: null, message: '' });

    const handleApply = (e) => {
        e.preventDefault();
        setFormStatus({ type: 'loading', message: 'Submitting...' });
        setTimeout(() => {
            setFormStatus({ type: 'success', message: 'Application submitted successfully! We will contact you soon.' });
            setTimeout(() => {
                setSelectedJob(null);
                setFormStatus({ type: null, message: '' });
            }, 3000);
        }, 1500);
    };
    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen transition-colors duration-300">
            <PageMeta title="Careers" description="Join the BitGuard team. Explore open positions in cybersecurity, engineering, and IT services." />
            {/* Dark Tech Hero */}
            <section className="relative py-24 lg:py-32 dark:bg-slate-950 bg-slate-50 overflow-hidden transition-colors duration-300">
                {/* Tech Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full dark:bg-blue-500/10 bg-blue-100 border dark:border-blue-500/20 border-blue-200 text-blue-600 dark:text-blue-300 text-xs font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Join Us
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 dark:text-white text-slate-900 tracking-tight transition-colors duration-300">
                        Join Our Mission
                    </h1>
                    <p className="text-xl dark:text-slate-400 text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed transition-colors duration-300">
                        Help us secure the future. We're looking for passionate problem-solvers to join our growing team.
                    </p>
                </div>
            </section>
            
            <SectionDivider variant="gradient" from="dark" to="light" />

            {/* Intro / Culture */}
            <section className="py-24 dark:bg-slate-900 bg-white transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <h2 className="text-4xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">Build the Future of Security</h2>
                        <p className="text-lg dark:text-slate-400 text-slate-600 leading-relaxed transition-colors duration-300">
                            At BitGuard, we tackle the toughest challenges in cybersecurity and digital transformation.
                            We value curiosity, integrity, and the drive to innovate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="dark:bg-slate-800 bg-slate-50 p-8 rounded-2xl border dark:border-slate-700 border-slate-100 text-center dark:hover:border-blue-500 hover:border-blue-200 transition-colors duration-300">
                            <div className="w-16 h-16 mx-auto dark:bg-blue-500/20 bg-blue-100 rounded-full flex items-center justify-center dark:text-blue-400 text-blue-600 mb-6 transition-colors duration-300">
                                <i className="bi bi-laptop text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2 transition-colors duration-300">Remote-First</h3>
                            <p className="dark:text-slate-400 text-slate-500 transition-colors duration-300">Work from anywhere. We believe in output, not hours in a chair.</p>
                        </div>
                        <div className="dark:bg-slate-800 bg-slate-50 p-8 rounded-2xl border dark:border-slate-700 border-slate-100 text-center dark:hover:border-indigo-500 hover:border-indigo-200 transition-colors duration-300">
                            <div className="w-16 h-16 mx-auto dark:bg-indigo-500/20 bg-indigo-100 rounded-full flex items-center justify-center dark:text-indigo-400 text-indigo-600 mb-6 transition-colors duration-300">
                                <i className="bi bi-heart-pulse text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2 transition-colors duration-300">Health & Wellness</h3>
                            <p className="dark:text-slate-400 text-slate-500 transition-colors duration-300">100% employer-paid health, dental, and vision insurance for you and dependents.</p>
                        </div>
                        <div className="dark:bg-slate-800 bg-slate-50 p-8 rounded-2xl border dark:border-slate-700 border-slate-100 text-center dark:hover:border-emerald-500 hover:border-emerald-200 transition-colors duration-300">
                            <div className="w-16 h-16 mx-auto dark:bg-emerald-500/20 bg-emerald-100 rounded-full flex items-center justify-center dark:text-emerald-400 text-emerald-600 mb-6 transition-colors duration-300">
                                <i className="bi bi-graph-up-arrow text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2 transition-colors duration-300">Continuous Growth</h3>
                            <p className="dark:text-slate-400 text-slate-500 transition-colors duration-300">$2,500 annual learning budget, plus fully-paid industry certifications.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="angle" from="light" to="dark" />

            {/* Employee Testimonials */}
            <section className="py-24 dark:bg-slate-900 bg-white transition-colors duration-300 border-t dark:border-slate-800 border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 block">Our People</span>
                        <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 tracking-tight transition-colors duration-300">Life at BitGuard</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="dark:bg-slate-800 bg-slate-50 p-8 rounded-2xl border dark:border-slate-700 border-slate-100 shadow-sm relative">
                            <i className="bi bi-quote absolute top-4 right-6 text-6xl dark:text-slate-700 text-slate-200"></i>
                            <p className="dark:text-slate-300 text-slate-700 leading-relaxed mb-6 italic relative z-10">"I've never worked at a company that invests so much in its employees' growth. The continuous learning budget allowed me to get my AWS Security Specialty cert within my first six months."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">D</div>
                                <div>
                                    <h4 className="font-bold dark:text-white text-slate-900">David Chen</h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Security Engineer</p>
                                </div>
                            </div>
                        </div>
                        <div className="dark:bg-slate-800 bg-slate-50 p-8 rounded-2xl border dark:border-slate-700 border-slate-100 shadow-sm relative">
                            <i className="bi bi-quote absolute top-4 right-6 text-6xl dark:text-slate-700 text-slate-200"></i>
                            <p className="dark:text-slate-300 text-slate-700 leading-relaxed mb-6 italic relative z-10">"The remote-first culture is incredible. I have the flexibility to balance my family life while still tackling challenging, enterprise-level infrastructure projects with a brilliant team."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">A</div>
                                <div>
                                    <h4 className="font-bold dark:text-white text-slate-900">Amanda Foster</h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Cloud Architect</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="angle" from="light" to="dark" />

            {/* Job Listings */}
            <section className="py-24 dark:bg-slate-950 bg-slate-900 text-white relative transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-900 to-transparent"></div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-2 block">Open Roles</span>
                            <h2 className="text-4xl font-bold tracking-tight">Current Openings</h2>
                        </div>
                        <Link to="/contact" className="hidden md:inline-block text-slate-400 hover:text-white transition-colors">
                            View all positions <i className="bi bi-arrow-right ml-2"></i>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {/* Job Card 1 */}
                        <div className="group dark:bg-slate-800/50 bg-slate-800/80 dark:hover:bg-slate-800 hover:bg-slate-800 border dark:border-slate-700 border-slate-700 hover:border-blue-500 p-8 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Cybersecurity</span>
                                    <span className="dark:bg-slate-700 bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">Remote</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Senior Incident Responder</h3>
                                <p className="text-slate-300 dark:text-slate-400 transition-colors duration-300">Lead high-stakes incident response engagements and manage advanced threat hunting operations.</p>
                            </div>
                            <button onClick={() => setSelectedJob('Senior Incident Responder')} className="w-full md:w-auto px-8 py-3 dark:bg-slate-700 bg-white dark:text-white text-slate-900 font-bold rounded-lg dark:hover:bg-blue-600 hover:bg-blue-50 transition-colors text-center duration-300 no-underline border-none cursor-pointer">
                                Apply Now
                            </button>
                        </div>

                        {/* Job Card 2 */}
                        <div className="group dark:bg-slate-800/50 bg-slate-800/80 dark:hover:bg-slate-800 hover:bg-slate-800 border dark:border-slate-700 border-slate-700 hover:border-indigo-500 p-8 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Engineering</span>
                                    <span className="dark:bg-slate-700 bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">Chicago, IL (Hybrid)</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Cloud Security Architect</h3>
                                <p className="text-slate-300 dark:text-slate-400 transition-colors duration-300">Design secure, compliant AWS and Azure cloud architectures for enterprise clients.</p>
                            </div>
                            <button onClick={() => setSelectedJob('Cloud Security Architect')} className="w-full md:w-auto px-8 py-3 dark:bg-slate-700 bg-white dark:text-white text-slate-900 font-bold rounded-lg dark:hover:bg-indigo-600 hover:bg-indigo-50 transition-colors text-center duration-300 no-underline border-none cursor-pointer">
                                Apply Now
                            </button>
                        </div>

                        {/* Job Card 3 */}
                        <div className="group dark:bg-slate-800/50 bg-slate-800/80 dark:hover:bg-slate-800 hover:bg-slate-800 border dark:border-slate-700 border-slate-700 hover:border-emerald-500 p-8 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-emerald-600/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Managed Services</span>
                                    <span className="dark:bg-slate-700 bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">Remote</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">L3 Systems Administrator</h3>
                                <p className="text-slate-300 dark:text-slate-400 transition-colors duration-300">Provide advanced escalation support, patch management, and infrastructure maintenance.</p>
                            </div>
                            <button onClick={() => setSelectedJob('L3 Systems Administrator')} className="w-full md:w-auto px-8 py-3 dark:bg-slate-700 bg-white dark:text-white text-slate-900 font-bold rounded-lg dark:hover:bg-emerald-600 hover:bg-emerald-50 transition-colors text-center duration-300 no-underline border-none cursor-pointer">
                                Apply Now
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/contact" className="text-slate-400 hover:text-white transition-colors font-bold">
                            View all positions <i className="bi bi-arrow-right ml-2"></i>
                        </Link>
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="wave" from="dark" to="light" />

            {/* Light CTA Section */}
            <section className="py-24 dark:bg-slate-900 bg-white transition-colors duration-300">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">Don't See Your Role?</h2>
                    <p className="dark:text-slate-400 text-slate-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed transition-colors duration-300">
                        We're always looking for exceptional talent. Send us your resume and we'll reach out when the right opportunity opens up.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 no-underline flex items-center gap-2 justify-center">
                            <i className="bi bi-envelope-fill"></i> Send Your Resume
                        </Link>
                        <Link to="/about" className="px-8 py-4 border-2 dark:border-slate-700 border-slate-900 dark:text-slate-300 text-slate-900 rounded-xl font-bold dark:hover:bg-slate-800 dark:hover:text-white hover:bg-slate-900 hover:text-white transition-all no-underline flex items-center gap-2 justify-center duration-300">
                            Learn About Our Culture
                        </Link>
                    </div>
                </div>
            </section>

            {/* Job Application Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-6 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Applying for</div>
                                <h3 className="text-xl font-bold dark:text-white text-slate-900">{selectedJob}</h3>
                            </div>
                            <button onClick={() => setSelectedJob(null)} className="w-10 h-10 rounded-full dark:bg-slate-800 bg-slate-100 flex items-center justify-center dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors border-none cursor-pointer">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="p-6">
                            {formStatus.type === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-3xl mx-auto mb-4">
                                        <i className="bi bi-check-lg"></i>
                                    </div>
                                    <h4 className="text-xl font-bold dark:text-white text-slate-900 mb-2">Application Received</h4>
                                    <p className="dark:text-slate-400 text-slate-600">{formStatus.message}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleApply} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold dark:text-slate-300 text-slate-700 mb-1">First Name</label>
                                            <input type="text" required className="w-full px-4 py-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-800 dark:text-white border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold dark:text-slate-300 text-slate-700 mb-1">Last Name</label>
                                            <input type="text" required className="w-full px-4 py-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-800 dark:text-white border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold dark:text-slate-300 text-slate-700 mb-1">Email</label>
                                        <input type="email" required className="w-full px-4 py-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-800 dark:text-white border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold dark:text-slate-300 text-slate-700 mb-1">LinkedIn Profile</label>
                                        <input type="url" className="w-full px-4 py-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-800 dark:text-white border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold dark:text-slate-300 text-slate-700 mb-1">Resume / Cover Letter</label>
                                        <textarea rows="4" required placeholder="Tell us why you're a great fit..." className="w-full px-4 py-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-800 dark:text-white border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
                                    </div>
                                    <button type="submit" disabled={formStatus.type === 'loading'} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-600/20 mt-4 border-none cursor-pointer disabled:opacity-70">
                                        {formStatus.type === 'loading' ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Careers;

