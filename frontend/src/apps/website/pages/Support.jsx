import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../core/styles/landing.css';
import SectionDivider from '../../../core/components/SectionDivider';
import PageMeta from '../../../core/components/shared/PageMeta';
import client from '../../../core/api/client';
import { useAuth } from '../../../core/hooks/useAuth';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Support = () => {
    const { isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        priority: 'medium',
        message: ''
    });
    
    // Asynchronous state management for CRM API logic
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'
    const [submitMessage, setSubmitMessage] = useState('');
    const [ticketId, setTicketId] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        setSubmitMessage('');
        
        try {
            const payload = {
                full_name: formData.fullName,
                email: formData.email,
                subject: formData.subject,
                priority: formData.priority,
                message: formData.message
            };
            
            const response = await client.post('home/support/ticket/', payload);
            
            setSubmitStatus('success');
            setTicketId(response.data.ticket_id);
            setSubmitMessage('Your ticket has been securely submitted to our CRM systems.');
            setFormData({ fullName: '', email: '', subject: '', priority: 'medium', message: '' });
        } catch (error) {
            console.error('Ticket submission failed:', error);
            setSubmitStatus('error');
            setSubmitMessage(
                error.response?.data?.error || 
                'An unexpected error occurred while submitting your ticket. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // FAQ data for search functionality
    const faqItems = [
        { q: 'How do I reset my password?', a: 'Go to the login page and click "Forgot Password" to receive a reset link.' },
        { q: 'How do I submit a support ticket?', a: 'Scroll down to the ticket form below, or call our support line directly.' },
        { q: 'What is your response time?', a: 'Our SLA guarantees a response within 15 minutes for critical issues.' },
        { q: 'How do I join a remote session?', a: 'Click "Remote Support" above to enter your 6-digit session PIN.' },
        { q: 'How do I access the client portal?', a: 'Click "Client Portal" above to log in and manage your account.' },
        { q: 'What are your support hours?', a: 'Our support team is available 24/7/365 for critical issues.' },
    ];

    const filteredFaq = searchQuery.length > 1
        ? faqItems.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen transition-colors duration-300">
            <PageMeta title="Support" description="Get help from BitGuard's support team. Submit tickets, join remote sessions, and access our knowledge base." />
            {/* Dark Tech Hero */}
            <section className="relative py-24 lg:py-32 dark:bg-slate-950 bg-slate-950 overflow-hidden transition-colors duration-300">
                {/* Tech Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full dark:bg-blue-500/10 bg-blue-100 border dark:border-blue-500/20 border-blue-200 text-blue-600 dark:text-blue-300 text-xs font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Help Center
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                        How can we help?
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Access our support tools, manage your account, or get in touch with our technical team.
                    </p>

                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative">
                            <input type="text" placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-5 pl-14 pr-6 rounded-full bg-slate-900/90 backdrop-blur-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xl transition-all" />
                            <i className="bi bi-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 text-lg"></i>
                        </div>
                        {/* Search Results Dropdown */}
                        {filteredFaq.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-30">
                                {filteredFaq.map((f, idx) => (
                                    <div key={idx} className="p-4 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/50 transition-colors cursor-pointer">
                                        <h4 className="text-white font-bold text-sm mb-1">{f.q}</h4>
                                        <p className="text-slate-400 text-xs">{f.a}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {searchQuery.length > 1 && filteredFaq.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 text-center z-30">
                                <p className="text-slate-400 text-sm">No results found. Try submitting a ticket below.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-20 relative z-20 -mt-20 dark:bg-transparent bg-transparent">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Remote Support */}
                        <div className="group dark:bg-slate-800 bg-white p-8 rounded-2xl shadow-xl border dark:border-slate-700 border-slate-100 dark:hover:border-blue-500 hover:border-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
                                <i className="bi bi-display text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-3 tracking-tight transition-colors duration-300">Remote Support</h3>
                            <p className="dark:text-slate-400 text-slate-600 mb-6 leading-relaxed transition-colors duration-300">Connect with a technician securely for immediate remote assistance with your device.</p>
                            <Link to="/support/remote" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 tracking-wide uppercase text-sm">
                                Join Session <i className="bi bi-arrow-right ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"></i>
                            </Link>
                        </div>

                        {/* Client Portal */}
                        <div className="group dark:bg-slate-800 bg-white p-8 rounded-2xl shadow-xl border dark:border-slate-700 border-slate-100 dark:hover:border-indigo-500 hover:border-indigo-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                                <i className="bi bi-person-circle text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-3 tracking-tight transition-colors duration-300">Client Portal</h3>
                            <p className="dark:text-slate-400 text-slate-600 mb-6 leading-relaxed transition-colors duration-300">Manage tickets, view invoices, and track project status from your dedicated dashboard.</p>
                            <Link to={isAuthenticated ? '/portal' : '/login'} className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700 tracking-wide uppercase text-sm">
                                {isAuthenticated ? 'Go to Portal' : 'Log In'} <i className="bi bi-arrow-right ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"></i>
                            </Link>
                        </div>

                        {/* Submit Ticket */}
                        <div className="group dark:bg-slate-800 bg-white p-8 rounded-2xl shadow-xl border dark:border-slate-700 border-slate-100 dark:hover:border-emerald-500 hover:border-emerald-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform duration-300">
                                <i className="bi bi-ticket-detailed text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-3 tracking-tight transition-colors duration-300">Submit a Ticket</h3>
                            <p className="dark:text-slate-400 text-slate-600 mb-6 leading-relaxed transition-colors duration-300">Experiencing an issue? Submit a new support ticket and our team will respond shortly.</p>
                            <a href="#ticket-form" className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700 tracking-wide uppercase text-sm">
                                Open Ticket <i className="bi bi-arrow-right ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ticket Form Section */}
            <section id="ticket-form" className="py-24 dark:bg-slate-900 bg-white border-t dark:border-slate-800 border-slate-100 transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">

                        {/* Form Context */}
                        <div className="lg:w-1/3">
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Support Request</span>
                            <h2 className="text-4xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">Submit a Ticket</h2>
                            <p className="dark:text-slate-400 text-slate-600 mb-8 leading-relaxed transition-colors duration-300">
                                Please provide as much detail as possible so we can assist you quickly. Our typical response time is under 15 minutes for critical issues.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full dark:bg-blue-600/10 bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <i className="bi bi-shield-check"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold dark:text-white text-slate-900 transition-colors duration-300">Secure Submission</h4>
                                        <p className="text-sm dark:text-slate-400 text-slate-500 transition-colors duration-300">Your data is encrypted and secure.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full dark:bg-blue-600/10 bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <i className="bi bi-clock-history"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold dark:text-white text-slate-900 transition-colors duration-300">24/7 Monitoring</h4>
                                        <p className="text-sm dark:text-slate-400 text-slate-500 transition-colors duration-300">We monitor critical tickets around the clock.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:w-2/3 w-full">
                            <div className="dark:bg-slate-800 bg-slate-50 p-8 md:p-10 rounded-xl border dark:border-slate-700 border-slate-100 shadow-sm transition-colors duration-300">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Success Banner */}
                                    {submitStatus === 'success' && (
                                        <div className="p-6 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">Ticket Submitted Securely</h3>
                                            <p className="dark:text-slate-400 text-slate-600 mb-5">{submitMessage}</p>
                                            {ticketId && (
                                                <div className="px-5 py-2.5 bg-slate-900 dark:bg-slate-950 rounded-xl border border-slate-700/50 font-mono text-sm text-blue-400 font-bold block shadow-inner">
                                                    Ticket Ref: #{ticketId}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Error Banner */}
                                    {submitStatus === 'error' && (
                                        <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-red-500 mb-1">Submission Failed</h4>
                                                <p className="text-sm dark:text-red-400 text-red-600">{submitMessage}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={isSubmitting}
                                                className="w-full p-4 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-600 border-slate-200 dark:text-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50"
                                                placeholder="John Doe" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting}
                                                className="w-full p-4 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-600 border-slate-200 dark:text-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50"
                                                placeholder="john@company.com" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} disabled={isSubmitting}
                                            className="w-full p-4 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-600 border-slate-200 dark:text-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50"
                                            placeholder="Brief summary of the issue" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                                        <select name="priority" value={formData.priority} onChange={handleChange} disabled={isSubmitting}
                                            className="w-full p-4 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-600 border-slate-200 dark:text-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50">
                                            <option value="low">Low — General question</option>
                                            <option value="medium">Medium — Issue affecting work</option>
                                            <option value="high">High — Service degraded</option>
                                            <option value="critical">Critical — Service down</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} rows="5" disabled={isSubmitting}
                                            className="w-full p-4 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-600 border-slate-200 dark:text-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none disabled:opacity-50"
                                            placeholder="Please describe the issue in detail..." required></textarea>
                                    </div>
                                    
                                    {/* Submit Action or Complete Status */}
                                    {!submitStatus || submitStatus === 'error' ? (
                                        <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transform active:scale-[0.98] transition-all uppercase tracking-wider text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                                    Transmitting Payload...
                                                </>
                                            ) : (
                                                'Submit Ticket'
                                            )}
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => setSubmitStatus(null)} className="w-full py-4 dark:bg-slate-700 bg-slate-200 dark:hover:bg-slate-600 hover:bg-slate-300 dark:text-white text-slate-900 font-bold rounded-xl transition-all uppercase tracking-wider text-sm">
                                            Submit Another Ticket
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="angle" from="light" to="dark" />

            {/* Direct Contact Section */}
            <section className="py-24 dark:bg-slate-950 bg-slate-950 text-white relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-blue-900/10"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-2 block">Direct Access</span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Need to speak with a human?</h2>
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
