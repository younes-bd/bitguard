import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Loader2, Download, PackageOpen, Ban } from 'lucide-react';
import toast from 'react-hot-toast';
import { accountingService } from '../../api/accountingService';

export default function VendorPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        setLoading(true);
        try {
            const data = await accountingService.getPayments({ type: 'outbound' });
            setPayments(data?.results || data || []);
        } catch (error) {
            toast.error('Failed to load vendor payments');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleVoid = async (id) => {
        if (!confirm('Are you sure you want to void this payment?')) return;
        try {
            await accountingService.voidPayment(id);
            toast.success('Payment voided');
            loadPayments();
        } catch (error) {
            toast.error('Failed to void payment');
        }
    };

    const filteredPayments = payments.filter(p => 
        p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.amount?.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <DollarSign className="text-purple-500" size={28} /> Vendor Payments
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage and track outgoing payments to suppliers</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by reference or amount..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="flex items-center justify-center py-20 flex-col gap-4">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                        <p className="text-slate-400 text-sm">Loading payments...</p>
                    </div>
                ) : filteredPayments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Vendor</th>
                                    <th className="p-4">Bill Ref</th>
                                    <th className="p-4">Method</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredPayments.map((p) => (
                                    <tr key={p.id} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-slate-400">{new Date(p.created_at || p.payment_date || Date.now()).toLocaleDateString()}</td>
                                        <td className="p-4 font-semibold text-white">{p.partner_name || 'Vendor'}</td>
                                        <td className="p-4 text-slate-400 font-mono text-xs">{p.reference || 'N/A'}</td>
                                        <td className="p-4 text-slate-400 capitalize">{p.payment_method?.replace('_', ' ') || 'Bank Transfer'}</td>
                                        <td className="p-4 text-right font-bold text-purple-400">${parseFloat(p.amount).toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            {p.state === 'void' ? (
                                                <span className="px-2 py-1 rounded text-[10px] font-bold border bg-rose-500/10 text-rose-400 border-rose-500/20 uppercase tracking-wider">
                                                    Voided
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-wider">
                                                    Posted
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {p.state !== 'void' && (
                                                <button 
                                                    onClick={() => handleVoid(p.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                                    title="Void Payment"
                                                >
                                                    <Ban size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <PackageOpen size={40} className="mx-auto mb-3 text-slate-700" />
                        <p className="font-bold text-slate-400">No outbound payments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
