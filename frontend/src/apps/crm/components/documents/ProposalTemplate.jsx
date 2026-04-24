import React from 'react';

const ProposalTemplate = ({ data }) => {
    return (
        <div className="p-12 relative h-full">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">PROPOSAL</h1>
                    <p className="text-xl text-blue-600 font-semibold mt-2">IT Services & Solutions</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black tracking-tighter text-slate-900">BITGUARD</div>
                    <p className="text-sm text-slate-500 font-medium">Enterprise Technology Partners</p>
                    <p className="text-xs text-slate-400 mt-1">contact@bitguard.com<br />www.bitguard.com</p>
                </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Prepared For</p>
                    <h3 className="text-lg font-bold text-slate-900">{data.client.name}</h3>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{data.client.address}</p>
                    <p className="text-sm text-blue-600 mt-1">{data.client.email}</p>
                </div>
                <div className="text-right">
                    <div className="mb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Document Ref</p>
                        <p className="text-sm font-semibold text-slate-900">{data.meta.docNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-sm font-semibold text-slate-900">{data.meta.date}</p>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold border-b border-slate-200 pb-2 mb-6">Executive Summary</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Based on our technical discovery, BitGuard is pleased to present the following proposal for {data.client.name}. Our objective is to modernize, secure, and stabilize your technology environment using enterprise-grade architecture.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                    The services listed below represent a comprehensive technology stack tailored specifically to your business requirements.
                </p>
            </div>

            {/* Proposed Services */}
            <div>
                <h2 className="text-2xl font-bold border-b border-slate-200 pb-2 mb-6 text-slate-900">Proposed Services Scope</h2>
                
                {data.services.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-300 bg-slate-50 text-center rounded-xl">
                        <p className="text-slate-400 text-sm">Please select services from the generator panel.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {data.services.map((service, index) => (
                            <div key={index} className="break-inside-avoid">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                                    {service.title}
                                </h3>
                                <p className="text-sm text-slate-600 mt-2 leading-relaxed ml-9">{service.description}</p>
                                
                                {service.features && (
                                    <ul className="mt-3 ml-9 grid grid-cols-2 gap-x-4 gap-y-2">
                                        {service.features.slice(0, 4).map((feat, i) => (
                                            <li key={i} className="text-xs font-medium text-slate-700 flex items-start gap-2">
                                                <span className="text-blue-500">•</span>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200 break-inside-avoid">
                <p className="text-xs text-slate-400 text-center">This document is proprietary and confidential. Pricing and scopes are valid for 30 days from the date of issuance.</p>
            </div>
        </div>
    );
};

export default ProposalTemplate;
