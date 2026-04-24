import React from 'react';

const SLATemplate = ({ data }) => {
    return (
        <div className="p-12 relative h-full">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">SERVICE LEVEL AGREEMENT</h1>
                    <p className="text-lg text-rose-600 font-semibold mt-2">Performance & Support Matrix</p>
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
                        <p className="text-sm font-semibold text-slate-900">SLA-{data.meta.docNumber.split('-')[1]}</p>
                        <p className="text-xs text-slate-500 mt-1">Effective: {data.meta.date}</p>
                    </div>
                </div>
            </div>

            <div className="prose prose-sm prose-slate max-w-none">
                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">1. Support Coverage & Hours</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Provider agrees to deliver technical support natively through the BitGuard Support Portal, accessible via email, phone, or web. Standard coverage spans 24/7/365 for Critical Priority incidents.
                </p>

                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">2. Priority Matrix & Response Target</h3>
                
                <table className="w-full text-left border-collapse mb-8">
                    <thead>
                        <tr className="bg-slate-900 text-white">
                            <th className="py-2 px-3 text-xs font-bold uppercase tracking-wider w-1/4">Severity</th>
                            <th className="py-2 px-3 text-xs font-bold uppercase tracking-wider w-2/4">Description</th>
                            <th className="py-2 px-3 text-xs font-bold uppercase tracking-wider w-1/4">Response Target</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700">
                        <tr className="border-b border-slate-200">
                            <td className="py-3 px-3 font-bold text-rose-600">P1 - Critical</td>
                            <td className="py-3 px-3 text-xs">Total system outage. Major business impact impacting all users. Data destruction imminent.</td>
                            <td className="py-3 px-3 font-semibold">15 Minutes</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                            <td className="py-3 px-3 font-bold text-amber-600">P2 - High</td>
                            <td className="py-3 px-3 text-xs">Core application degraded. Subset of users unable to work. No workaround immediately available.</td>
                            <td className="py-3 px-3 font-semibold">1 Hour</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                            <td className="py-3 px-3 font-bold text-blue-600">P3 - Normal</td>
                            <td className="py-3 px-3 text-xs">Single user issue. Workarounds available. Non-critical functionality degraded.</td>
                            <td className="py-3 px-3 font-semibold">4 Hours</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                            <td className="py-3 px-3 font-bold text-slate-600">P4 - Low</td>
                            <td className="py-3 px-3 text-xs">Information request. Cosmetic dashboard bugs. New user provisioning setup.</td>
                            <td className="py-3 px-3 font-semibold">24 Hours</td>
                        </tr>
                    </tbody>
                </table>

                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">3. Hardware Uptime Guarantee (99.99%)</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Provider guarantees that managed infrastructure, firewalls, and core switches will experience no more than 4.38 minutes of unscheduled downtime per month.
                </p>

                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">4. Selected Modifiers</h3>
                {data.services.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-300 bg-slate-50 text-center rounded-xl mb-6">
                        <p className="text-slate-400 text-sm">Please select services to apply SLA modifiers.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {data.services.map((service, index) => (
                            <div key={index} className="bg-white border border-slate-200 rounded p-3 break-inside-avoid shadow-sm flex items-start gap-3">
                                <div className="w-5 h-5 flex-shrink-0 bg-rose-100 text-rose-600 flex items-center justify-center rounded text-xs mt-0.5">
                                    <i className="bi bi-shield-check"></i>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">{service.title}</h4>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Covered by SLA</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">5. Penalties</h3>
                <p className="text-sm text-slate-600 mb-12 leading-relaxed">
                    Failure to meet these SLA metrics entitles the Client to a service credit equivalent to 5% of the monthly recurring total for every SLA breach, up to a maximum of 50% of the total monthly bill.
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
        </div>
    );
};

export default SLATemplate;
