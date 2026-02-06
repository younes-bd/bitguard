import React from 'react';
import { Link } from 'react-router-dom';

const Compliance = () => {
    const standards = [
        {
            title: "HIPAA",
            subtitle: "Health Insurance Portability and Accountability Act",
            desc: "Protect sensitive patient health information (PHI) with robust access controls, encryption, and audit logs.",
            icon: "bi bi-hospital",
            color: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            title: "GDPR",
            subtitle: "General Data Protection Regulation",
            desc: "Ensure privacy rights for EU citizens with data handling policies, consent management, and the right to be forgotten.",
            icon: "bi bi-shield-check",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "PCI-DSS",
            subtitle: "Payment Card Industry Data Security Standard",
            desc: "Secure credit card transactions and data storage to prevent fraud and avoid costly non-compliance fines.",
            icon: "bi bi-credit-card-2-front",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "SOC 2 Type II",
            subtitle: "Service Organization Control",
            desc: "Demonstrate your organization's commitment to security, availability, processing integrity, confidentiality, and privacy.",
            icon: "bi bi-file-earmark-lock",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "NIST CSF",
            subtitle: "NIST Cybersecurity Framework",
            desc: "Align your security strategy with the gold standard for managing and reducing cybersecurity risk.",
            icon: "bi bi-building-lock",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            title: "ISO 27001",
            subtitle: "Information Security Management",
            desc: "Implement a systematic approach to managing sensitive company information so that it remains secure.",
            icon: "bi bi-globe",
            color: "text-cyan-500",
            bg: "bg-cyan-500/10"
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-slate-950 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/assets/images/grid.png')] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider mb-6">
                        <i className="bi bi-patch-check-fill text-green-500"></i> Regulatory Excellence
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[Oswald]">
                        Compliance <span className="text-blue-500">Simplified</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Navigate the complex landscape of regulatory standards with confidence. We turn compliance from a burden into a competitive advantage.
                    </p>
                    <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors inline-block shadow-lg shadow-blue-600/30 no-underline">
                        Schedule a Compliance Audit
                    </Link>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-20 container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Compliance Matters</h2>
                    <p className="text-slate-600 text-lg">
                        Compliance isn't just about avoiding fines; it's about building trust with your customers.
                        A certified secure environment proves that you value their data and safety above all else.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {standards.map((std, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-14 h-14 rounded-xl ${std.bg} ${std.color} flex items-center justify-center text-3xl mb-6`}>
                                <i className={std.icon}></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{std.title}</h3>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{std.subtitle}</div>
                            <p className="text-slate-600 leading-relaxed">{std.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Compliance Framework</h2>
                        <p className="text-slate-500">A proven 3-step path to audit readiness.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-1 bg-slate-100 -z-10"></div>

                        {[
                            { step: "01", title: "Assess & Gap Analysis", desc: "We scan your current environment against the target standard to identify every deficiency." },
                            { step: "02", title: "Remediate & Secure", desc: "Our team implements the necessary technical controls, encryption, and policies." },
                            { step: "03", title: "Maintain & Monitor", desc: "Continuous automated monitoring ensures you stay compliant as regulations evolve." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center bg-white p-4">
                                <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold mb-6 border-8 border-slate-50">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 max-w-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-slate-900 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-[Oswald]">Ready to Prove Your Security?</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors no-underline">
                            Get Audit Ready
                        </Link>
                        <Link to="/reports" className="px-8 py-4 bg-transparent border border-slate-600 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors no-underline">
                            Download Compliance Guide
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Compliance;
