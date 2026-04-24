import React from 'react';
import { Package, MapPin, Calendar, PenTool } from 'lucide-react';

const DeliveryReceiptTemplate = ({ data }) => {
    return (
        <div className="p-12 relative h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start pt-6 mb-8 border-b-2 border-slate-900 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Delivery Receipt</h1>
                    <p className="text-sm text-amber-600 font-bold uppercase tracking-widest mt-2">Hardware & Assets</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black tracking-tighter text-slate-900">BITGUARD</div>
                    <p className="text-sm text-slate-500 font-medium">Logistics & Deployment</p>
                </div>
            </div>

            {/* Logistics Meta Box */}
            <div className="grid grid-cols-2 gap-8 mb-8 border border-slate-200 rounded-xl overflow-hidden text-sm">
                <div className="p-6 bg-slate-50 border-r border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1"><MapPin size={12}/> Delivery Address</p>
                    <h3 className="font-bold text-slate-900 text-lg">{data.client.name}</h3>
                    <p className="text-slate-600 font-medium whitespace-pre-wrap mt-1">{data.client.address}</p>
                    <p className="text-slate-500 mt-2">{data.client.email}</p>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Package size={12}/> Shipment Reference</p>
                        <p className="font-bold text-slate-900 font-mono text-lg">DLV-{data.meta.docNumber.split('-')[1]}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={12}/> Date of Delivery</p>
                        <p className="font-bold text-slate-900">{data.meta.date}</p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 leading-relaxed text-justify">
                    This document serves as formal confirmation that the following technical assets, hardware, or software licenses have been physically delivered, deployed, or assigned to the Client listed above. 
                </p>
            </div>

            {/* Delivered Items List */}
            <div className="flex-1 mb-12">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900 text-white">
                            <th className="py-2 px-4 text-xs font-bold uppercase tracking-wider w-16 text-center">Qty</th>
                            <th className="py-2 px-4 text-xs font-bold uppercase tracking-wider">Item / Asset Description</th>
                            <th className="py-2 px-4 text-xs font-bold uppercase tracking-wider w-40">Condition</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm border border-slate-200">
                        {data.services.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-slate-400 text-sm">
                                    No physical inventory selected.
                                </td>
                            </tr>
                        ) : (
                            data.services.map((service, index) => (
                                <tr key={index} className="border-b border-slate-200">
                                    <td className="py-4 px-4 text-center font-bold text-slate-900 bg-slate-50 border-r border-slate-200">
                                        1
                                    </td>
                                    <td className="py-4 px-4 align-top">
                                        <div className="font-bold text-slate-900">{service.title} Deployment Kit</div>
                                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{service.description}</div>
                                    </td>
                                    <td className="py-4 px-4 align-middle">
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider text-[10px]">New / Sealed</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Sign-off Section */}
            <div className="break-inside-avoid">
                <h3 className="text-sm font-bold text-slate-900 mb-2 border-b-2 border-slate-900 pb-1 flex items-center gap-2"><PenTool size={16}/> Hardware Acceptance Sign-off</h3>
                <p className="text-xs text-slate-600 mb-8 leading-relaxed">
                    By signing below, the Client acknowledges receipt of the aforementioned inventory in satisfactory condition. The Client assumes responsibility for physical loss or damage of hardware starting from the date of delivery.
                </p>

                <div className="flex justify-between items-end gap-12">
                    <div className="flex-1">
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-400">Signature:</span>
                            <div className="border-b border-slate-400 flex-1 h-12"></div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-xs font-bold text-slate-400">Print Name:</span>
                            <div className="border-b border-slate-200 flex-1 h-6"></div>
                        </div>
                    </div>
                    <div className="w-48">
                        <div className="flex items-end gap-2">
                            <span className="text-xs font-bold text-slate-400">Date:</span>
                            <div className="border-b border-slate-400 flex-1 h-6"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="mt-auto pt-6 text-center break-inside-avoid">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Original: BitGuard Logistics • Copy: Client Records</p>
            </div>
        </div>
    );
};

export default DeliveryReceiptTemplate;
