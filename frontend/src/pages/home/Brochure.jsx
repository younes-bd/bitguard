import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SERVICES from '../../data/servicesData';
import '../../index.css';

const Brochure = () => {
    const { slug } = useParams();
    const service = SERVICES[slug];

    useEffect(() => {
        document.title = service ? `${service.title} - Brochure` : 'Brochure Not Found';
    }, [service]);

    if (!service) {
        return <Navigate to="/404" replace />;
    }

    return (
        <div className="bg-slate-100 min-h-screen p-8 flex justify-center print:p-0 print:bg-white print:block">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap');`}
                {`
                    @media print {
                        @page { margin: 15mm; size: A4; }
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
                        .no-print { display: none !important; }
                        /* Ensure background colors print */
                        * { -webkit-print-color-adjust: exact !important;   print-color-adjust: exact !important; }
                    }
                `}
            </style>

            {/* Main Content A4 Container */}
            <div className="max-w-[210mm] w-full bg-white shadow-2xl min-h-[297mm] p-12 relative flex flex-col text-slate-900 print:shadow-none print:w-full print:max-w-none print:p-0 print:m-0 print:h-auto print:min-h-0 print:block">

                {/* Print Controls */}
                <div className="fixed top-6 right-6 flex flex-col gap-3 print:hidden z-50 no-print">
                    <button
                        onClick={() => window.print()}
                        className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-sky-500 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border-0">
                        <i className="bi bi-printer-fill"></i> Print / Save PDF
                    </button>
                    <Link to={`/platform/${slug}`} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-slate-700 hover:scale-105 transition-all flex items-center justify-center gap-2 no-underline">
                        <i className="bi bi-arrow-left"></i> Back to Site
                    </Link>
                </div>

                {/* Header */}
                <div className="flex justify-between items-end border-b-4 border-sky-600 pb-8 mb-12 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-[12px]">
                            <div className="relative w-[50px] h-[50px] bg-sky-50 rounded-xl flex items-center justify-center border border-sky-100">
                                <img src="/assets/logo/logo.png" alt="BitGuard" className="relative h-[30px] w-auto drop-shadow-md" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                            <div>
                                <span className="text-slate-900 text-[24px] font-semibold font-[Oswald] tracking-[2px] leading-none block scale-y-[1.4] origin-left">BITGUARD</span>
                                <span className="text-xs font-bold text-sky-600 tracking-widest uppercase block mt-1">Enterprise Security</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider m-0">Service Brochure</h2>
                        <p className="text-xs text-slate-500 m-0">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Hero */}
                <div className="bg-slate-50 p-8 rounded-2xl mb-10 border border-slate-100 print:bg-slate-50 print:border-slate-200 flex-shrink-0 break-inside-avoid">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <i className={`${service.icon} text-4xl text-sky-600`}></i>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2 mt-0">{service.title}</h1>
                            <p className="text-xl text-slate-600 m-0">{service.subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="grid grid-cols-3 gap-12 flex-grow print:block">

                    {/* Left Column (Details) */}
                    <div className="col-span-2 space-y-10 print:w-full print:mb-8">
                        <section className="break-inside-avoid mb-8">
                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Overview</h3>
                            <div className="prose prose-slate text-slate-600 max-w-none text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: service.long_description }}>
                            </div>
                        </section>

                        <section className="break-inside-avoid mb-8">
                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Key Benefits</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {service.benefits && service.benefits.map((b, i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100 print:bg-slate-50 print:border-slate-200 break-inside-avoid">
                                        <h4 className="font-bold text-slate-900 mb-1 text-sm">{b.title}</h4>
                                        <p className="text-xs text-slate-600 m-0">{b.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="break-inside-avoid mb-8">
                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Our Process</h3>
                            <div className="space-y-3">
                                {service.process && service.process.map((p, i) => (
                                    <div key={i} className="flex items-start gap-4 break-inside-avoid">
                                        <div className="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 print:text-black print:border print:border-slate-900">
                                            {p.step}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm m-0">{p.title}</h4>
                                            <p className="text-xs text-slate-600 m-0">{p.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Summary & Contact) */}
                    <div className="col-span-1 space-y-8 print:w-full print:grid print:grid-cols-2 print:gap-8">
                        <div className="bg-slate-900 text-white p-6 rounded-xl print:bg-slate-100 print:text-black print:border print:border-slate-300 break-inside-avoid">
                            <h3 className="font-bold mb-4 text-sky-400 print:text-sky-700">Why BitGuard?</h3>
                            <ul className="space-y-3 p-0 m-0 list-none">
                                {service.why_choose_us && service.why_choose_us.points.map((p, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs">
                                        <i className="bi bi-check-lg text-green-400 print:text-black"></i>
                                        <span className="opacity-90">{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border border-slate-200 p-6 rounded-xl break-inside-avoid">
                            <h3 className="font-bold text-slate-900 mb-4">Features</h3>
                            <ul className="space-y-2 p-0 m-0 list-none">
                                {service.features && service.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                        <i className="bi bi-dot text-sky-500 text-xl print:text-black"></i>
                                        {f.title}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-sky-50 border border-sky-100 p-6 rounded-xl text-center break-inside-avoid print:bg-white print:border-sky-200 print:col-span-2">
                            <h4 className="font-bold text-sky-900 mb-2">Ready to Start?</h4>
                            <p className="text-xs text-sky-700 mb-4">Contact our team for a personalized quote.</p>
                            <div className="font-bold text-lg text-slate-900">+213 562 07 95 11</div>
                            <div className="text-xs text-slate-500">hello@bitguard.tech</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 border-t border-slate-200 pt-6 flex justify-between items-center text-xs text-slate-500 break-before-avoid print:mt-8">
                    <p className="m-0">&copy; {new Date().getFullYear()} BitGuard Security Inc.</p>
                    <div className="flex gap-6">
                        <span>www.bitguard.tech</span>
                        <span>+213 562 07 95 11</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Brochure;
