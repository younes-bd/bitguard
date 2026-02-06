import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landing.css';

const Support = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Support ticket submitted! (Mock)');
    };

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
                        Help Center
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight font-[Oswald]">
                        How can we help?
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Access our support tools, manage your account, or get in touch with our technical team.
                    </p>

                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative">
                            <input type="text" placeholder="Search for answers..."
                                className="w-full py-5 pl-14 pr-6 rounded-full bg-slate-900/90 backdrop-blur-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xl transition-all" />
                            <i className="bi bi-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 text-lg"></i>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-20 relative z-20 -mt-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Remote Support */}
                        <div className="group bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
                                <i className="bi bi-display text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 font-[Oswald]">Remote Support</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">Connect with a technician securely for immediate remote assistance with your device.</p>
                            <Link to="/platform/remote" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 tracking-wide uppercase text-sm">
                                Join Session <i className="bi bi-arrow-right ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"></i>
                            </Link>
                        </div>

                        {/* Client Portal */}
                        <div className="group bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                                <i className="bi bi-person-circle text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 font-[Oswald]">Client Portal</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">Manage tickets, view invoices, and track project status from your dedicated dashboard.</p>
                            <Link to="/login" className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700 tracking-wide uppercase text-sm">
                                Log In <i className="bi bi-arrow-right ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"></i>
                            </Link>
                        </div>

                        {/* Submit Ticket */}
                        <div className="group bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:border-emerald-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform duration-300">
                                <i className="bi bi-ticket-detailed text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 font-[Oswald]">Submit a Ticket</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">Experiencing an issue? Submit a new support ticket and our team will respond shortly.</p>
                            <a href="#ticket-form" className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700 tracking-wide uppercase text-sm">
                                Open Ticket <i className="bi bi-arrow-right ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ticket Form Section */}
            <section id="ticket-form" className="py-24 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">

                        {/* Form Context */}
                        <div className="lg:w-1/3">
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Support Request</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-6 font-[Oswald]">Submit a Ticket</h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Please provide as much detail as possible so we can assist you quickly. Our typical response time is under 15 minutes for critical issues.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <i className="bi bi-shield-check"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Secure Submission</h4>
                                        <p className="text-sm text-slate-500">Your data is encrypted and secure.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <i className="bi bi-clock-history"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">24/7 Monitoring</h4>
                                        <p className="text-sm text-slate-500">We monitor critical tickets around the clock.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:w-2/3 w-full">
                            <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                                className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                                placeholder="John Doe" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                                className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                                placeholder="john@company.com" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                                        <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                                            className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            placeholder="Brief summary of the issue" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} rows="5"
                                            className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                            placeholder="Please describe the issue in detail..." required></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transform active:scale-[0.98] transition-all uppercase tracking-wider text-sm">
                                        Submit Ticket
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Direct Contact Section */}
            <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/10"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-2 block">Direct Access</span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 font-[Oswald]">Need to speak with a human?</h2>
                        <p className="text-slate-400 text-lg">Our support team is available 24/7 for critical issues.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <a href="tel:+13124452124" className="group flex items-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 mr-6 group-hover:scale-110 transition-transform">
                                <i className="bi bi-telephone-fill text-2xl"></i>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Call Support</h4>
                                <p className="text-slate-400 text-sm mb-1">Immediate assistance for urgent matters.</p>
                                <span className="text-xl font-bold text-blue-400">(312) 445-2124</span>
                            </div>
                        </a>

                        <a href="mailto:support@bitguard.com" className="group flex items-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 mr-6 group-hover:scale-110 transition-transform">
                                <i className="bi bi-envelope-fill text-2xl"></i>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Email Support</h4>
                                <p className="text-slate-400 text-sm mb-1">For non-urgent inquiries.</p>
                                <span className="text-xl font-bold text-indigo-400">support@bitguard.com</span>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Support;
