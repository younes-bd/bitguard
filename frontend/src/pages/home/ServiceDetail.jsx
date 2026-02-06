import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SERVICES from '../../data/servicesData';
// Removed landing.css to enforce Tailwind styling

const ServiceDetail = () => {
    const { slug } = useParams();
    const service = SERVICES[slug];

    if (!service) {
        return <Navigate to="/404" replace />;
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section - Standardized Dark Blue Theme */}
            <section className="relative min-h-[400px] flex items-center justify-center text-white overflow-hidden bg-slate-950">

                {/* Background Effects */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#034484]/30 to-slate-950"></div>

                {/* Glowing Orb Effect */}
                <div className="absolute top-0 center-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center pt-24 pb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-8 shadow-2xl ring-1 ring-white/20">
                        <i className={`${service.icon} text-4xl text-sky-400`}></i>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                        {service.title}
                    </h1>
                    <p className="text-xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
                        {service.description}
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2">

                        {/* Long Description */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">{service.subtitle}</h2>
                            <div className="prose prose-lg prose-slate text-slate-600 max-w-none"
                                dangerouslySetInnerHTML={{ __html: service.long_description }}>
                            </div>
                        </div>

                        {/* Benefits Grid */}
                        {service.benefits && (
                            <div className="mb-16">
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                    <i className="bi bi-star-fill text-sky-500 text-lg"></i>
                                    Key Benefits
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {service.benefits.map((benefit, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-sky-200 group">
                                            <div className="w-12 h-12 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform duration-300">
                                                <i className={benefit.icon}></i>
                                            </div>
                                            <h4 className="font-bold text-slate-900 mb-2">{benefit.title}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Our Process */}
                        {service.process && (
                            <div className="mb-16">
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                    <i className="bi bi-gear-fill text-sky-500 text-lg"></i>
                                    How It Works
                                </h3>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:w-0.5 before:-translate-x-1/2 before:bg-slate-200 before:h-full before:z-0">
                                    {service.process.map((step, idx) => (
                                        <div key={idx} className="relative flex gap-6 items-start z-10">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg ring-4 ring-white">
                                                {step.step}
                                            </div>
                                            <div className="pt-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
                                                <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                                                <p className="text-slate-600">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Features List (Technical) */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <i className="bi bi-cpu-fill text-sky-500 text-lg"></i>
                                Technical Specs
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {service.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-colors">
                                        <div className="mt-1 mr-3 text-sky-500">
                                            <i className={feature.icon || 'bi bi-check-circle-fill'}></i>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-900 text-sm">{feature.title}</h5>
                                            <p className="text-xs text-slate-600 mt-1">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        {service.faq && (
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {service.faq.map((item, idx) => (
                                        <div key={idx} className="bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-300 transition-colors">
                                            <h5 className="font-bold text-slate-900 mb-2 flex items-start gap-3">
                                                <i className="bi bi-question-circle-fill text-sky-500 mt-1 flex-shrink-0"></i>
                                                {item.question}
                                            </h5>
                                            <p className="text-slate-600 pl-9">{item.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">

                            {/* Why Choose Us Widget */}
                            {service.why_choose_us && (
                                <div className="bg-slate-950 rounded-2xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
                                    {/* Subtle glow for sidebar card */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl"></div>

                                    <h3 className="text-xl font-bold mb-6 text-white border-b border-slate-800 pb-4">Why BitGuard?</h3>
                                    <ul className="space-y-5 relative z-10">
                                        {service.why_choose_us.points.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-3 group">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                    <i className="bi bi-check text-green-400 text-xs"></i>
                                                </div>
                                                <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* CTA Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-sky-500 border-x border-b border-slate-200">
                                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4 text-sky-600 text-xl">
                                    <i className="bi bi-chat-dots-fill"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Need This Solution?</h3>
                                <p className="text-slate-500 text-sm mb-6">
                                    Book a free consultation with our experts to discuss your specific requirements.
                                </p>
                                <Link to="/contact" className="block w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-center transition-all shadow-lg shadow-sky-500/20 no-underline">
                                    Get Started
                                </Link>
                                <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                    <i className="bi bi-telephone-fill"></i>
                                    <span>+213 562 07 95 11</span>
                                </div>
                            </div>

                            {/* Document/Resource Widget */}
                            <Link to={`/brochure/${slug}`} target="_blank" rel="noopener noreferrer"
                                className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 flex items-center gap-4 cursor-pointer hover:bg-slate-100 transition-colors no-underline group">
                                <i className="bi bi-file-earmark-pdf-fill text-red-500 text-3xl group-hover:scale-110 transition-transform"></i>
                                <div>
                                    <div className="text-sm font-bold text-slate-700">Download Brochure</div>
                                    <div className="text-xs text-slate-500">Printable PDF Version</div>
                                </div>
                                <i className="bi bi-download ml-auto text-slate-400 group-hover:text-slate-600 transition-colors"></i>
                            </Link>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
