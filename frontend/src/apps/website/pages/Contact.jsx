import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionDivider from '../../../core/components/SectionDivider';
import PageMeta from '../../../core/components/shared/PageMeta';
import client from '../../../core/api/client';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import '../../../core/styles/landing.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');
        
        try {
            await client.post('home/inquiries/', {
                full_name: formData.fullName,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            });
            setStatus('success');
            setFormData({ fullName: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error("Submission failed", error);
            setStatus('error');
            setErrorMessage("Failed to send your message. Please try again later.");
        }
    };

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen transition-colors duration-300">
            <PageMeta title="Contact Us" description="Get in touch with BitGuard. Contact our sales or support team for enterprise IT services and cybersecurity solutions." />
            {/* Dark Tech Hero */}
            <section className="relative py-24 lg:py-32 dark:bg-slate-950 bg-slate-50 overflow-hidden transition-colors duration-300">
                {/* Tech Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full dark:bg-blue-500/10 bg-blue-100 border dark:border-blue-500/20 border-blue-200 text-blue-600 dark:text-blue-300 text-xs font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Get In Touch
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 dark:text-white text-slate-900 tracking-tight transition-colors duration-300">
                        Contact Us
                    </h1>
                    <p className="text-xl dark:text-slate-400 text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed transition-colors duration-300">
                        Ready to transform your business? Our team is here to help you every step of the way.
                    </p>
                </div>
            </section>

            <SectionDivider variant="wave" from="dark" to="light" />

            {/* Main Content */}
            <section className="pb-32 pt-16 relative z-10 dark:bg-slate-900 bg-white transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        {/* Contact Info Panel (2 Cols) */}
                        <div className="lg:col-span-2 dark:bg-slate-900 bg-white dark:text-white text-slate-900 rounded-xl p-10 shadow-xl border dark:border-slate-800 border-slate-200 relative overflow-hidden transition-colors duration-300">
                            <div className="w-full h-96 rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-300 relative group transition-colors duration-300">
                                <iframe
                                    title="BitGuard Headquarters"
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=-87.6375%2C41.8785%2C-87.6275%2C41.8835&layer=mapnik&marker=41.881%2C-87.6325"
                                    className="w-full h-full border-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    loading="lazy"
                                ></iframe>
                                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 text-xs text-slate-300 font-bold">
                                    <i className="bi bi-geo-alt-fill text-blue-400 mr-1"></i> 55 W. Monroe St., Chicago
                                </div>
                            </div>
                            <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-6 block">Contact Info</span>
                            <h2 className="text-3xl font-bold mb-8 tracking-tight">Let's start a conversation</h2>
                            <p className="dark:text-slate-400 text-slate-600 mb-12 leading-relaxed transition-colors duration-300">
                                Whether you have a question about our services, pricing, or need technical support, our team is ready to answer all your questions.
                            </p>

                            <div className="space-y-8">
                                {/* Phone */}
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mr-6 shrink-0 text-blue-500">
                                        <i className="bi bi-telephone-fill text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1 transition-colors duration-300">Phone</h4>
                                        <a href="tel:+13123601900" className="block dark:text-white text-slate-900 hover:text-blue-500 transition-colors text-lg font-bold">(312) 360-1900</a>
                                        <a href="tel:+13124452124" className="block dark:text-slate-400 text-slate-600 hover:text-blue-500 transition-colors text-sm mt-1">Support: (312) 445-2124</a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mr-6 shrink-0 text-indigo-500">
                                        <i className="bi bi-envelope-fill text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1 transition-colors duration-300">Email</h4>
                                        <a href="mailto:info@bitguard.com" className="block dark:text-white text-slate-900 hover:text-indigo-500 transition-colors text-lg font-bold">info@bitguard.com</a>
                                        <a href="mailto:support@bitguard.com" className="block dark:text-slate-400 text-slate-600 hover:text-indigo-500 transition-colors text-sm mt-1">support@bitguard.com</a>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mr-6 shrink-0 text-emerald-500">
                                        <i className="bi bi-geo-alt-fill text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1 transition-colors duration-300">Headquarters</h4>
                                        <p className="dark:text-slate-300 text-slate-700 leading-relaxed font-medium transition-colors duration-300">
                                            55 W. Monroe St.<br />
                                            Suite 1200<br />
                                            Chicago, IL 60603
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 pt-8 border-t dark:border-slate-800 border-slate-200 flex gap-4 transition-colors duration-300">
                                <a href="#" className="w-10 h-10 rounded-full dark:bg-slate-800 bg-slate-100 flex items-center justify-center dark:text-slate-400 text-slate-500 hover:bg-blue-600 hover:text-white transition-all">
                                    <i className="bi bi-linkedin"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full dark:bg-slate-800 bg-slate-100 flex items-center justify-center dark:text-slate-400 text-slate-500 hover:bg-blue-400 hover:text-white transition-all">
                                    <i className="bi bi-twitter"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full dark:bg-slate-800 bg-slate-100 flex items-center justify-center dark:text-slate-400 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all">
                                    <i className="bi bi-facebook"></i>
                                </a>
                            </div>
                        </div>

                        {/* Contact Form (3 Cols) */}
                        <div className="lg:col-span-3 dark:bg-slate-800 bg-white rounded-xl p-8 md:p-12 shadow-lg border dark:border-slate-700 border-slate-200 transition-colors duration-300">
                            <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2 tracking-tight transition-colors duration-300">Send us a message</h3>
                            <p className="dark:text-slate-400 text-slate-500 mb-10 transition-colors duration-300">Fill out the form below and we'll get back to you within 24 hours.</p>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative">
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                            className="peer w-full border-b-2 dark:border-slate-700 border-slate-200 py-3 dark:text-white text-slate-900 focus:border-blue-600 bg-transparent focus:outline-none transition-colors placeholder-transparent"
                                            placeholder="Full Name" id="fullName" required />
                                        <label htmlFor="fullName" className="absolute left-0 -top-3.5 text-sm font-bold dark:text-slate-400 text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-bold">
                                            Full Name
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                                            className="peer w-full border-b-2 dark:border-slate-700 border-slate-200 py-3 dark:text-white text-slate-900 focus:border-blue-600 bg-transparent focus:outline-none transition-colors placeholder-transparent"
                                            placeholder="Email Address" id="email" required />
                                        <label htmlFor="email" className="absolute left-0 -top-3.5 text-sm font-bold dark:text-slate-400 text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-bold">
                                            Email Address
                                        </label>
                                    </div>
                                </div>

                                <div className="relative">
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                                        className="peer w-full border-b-2 dark:border-slate-700 border-slate-200 py-3 dark:text-white text-slate-900 focus:border-blue-600 bg-transparent focus:outline-none transition-colors placeholder-transparent"
                                        placeholder="Subject" id="subject" required />
                                    <label htmlFor="subject" className="absolute left-0 -top-3.5 text-sm font-bold dark:text-slate-400 text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-bold">
                                        Subject
                                    </label>
                                </div>

                                <div className="relative">
                                    <textarea name="message" value={formData.message} onChange={handleChange} rows="4"
                                        className="peer w-full border-b-2 dark:border-slate-700 border-slate-200 py-3 dark:text-white text-slate-900 focus:border-blue-600 bg-transparent focus:outline-none transition-colors placeholder-transparent"
                                        placeholder="Your Message" id="message" required></textarea>
                                    <label htmlFor="message" className="absolute left-0 -top-3.5 text-sm font-bold dark:text-slate-400 text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-bold">
                                        Your Message
                                    </label>
                                </div>

                                <div className="pt-4">
                                    {status === 'success' && (
                                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                            <p className="text-emerald-500 font-medium">Message sent successfully! We will contact you soon.</p>
                                        </div>
                                    )}

                                    {status === 'error' && (
                                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
                                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                            <p className="text-red-500 font-medium">{errorMessage}</p>
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={status === 'submitting'}
                                        className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transform active:scale-[0.98] transition-all uppercase tracking-wider text-sm disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {status === 'submitting' ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                                        ) : 'Send Message'}
                                    </button>
                                    <p className="dark:text-slate-400 text-slate-500 text-sm mt-6">By submitting this form, you agree to our <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <SectionDivider variant="angle" from="light" to="dark" />

            {/* Dark CTA Section */}
            <section className="py-24 dark:bg-slate-950 bg-slate-900 text-white relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Map Placeholder */}
                        <div className="relative h-80 rounded-2xl overflow-hidden bg-slate-800 border dark:border-slate-800 border-slate-700 transition-colors duration-300">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <i className="bi bi-geo-alt-fill text-5xl text-blue-500 mb-4 block"></i>
                                    <span className="text-lg text-slate-300 font-bold uppercase tracking-widest transition-colors duration-300">Chicago, IL</span>
                                    <p className="text-slate-400 text-sm mt-2 transition-colors duration-300">55 W. Monroe St., Suite 1200</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Content */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight transition-colors duration-300">Need Immediate Assistance?</h2>
                            <p className="dark:text-slate-400 text-slate-300 text-lg leading-relaxed mb-8 transition-colors duration-300">
                                Our support engineers are available 24/7/365. For critical incidents, call our emergency hotline directly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a href="tel:+13123601900" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 justify-center no-underline">
                                    <i className="bi bi-telephone-fill"></i> Call (312) 360-1900
                                </a>
                                <a href="#attack" className="px-8 py-4 border border-red-500/50 text-red-400 rounded-xl font-bold hover:bg-red-500/10 transition-all flex items-center gap-2 justify-center no-underline">
                                    <i className="bi bi-exclamation-triangle-fill"></i> Under Attack?
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
