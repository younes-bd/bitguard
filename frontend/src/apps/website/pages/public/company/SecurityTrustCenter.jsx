import React, { useState } from 'react';
import SectionDivider from '../../../../../core/components/SectionDivider';
import PageMeta from '../../../../../core/components/shared/PageMeta';

const SecurityTrustCenter = () => {
    const [showSocForm, setShowSocForm] = useState(false);
    const [formStatus, setFormStatus] = useState({ type: null, message: '' });

    const handleDownload = (e) => {
        e.preventDefault();
        setFormStatus({ type: 'loading', message: 'Verifying details...' });
        setTimeout(() => {
            setFormStatus({ type: 'success', message: 'Report unlocked. Download will begin shortly.' });
            setTimeout(() => {
                setShowSocForm(false);
                setFormStatus({ type: null, message: '' });
                // Simulate download
                const link = document.createElement('a');
                link.href = '#';
                link.download = 'BitGuard_SOC2_TypeII_Report.pdf';
                link.click();
            }, 2000);
        }, 1500);
    };
    return (
        <>
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen pt-32 pb-20 transition-colors duration-300">
            <PageMeta title="Security & Trust Center" description="BitGuard maintains the highest levels of enterprise security, compliance, and data privacy." />
            
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Trust & Compliance</span>
                    <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                        Security Trust Center
                    </h1>
                    <p className="dark:text-slate-400 text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
                        Transparency is at the core of our operations. Review our certifications, privacy practices, and compliance standards.
                    </p>
                </div>

                {/* Certifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="dark:bg-slate-900 bg-white p-8 rounded-2xl border dark:border-slate-800 border-slate-200 shadow-sm flex items-start gap-6 transition-colors duration-300">
                        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                            <i className="bi bi-shield-check text-3xl"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">SOC 2 Type II</h3>
                            <p className="dark:text-slate-400 text-slate-600 mb-4 text-sm leading-relaxed">BitGuard is independently audited annually to ensure strict security, availability, and confidentiality controls.</p>
                            <button onClick={() => setShowSocForm(true)} className="text-sm font-bold text-blue-500 hover:text-blue-400 bg-transparent border-none cursor-pointer p-0">Request Audit Report <i className="bi bi-arrow-right"></i></button>
                        </div>
                    </div>
                    
                    <div className="dark:bg-slate-900 bg-white p-8 rounded-2xl border dark:border-slate-800 border-slate-200 shadow-sm flex items-start gap-6 transition-colors duration-300">
                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                            <i className="bi bi-file-earmark-lock text-3xl"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">ISO/IEC 27001</h3>
                            <p className="dark:text-slate-400 text-slate-600 mb-4 text-sm leading-relaxed">Our Information Security Management System (ISMS) is certified by accredited third parties to global standards.</p>
                            <a href="/contact" className="text-sm font-bold text-emerald-500 hover:text-emerald-400">View Certificate <i className="bi bi-arrow-right"></i></a>
                        </div>
                    </div>

                    <div className="dark:bg-slate-900 bg-white p-8 rounded-2xl border dark:border-slate-800 border-slate-200 shadow-sm flex items-start gap-6 transition-colors duration-300">
                        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                            <i className="bi bi-hospital text-3xl"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">HIPAA Compliant</h3>
                            <p className="dark:text-slate-400 text-slate-600 mb-4 text-sm leading-relaxed">We sign BAAs with healthcare clients and maintain end-to-end encryption for all ePHI data handling.</p>
                            <a href="/contact" className="text-sm font-bold text-rose-500 hover:text-rose-400">Request BAA <i className="bi bi-arrow-right"></i></a>
                        </div>
                    </div>

                    <div className="dark:bg-slate-900 bg-white p-8 rounded-2xl border dark:border-slate-800 border-slate-200 shadow-sm flex items-start gap-6 transition-colors duration-300">
                        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                            <i className="bi bi-globe-americas text-3xl"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">GDPR & CCPA</h3>
                            <p className="dark:text-slate-400 text-slate-600 mb-4 text-sm leading-relaxed">BitGuard adheres strictly to global data privacy laws, offering automated data residency and subject access requests.</p>
                            <a href="/privacy" className="text-sm font-bold text-indigo-500 hover:text-indigo-400">View Privacy Policy <i className="bi bi-arrow-right"></i></a>
                        </div>
                    </div>
                </div>

                <div className="dark:bg-slate-900 bg-white p-10 rounded-3xl border dark:border-slate-800 border-slate-200 shadow-sm mb-16 transition-colors duration-300">
                    <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-6 border-b dark:border-slate-800 border-slate-100 pb-4">Penetration Testing & Vulnerability Management</h2>
                    <p className="dark:text-slate-400 text-slate-600 mb-6 leading-relaxed">
                        Our platform and infrastructure undergo rigorous, continuous testing by independent, CREST-approved third-party ethical hackers. We maintain a zero-tolerance policy for critical and high vulnerabilities.
                    </p>
                    <ul className="space-y-3 dark:text-slate-300 text-slate-700 font-medium">
                        <li className="flex items-center gap-3"><i className="bi bi-check-circle-fill text-emerald-500"></i> Bi-annual full infrastructure penetration tests</li>
                        <li className="flex items-center gap-3"><i className="bi bi-check-circle-fill text-emerald-500"></i> Weekly automated DAST/SAST vulnerability scans</li>
                        <li className="flex items-center gap-3"><i className="bi bi-check-circle-fill text-emerald-500"></i> Active Bug Bounty program via HackerOne</li>
                        <li className="flex items-center gap-3"><i className="bi bi-check-circle-fill text-emerald-500"></i> Real-time dependency monitoring and patching</li>
                    </ul>
                    <div className="mt-8">
                        <a href="/contact" className="inline-block px-6 py-3 bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-900 hover:bg-slate-800 font-bold rounded-lg transition-colors text-sm uppercase tracking-wider">
                            Request Latest Pen Test Summary
                        </a>
                    </div>
                </div>
            </div>
        </div>

            {/* SOC 2 Lead Gate Modal */}
            {showSocForm && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-6 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
                            <h3 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
                                <i className="bi bi-shield-lock-fill text-blue-500"></i> Access SOC 2 Report
                            </h3>
                            <button onClick={() => setShowSocForm(false)} className="w-8 h-8 rounded-full dark:bg-slate-800 bg-slate-200 flex items-center justify-center dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors border-none cursor-pointer">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="p-6">
                            {formStatus.type === 'success' ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-3xl mx-auto mb-4">
                                        <i className="bi bi-check-lg"></i>
                                    </div>
                                    <h4 className="text-xl font-bold dark:text-white text-slate-900 mb-2">Access Granted</h4>
                                    <p className="dark:text-slate-400 text-slate-600 text-sm">{formStatus.message}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleDownload} className="space-y-4">
                                    <p className="text-sm dark:text-slate-400 text-slate-600 mb-4">Please provide your work email to access our compliance reports. NDA may be required for full access.</p>
                                    <div>
                                        <label className="block text-sm font-bold dark:text-slate-300 text-slate-700 mb-1">Work Email</label>
                                        <input type="email" required placeholder="name@company.com" className="w-full px-4 py-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-800 dark:text-white border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold dark:text-slate-300 text-slate-700 mb-1">Company Name</label>
                                        <input type="text" required className="w-full px-4 py-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-800 dark:text-white border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                    <button type="submit" disabled={formStatus.type === 'loading'} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-600/20 mt-4 border-none cursor-pointer disabled:opacity-70">
                                        {formStatus.type === 'loading' ? 'Processing...' : 'Download Report'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default SecurityTrustCenter;
