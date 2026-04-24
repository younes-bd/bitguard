import React from 'react';

const SOWTemplate = ({ data }) => {
    return (
        <div className="p-12 relative h-full">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">STATEMENT OF WORK</h1>
                    <p className="text-lg text-indigo-600 font-semibold mt-2">Technical Delivery Scope</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black tracking-tighter text-slate-900">BITGUARD</div>
                    <p className="text-sm text-slate-500 font-medium">Enterprise Technology Partners</p>
                </div>
            </div>

            {/* Meta Info */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg mb-8">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Client</p>
                        <h3 className="text-base font-bold text-slate-900">{data.client.name}</h3>
                        <p className="text-sm text-slate-600 truncate">{data.client.email}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Document Reference</p>
                        <p className="text-sm font-semibold text-slate-900">SOW-{data.meta.docNumber.split('-')[1]}</p>
                        <p className="text-xs text-slate-500 mt-1">Effective: {data.meta.date}</p>
                    </div>
                </div>
            </div>

            <div className="prose prose-sm prose-slate max-w-none">
                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">1. Purpose and Scope</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    This Statement of Work ("SOW") outlines the responsibilities, deliverables, and architecture to be implemented by BitGuard ("Provider") for {data.client.name} ("Client"). This document ensures complete alignment on the technical execution path.
                </p>

                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">2. Deliverables & Technical Execution</h3>
                
                {data.services.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-300 bg-slate-50 text-center rounded-xl mb-6">
                        <p className="text-slate-400 text-sm">Please select services to populate deliverables.</p>
                    </div>
                ) : (
                    <div className="space-y-6 mb-8">
                        {data.services.map((service, index) => (
                            <div key={index} className="bg-white border border-slate-200 rounded p-4 break-inside-avoid shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Phase {index + 1}: {service.title}</h4>
                                <p className="text-xs text-slate-600 mb-3">{service.description}</p>
                                
                                <div className="text-xs font-bold text-slate-800 mb-2">Key Milestones:</div>
                                <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                                    <li>Infrastructure audit and architecture design sign-off.</li>
                                    <li>Deployment protocols executed in staging environment.</li>
                                    <li>Production rollout with zero unexpected downtime.</li>
                                    <li>Handoff documentation and executive review.</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">3. Out of Scope Exclusions</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Any tasks not explicitly listed in Section 2 are considered out of scope. This includes, but is not limited to, custom physical wiring beyond defined drops, third-party software licensing disputes, and legacy code refactoring not related to the immediate deployment.
                </p>

                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">4. Acceptance Criteria</h3>
                <p className="text-sm text-slate-600 mb-12 leading-relaxed">
                    Client will have five (5) business days following notification of milestone completion to review the deliverables. If no written notice of defect is provided, the phase is deemed automatically accepted and billing will commence.
                </p>
            </div>

            {/* Signature Block */}
            <div className="flex justify-between items-end mt-12 pt-8 border-t border-slate-200 break-inside-avoid">
                <div className="w-64">
                    <div className="border-b border-slate-400 h-10 mb-2"></div>
                    <p className="text-xs font-bold text-slate-900">Authorized Client Signature</p>
                    <p className="text-xs text-slate-500">{data.client.name}</p>
                </div>
                <div className="w-64">
                    <div className="border-b border-slate-400 h-10 mb-2"></div>
                    <p className="text-xs font-bold text-slate-900">Authorized BitGuard Officer</p>
                    <p className="text-xs text-slate-500">BitGuard Solutions LLC</p>
                </div>
            </div>
            
            <div className="mt-8 text-center break-inside-avoid">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Confidential & Proprietary</p>
            </div>
        </div>
    );
};

export default SOWTemplate;
