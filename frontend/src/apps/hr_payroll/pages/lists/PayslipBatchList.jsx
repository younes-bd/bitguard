import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Calendar, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PayslipBatchList() {
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBatches();
    }, []);

    const loadBatches = async () => {
        try {
            const data = await accountingService.get('hrm/payslip-batches');
            setBatches(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            toast.error("Failed to load payslip batches");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'draft': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
            case 'verify': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
            case 'close': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="text-blue-500" /> Payslip Batches
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Manage payroll runs and generate payslips</p>
                </div>
                <button 
                    onClick={() => toast('Create batch coming soon')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} /> New Batch
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Date Start</th>
                            <th className="px-6 py-4">Date End</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8">
                                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div></div>
                                </td>
                            </tr>
                        ) : batches.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-slate-500">No batches found.</td></tr>
                        ) : batches.map(batch => (
                            <tr key={batch.id} className="hover:bg-slate-800/20 transition-colors cursor-pointer group" onClick={() => navigate(`/hrm/payroll/batches/${batch.id}`)}>
                                <td className="px-6 py-4 font-bold text-white">
                                    {batch.name}
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2 text-slate-400">
                                    <Calendar size={14} className="text-slate-500"/>
                                    {batch.date_start}
                                </td>
                                <td className="px-6 py-4">
                                    {batch.date_end}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(batch.state)}`}>
                                        {batch.state.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-500 hover:text-blue-500 transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
