import React, { useState } from 'react';
import '../../styles/landing.css';

const Contact = () => {
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
        // Handle form submission logic here
        alert('Message sent! (Mock implementation)');
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
                        Get In Touch
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight font-[Oswald]">
                        Contact Us
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Ready to transform your business? Our team is here to help you every step of the way.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 relative z-10 -mt-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        {/* Contact Info Panel (2 Cols) */}
                        <div className="lg:col-span-2 bg-slate-900 text-white rounded-3xl p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-16 -mt-16"></div>

                            <div className="relative z-10">
                                <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-6 block">Contact Info</span>
                                <h2 className="text-3xl font-bold mb-8 font-[Oswald]">Let's start a conversation</h2>
                                <p className="text-slate-400 mb-12 leading-relaxed">
                                    Whether you have a question about our services, pricing, or need technical support, our team is ready to answer all your questions.
                                </p>

                                <div className="space-y-8">
                                    {/* Phone */}
                                    <div className="flex items-start">
                                        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mr-6 shrink-0 text-blue-500">
                                            <i className="bi bi-telephone-fill text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-1">Phone</h4>
                                            <a href="tel:+13123601900" className="block text-white hover:text-blue-400 transition-colors text-lg font-bold">(312) 360-1900</a>
                                            <a href="tel:+13124452124" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm mt-1">Support: (312) 445-2124</a>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start">
                                        <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mr-6 shrink-0 text-indigo-500">
                                            <i className="bi bi-envelope-fill text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-1">Email</h4>
                                            <a href="mailto:info@bitguard.com" className="block text-white hover:text-indigo-400 transition-colors text-lg font-bold">info@bitguard.com</a>
                                            <a href="mailto:support@bitguard.com" className="block text-slate-400 hover:text-indigo-400 transition-colors text-sm mt-1">support@bitguard.com</a>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start">
                                        <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mr-6 shrink-0 text-emerald-500">
                                            <i className="bi bi-geo-alt-fill text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-1">Headquarters</h4>
                                            <p className="text-slate-300 leading-relaxed font-medium">
                                                55 W. Monroe St.<br />
                                                Suite 1200<br />
                                                Chicago, IL 60603
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-16 pt-8 border-t border-slate-800 flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                                        <i className="bi bi-linkedin"></i>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-400 hover:text-white transition-all">
                                        <i className="bi bi-twitter"></i>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                                        <i className="bi bi-facebook"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form (3 Cols) */}
                        <div className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-[Oswald]">Send us a message</h3>
                            <p className="text-slate-500 mb-10">Fill out the form below and we'll get back to you within 24 hours.</p>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative">
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                            className="peer w-full border-b-2 border-slate-200 py-3 text-slate-900 focus:border-blue-600 focus:outline-none transition-colors placeholder-transparent"
                                            placeholder="Full Name" id="fullName" required />
                                        <label htmlFor="fullName" className="absolute left-0 -top-3.5 text-sm font-bold text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-bold">
                                            Full Name
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                                            className="peer w-full border-b-2 border-slate-200 py-3 text-slate-900 focus:border-blue-600 focus:outline-none transition-colors placeholder-transparent"
                                            placeholder="Email Address" id="email" required />
                                        <label htmlFor="email" className="absolute left-0 -top-3.5 text-sm font-bold text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-bold">
                                            Email Address
                                        </label>
                                    </div>
                                </div>

                                <div className="relative">
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                                        className="peer w-full border-b-2 border-slate-200 py-3 text-slate-900 focus:border-blue-600 focus:outline-none transition-colors placeholder-transparent"
                                        placeholder="Subject" id="subject" required />
                                    <label htmlFor="subject" className="absolute left-0 -top-3.5 text-sm font-bold text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-bold">
                                        Subject
                                    </label>
                                </div>

                                <div className="relative">
                                    <textarea name="message" value={formData.message} onChange={handleChange} rows="4"
                                        className="peer w-full border-b-2 border-slate-200 py-3 text-slate-900 focus:border-blue-600 focus:outline-none transition-colors placeholder-transparent resize-none"
                                        placeholder="Message" id="message" required></textarea>
                                    <label htmlFor="message" className="absolute left-0 -top-3.5 text-sm font-bold text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:font-bold">
                                        Message
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transform active:scale-[0.98] transition-all uppercase tracking-wider text-sm">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="h-96 bg-slate-200 relative overflow-hidden border-t border-slate-300">
                <div className="absolute inset-0 text-center flex items-center justify-center bg-slate-100 pattern-grid-lg text-slate-400/50">
                    <div className="text-center">
                        <i className="bi bi-map-fill text-6xl text-slate-300 mb-4 block"></i>
                        <span className="text-xl text-slate-400 font-bold uppercase tracking-widest">Interactive Map Location</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
