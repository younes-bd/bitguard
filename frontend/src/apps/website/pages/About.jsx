import React from 'react';
import SectionDivider from '../../../core/components/SectionDivider';
import PageMeta from '../../../core/components/shared/PageMeta';
import '../../../core/styles/landing.css';

const About = () => {
    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen transition-colors duration-300">
            <PageMeta title="About Us" description="Learn about BitGuard — our mission, values, and commitment to empowering businesses with enterprise-grade IT and cybersecurity solutions." />
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
                        BitGuard is a technology partner dedicated to helping businesses navigate the complex digital landscape with
                        confidence, security, and innovation.
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
                                    At BitGuard, we fuel businesses with the technology they need to succeed. We utilize a proactive approach to identify potential issues before they become problems.
                                </p>
                                <p>
                                    BitGuard leads Managed IT Services with innovation and excellence. We offer a comprehensive suite of services that range from Cybersecurity and Cloud Services to Digital Transformation and Web/App Development.
                                </p>
                                <ul className="space-y-4 mt-8">
                                    <li className="flex items-center">
                                        <i className="bi bi-check-circle-fill text-blue-600 mr-4 text-xl"></i>
                                        <span className="font-bold dark:text-slate-300 text-slate-800 transition-colors duration-300">Proactive Security Monitoring</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="bi bi-check-circle-fill text-blue-600 mr-4 text-xl"></i>
                                        <span className="font-bold dark:text-slate-300 text-slate-800 transition-colors duration-300">24/7 Technical Support</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="bi bi-check-circle-fill text-blue-600 mr-4 text-xl"></i>
                                        <span className="font-bold dark:text-slate-300 text-slate-800 transition-colors duration-300">Cloud-First Strategy</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="relative mt-12 lg:mt-0">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl transform rotate-2 opacity-20"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border dark:border-slate-700 border-slate-100 transition-colors duration-300">
                                <img src="/assets/images/people/man.jpg" alt="BitGuard Team" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />
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

            {/* Diversity */}
            <section className="py-24 dark:bg-slate-950 bg-slate-50 relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
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
                                <img src="/assets/images/people/women.jpg" alt="Diversity"
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
                    <p className="dark:text-slate-500 text-slate-400 font-bold uppercase tracking-widest mb-10 text-sm transition-colors duration-300">Trusted By Industry Leaders</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 dark:grayscale hover:grayscale-0 transition-all duration-500">
                        {['bi-microsoft', 'bi-apple', 'bi-google', 'bi-amazon', 'bi-meta'].map((icon, index) => (
                            <i key={index} className={`bi ${icon} text-4xl dark:text-slate-400 text-slate-500 hover:text-blue-500 hover:opacity-100 transition-all cursor-pointer`}></i>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
