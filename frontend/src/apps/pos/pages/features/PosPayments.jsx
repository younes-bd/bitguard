import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Loader2, Download, PackageOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import posService from '../../api/posService';

export default function PosPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        setLoading(true);
        try {
            const data = await posService.getPayments();
            setPayments(data?.results || data || []);
        } catch (error) {
            toast.error('Failed to load POS payments');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(p => 
        p.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.amount?.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <CreditCard className="text-sky-400" size={28} /> POS Payments
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Payment register from Point of Sale sessions</p>
                </div>
                <button 
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg"
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by amount or method..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="flex items-center justify-center py-20 flex-col gap-4">
                        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                        <p className="text-slate-400 text-sm">Loading transactions...</p>
                    </div>
                ) : filteredPayments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Session Ref</th>
                                    <th className="p-4">Method</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredPayments.map((p) => (
                                    <tr key={p.id} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-slate-400">{new Date(p.created_at || Date.now()).toLocaleDateString()}</td>
                                        <td className="p-4 text-white font-mono text-xs">{p.session || 'SESSION-XXX'}</td>
                                        <td className="p-4 font-semibold text-white">{p.payment_method || 'Card'}</td>
                                        <td className="p-4 text-right font-bold text-sky-400">${parseFloat(p.amount).toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-wider">
                                                Completed
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <PackageOpen size={40} className="mx-auto mb-3 text-slate-700" />
                        <p className="font-bold text-slate-400">No payment transactions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
