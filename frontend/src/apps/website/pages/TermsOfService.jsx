import React from 'react';
import PageMeta from '../../../core/components/shared/PageMeta';

const TermsOfService = () => {
    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen transition-colors duration-300">
            <PageMeta title="Terms of Service" description="BitGuard's terms of service governing the use of our platform and services." />

            {/* Hero */}
            <section className="relative pt-32 pb-16 dark:bg-slate-950 bg-slate-50 overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600 rounded-full blur-[128px] opacity-10 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full dark:bg-blue-500/10 bg-blue-100 border dark:border-blue-500/20 border-blue-200 text-blue-600 dark:text-blue-300 text-xs font-bold mb-6 uppercase tracking-[0.2em]">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-slate-900 tracking-tight">Terms of Service</h1>
                    <p className="text-slate-500 mt-4 text-sm">Last updated: April 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="pb-24 dark:bg-slate-900 bg-white transition-colors duration-300">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="dark:text-slate-300 text-slate-700 space-y-8 leading-relaxed">
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing or using BitGuard's website, services, or platform (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">2. Description of Services</h2>
                            <p>BitGuard provides managed IT services, cybersecurity solutions, cloud infrastructure management, and related technology services. Specific service details, SLAs, and pricing are defined in individual Master Service Agreements (MSAs) between BitGuard and its clients.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">3. Account Registration</h2>
                            <p>To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized access.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">4. Acceptable Use</h2>
                            <p>You agree not to use the Services for any purpose that is unlawful or prohibited by these terms. You may not:</p>
                            <ul className="space-y-2 list-disc pl-6 mt-3">
                                <li>Use the Services in violation of any applicable law or regulation</li>
                                <li>Attempt to gain unauthorized access to any systems or networks</li>
                                <li>Interfere with or disrupt the integrity or performance of the Services</li>
                                <li>Transmit any malware, viruses, or other harmful code</li>
                                <li>Reverse engineer or decompile any part of the Services</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">5. Service Level Agreements</h2>
                            <p>For managed service clients, specific uptime guarantees, response times, and support commitments are detailed in the applicable MSA. Our standard SLA guarantees 99.9% uptime and a 15-minute critical incident response time.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">6. Intellectual Property</h2>
                            <p>All content, features, and functionality of the Services — including but not limited to text, graphics, logos, and software — are the exclusive property of BitGuard Technologies LLC and are protected by copyright, trademark, and other intellectual property laws.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">7. Limitation of Liability</h2>
                            <p>To the fullest extent permitted by law, BitGuard shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or relating to your use of the Services. Our total liability shall not exceed the amounts paid by you during the twelve months preceding the claim.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">8. Termination</h2>
                            <p>We may suspend or terminate your access to the Services at any time for violation of these terms or for any other reason at our sole discretion. Upon termination, your right to use the Services will cease immediately.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">9. Governing Law</h2>
                            <p>These Terms shall be governed by and construed in accordance with the laws of the State of Illinois, without regard to its conflict of law principles.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">10. Contact Us</h2>
                            <p>For questions about these Terms, please contact us at:</p>
                            <div className="mt-3 p-4 dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-200 rounded-xl">
                                <p className="font-bold dark:text-white text-slate-900">BitGuard Technologies LLC</p>
                                <p>55 W. Monroe St., Suite 1200</p>
                                <p>Chicago, IL 60603</p>
                                <p className="mt-2"><a href="mailto:legal@bitguard.com" className="text-blue-600 dark:text-blue-400 hover:underline">legal@bitguard.com</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsOfService;
