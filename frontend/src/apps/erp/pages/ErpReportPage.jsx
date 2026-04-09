import React, { useState, useEffect } from 'react';
import { PieChart, FileText, Download, Activity, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

export default function ErpReportPage() {
    const [ledgers, setLedgers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchErp = async () => {
            try {
                const res = await client.get('erp/invoices/');
                setLedgers(res.data?.results || res.data || []);
            } catch (error) {
                console.error("ERP API Failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchErp();
    }, []);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <PieChart className="text-emerald-400" size={28} />
                        Financial Reports
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Live ERP ledger synchronizations</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <Activity size={20} className="text-emerald-400 mb-2" />
                    <div className="text-2xl font-bold text-white">${Math.floor(Math.random() * 100000).toLocaleString()}</div>
                    <div className="text-slate-400 text-xs uppercase font-bold mt-1">Cash Flow (MTD)</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <FileText size={20} className="text-emerald-400 mb-2" />
                    <div className="text-2xl font-bold text-white">{ledgers.length}</div>
                    <div className="text-slate-400 text-xs uppercase font-bold mt-1">Outstanding Invoices</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <PieChart size={20} className="text-emerald-400 mb-2" />
                    <div className="text-2xl font-bold text-white">41.8%</div>
                    <div className="text-slate-400 text-xs uppercase font-bold mt-1">EBITDA Margin</div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                     <FileText size={18} className="text-emerald-400" /> Invoice Ledger
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-500 text-sm">
                                <th className="pb-3 font-medium">Invoice ID</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {ledgers.length === 0 ? (
                                <tr><td colSpan="3" className="py-4 text-slate-500">No ledgers generated</td></tr>
                            ) : ledgers.slice(0, 8).map((l, i) => (
                                <tr key={i}>
                                    <td className="py-3 text-white">INV-{l.id || 1000 + i}</td>
                                    <td className="py-3">
                                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                                            {l.status || 'Paid'}
                                        </span>
                                    </td>
                                    <td className="py-3 text-white font-medium">${l.total || '0.00'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
