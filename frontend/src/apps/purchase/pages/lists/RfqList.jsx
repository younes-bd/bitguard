import React, { useState } from 'react';
import { FileText, Plus, Search, Filter } from 'lucide-react';

export default function RfqList() {
    const [rfqs] = useState([
        { id: 1, number: 'RFQ-001', vendor: 'Dell Enterprise', date: '2026-06-10', deadline: '2026-06-20', status: 'Sent' },
        { id: 2, number: 'RFQ-002', vendor: 'Cisco Systems', date: '2026-06-12', deadline: '2026-06-25', status: 'Draft' },
        { id: 3, number: 'RFQ-003', vendor: 'AWS Hardware', date: '2026-06-05', deadline: '2026-06-15', status: 'Done' }
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="text-orange-500" /> Requests for Quotation
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Manage RFQs sent to hardware and software vendors.</p>
                </div>
                <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    <Plus size={18} /> New RFQ
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search RFQs..." className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-orange-500 outline-none" />
                    </div>
                    <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white flex items-center gap-2">
                        <Filter size={16}/> Filter
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">RFQ Number</th>
                            <th className="px-6 py-4 font-semibold">Vendor</th>
                            <th className="px-6 py-4 font-semibold">Order Date</th>
                            <th className="px-6 py-4 font-semibold">Deadline</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                        {rfqs.map(rfq => (
                            <tr key={rfq.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-bold text-white">{rfq.number}</td>
                                <td className="px-6 py-4 text-slate-300">{rfq.vendor}</td>
                                <td className="px-6 py-4 text-slate-400">{rfq.date}</td>
                                <td className="px-6 py-4 text-slate-400">{rfq.deadline}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        rfq.status === 'Sent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        rfq.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                        {rfq.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
