import React from 'react';
import SectionDivider from '../../../../core/components/SectionDivider';
import PageMeta from '../../../../core/components/shared/PageMeta';
import '../../../../core/styles/landing.css';

const About = () => {
    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen transition-colors duration-300">
            <PageMeta title="About Us" description="Learn about BitGuard â€” our mission, values, and commitment to empowering businesses with enterprise-grade IT and cybersecurity solutions." />
            {/* Dark Tech Hero */}
            <section className="relative py-24 lg:py-32 dark:bg-slate-950 bg-slate-50 overflow-hidden transition-colors duration-300">
                {/* Tech Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full dark:bg-blue-500/10 bg-blue-100 border dark:border-blue-500/20 border-blue-200 text-blue-600 dark:text-blue-300 text-xs font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Who We Are
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 dark:text-white text-slate-900 tracking-tight transition-colors duration-300">
                        Empowering Your <br className="md:hidden" /> Digital Future
                    </h1>
                    <p className="text-xl dark:text-slate-400 text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed transition-colors duration-300">
                        BitGuard is your comprehensive <strong>"Do-It-All" IT Enterprise</strong> partner. From physical infrastructure and helpdesk support to complex cloud architectures, custom app development, and 24/7 cybersecurity, we deliver end-to-end technology solutions under one roof.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="dark:bg-slate-900 bg-slate-800 border-b dark:border-slate-800 border-slate-700 relative z-20 -mt-10 mx-4 md:mx-8 rounded-2xl shadow-2xl skew-y-0 transition-colors duration-300">
                <div className="container mx-auto px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x dark:divide-slate-800 divide-slate-700 transition-colors duration-300">
                        <div>
                            <span className="block text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">15+</span>
                            <span className="text-sm md:text-base text-blue-400 uppercase tracking-widest font-bold">Years Experience</span>
                        </div>
                        <div>
                            <span className="block text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">500+</span>
                            <span className="text-sm md:text-base text-blue-400 uppercase tracking-widest font-bold">Clients Secured</span>
                        </div>
                        <div>
                            <span className="block text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">1.2k</span>
                            <span className="text-sm md:text-base text-blue-400 uppercase tracking-widest font-bold">Projects Done</span>
                        </div>
                        <div>
                            <span className="block text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">50+</span>
                            <span className="text-sm md:text-base text-blue-400 uppercase tracking-widest font-bold">Tech Experts</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="wave" from="dark" to="light" />

            {/* Why BitGuard */}
            <section className="py-24 dark:bg-slate-900 bg-white relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-1/3 h-full dark:bg-slate-800/30 bg-slate-50 skew-x-12 opacity-50 transition-colors duration-300"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">Our Story</span>
                            <h2 className="text-4xl lg:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                                Why BitGuard is the choice for you
                            </h2>
                            <div className="space-y-6 dark:text-slate-400 text-slate-600 text-lg leading-relaxed transition-colors duration-300">
                                <p>
                                    Gone are the days of managing dozens of disparate vendors. At BitGuard, we are a true "Do-It-All" technology powerhouse, providing everything your enterprise needs to operate, scale, and secure its digital and physical assets.
                                </p>
                                <p>
                                    Whether you need to wire a new office, build a custom AI-driven software platform, migrate massive workloads to AWS, or establish a 24/7 Security Operations Center, our integrated teams work seamlessly to deliver excellence across every IT domain.
                                </p>
                                <ul className="space-y-4 mt-8">
                                    <li className="flex items-center">
                                        <i className="bi bi-diagram-3-fill text-blue-600 mr-4 text-xl"></i>
                                        <span className="font-bold dark:text-slate-300 text-slate-800 transition-colors duration-300">End-to-End IT & Cloud Infrastructure</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="bi bi-code-slash text-blue-600 mr-4 text-xl"></i>
                                        <span className="font-bold dark:text-slate-300 text-slate-800 transition-colors duration-300">Custom App Dev & AI Automation</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="bi bi-shield-check text-blue-600 mr-4 text-xl"></i>
                                        <span className="font-bold dark:text-slate-300 text-slate-800 transition-colors duration-300">Enterprise Cybersecurity (SOC & MDR)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="relative mt-12 lg:mt-0">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl transform rotate-2 opacity-20"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border dark:border-slate-700 border-slate-100 transition-colors duration-300">
                                <img src="/assets/images/company/enterprise-team.png" alt="BitGuard Enterprise Team" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-10 -left-10 dark:bg-slate-800 bg-white p-6 rounded-xl shadow-2xl border dark:border-slate-700 border-slate-100 max-w-xs hidden lg:block transition-colors duration-300">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 transition-colors duration-300">
                                        <i className="bi bi-shield-check text-2xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold dark:text-white text-slate-900 transition-colors duration-300">ISO 27001</h4>
                                        <p className="text-xs dark:text-slate-400 text-slate-500 transition-colors duration-300">Certified Security</p>
                                    </div>
                                </div>
                                <p className="text-sm dark:text-slate-400 text-slate-600 transition-colors duration-300">We adhere to the highest international standards for information security.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <SectionDivider variant="angle" from="light" to="dark" />

            {/* Timeline Section */}
            <section className="py-24 dark:bg-slate-950 bg-slate-50 relative overflow-hidden transition-colors duration-300">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 block">Our Journey</span>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight dark:text-white text-slate-900 transition-colors duration-300">
                            Company Timeline
                        </h2>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="relative border-l-2 border-blue-500/30 pl-8 ml-4 space-y-12">
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-slate-50 dark:border-slate-950"></div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">2015 - The Beginning</h3>
                                <p className="dark:text-slate-400 text-slate-600">BitGuard was founded with a mission to provide comprehensive IT support and physical infrastructure to growing businesses.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-slate-50 dark:border-slate-950"></div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">2018 - Security & Cloud Expansion</h3>
                                <p className="dark:text-slate-400 text-slate-600">Launched our fully-managed SOC and Cloud Architecture divisions, achieving SOC 2 Type II compliance.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-slate-50 dark:border-slate-950"></div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">2021 - Digital Transformation Wing</h3>
                                <p className="dark:text-slate-400 text-slate-600">Established our in-house App Development and AI Automation teams to serve complex enterprise software needs.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-slate-50 dark:border-slate-950"></div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">2026 - The "Do-It-All" Enterprise</h3>
                                <p className="dark:text-slate-400 text-slate-600">Operating globally as an end-to-end IT Enterprise, delivering everything from AI-driven data pipelines to physical security and 24/7 SOC operations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SectionDivider variant="wave" from="dark" to="light" />

            {/* Diversity */}
            <section className="py-24 dark:bg-slate-950 bg-slate-50 relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-[url('/assets/images/grid.png')] opacity-5"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="lg:order-2">
                            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 block">Culture</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight dark:text-white text-slate-900 transition-colors duration-300">
                                Diversity & Inclusion at BitGuard
                            </h2>
                            <div className="space-y-6 dark:text-slate-400 text-slate-600 text-lg transition-colors duration-300">
                                <p>
                                    At BitGuard, we believe that diversity fuels innovation. Our commitment to fostering an inclusive workplace is unwavering.
                                </p>
                                <p>
                                    We strive to create an environment where every team member feels valued, respected, and empowered to do their best work.
                                </p>
                                <a href="/careers"
                                    className="inline-flex items-center font-bold text-blue-500 hover:text-blue-400 mt-6 border-b-2 border-blue-500 pb-1 transition-colors duration-300">
                                    Join Our Team <i className="bi bi-arrow-right ml-2"></i>
                                </a>
                            </div>
                        </div>
                        <div className="lg:order-1">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border dark:border-slate-800 border-slate-300 group transition-colors duration-300">
                                <img src="/assets/images/company/diversity-team.png" alt="Diverse BitGuard Team"
                                    className="w-full h-full object-cover opacity-80 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 transition-opacity duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                                <div className="absolute bottom-8 left-8">
                                    <p className="tracking-tight text-2xl font-bold text-white">"Innovation starts with people."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SectionDivider variant="gradient" from="dark" to="light" />

            {/* Partners */}
            <section className="py-16 dark:bg-slate-900 bg-white border-t dark:border-slate-800 border-slate-200 transition-colors duration-300">
                <div className="container mx-auto px-4 text-center">
                    <p className="dark:text-slate-500 text-slate-400 font-bold uppercase tracking-widest mb-10 text-sm transition-colors duration-300">Technology Partners</p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-microsoft text-blue-500"></i> Microsoft Solutions Partner</div>
                        <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-cloud text-amber-500"></i> AWS Advanced Tier</div>
                        <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-shield-lock text-red-500"></i> CrowdStrike Elevate</div>
                        <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-router text-emerald-500"></i> Cisco Gold Integrator</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;

