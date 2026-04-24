import React from 'react';
import PageMeta from '../../../core/components/shared/PageMeta';

const PrivacyPolicy = () => {
    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen transition-colors duration-300">
            <PageMeta title="Privacy Policy" description="BitGuard's privacy policy outlines how we collect, use, and protect your personal information." />

            {/* Hero */}
            <section className="relative pt-32 pb-16 dark:bg-slate-950 bg-slate-50 overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-10 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full dark:bg-blue-500/10 bg-blue-100 border dark:border-blue-500/20 border-blue-200 text-blue-600 dark:text-blue-300 text-xs font-bold mb-6 uppercase tracking-[0.2em]">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-slate-900 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 mt-4 text-sm">Last updated: April 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="pb-24 dark:bg-slate-900 bg-white transition-colors duration-300">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="dark:text-slate-300 text-slate-700 space-y-8 leading-relaxed">
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">1. Information We Collect</h2>
                            <p>At BitGuard, we collect information you provide directly to us, such as when you create an account, submit a support ticket, contact us, or request a consultation. This includes your name, email address, phone number, company name, and any other information you choose to provide.</p>
                            <p className="mt-3">We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our site.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">2. How We Use Your Information</h2>
                            <ul className="space-y-2 list-disc pl-6">
                                <li>To provide, maintain, and improve our services</li>
                                <li>To process transactions and send related information</li>
                                <li>To respond to your support requests and inquiries</li>
                                <li>To send you technical notices, updates, and security alerts</li>
                                <li>To communicate about products, services, and events</li>
                                <li>To monitor and analyze trends, usage, and activities</li>
                                <li>To detect, investigate, and prevent fraudulent transactions and abuse</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">3. Information Sharing</h2>
                            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">4. Data Security</h2>
                            <p>We implement industry-standard security measures to protect your personal information, including AES-256 encryption for data at rest and TLS 1.3 for data in transit. Our infrastructure is SOC2 Type II certified and undergoes regular third-party security audits.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">5. Data Retention</h2>
                            <p>We retain your personal information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">6. Your Rights</h2>
                            <p>You have the right to access, correct, or delete your personal information at any time. You may also opt out of receiving marketing communications from us. To exercise any of these rights, please contact us at <a href="mailto:privacy@bitguard.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@bitguard.com</a>.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">7. Cookies</h2>
                            <p>We use cookies and similar tracking technologies to track activity on our website and to improve your experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">8. Changes to This Policy</h2>
                            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">9. Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                            <div className="mt-3 p-4 dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-200 rounded-xl">
                                <p className="font-bold dark:text-white text-slate-900">BitGuard Technologies LLC</p>
                                <p>55 W. Monroe St., Suite 1200</p>
                                <p>Chicago, IL 60603</p>
                                <p className="mt-2"><a href="mailto:privacy@bitguard.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@bitguard.com</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
