import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { hrService } from '../../api/hrService';
import toast from 'react-hot-toast';
import client from '@/core/api/client';

export default function MyPayslips() {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayslips();
    }, []);

    const fetchPayslips = async () => {
        try {
            setLoading(true);
            // PayslipViewSet filters by tenant, but we should also ideally filter by employee in the backend or here.
            // For now, assuming standard REST API structure.
            const response = await client.get('hrm/payslips/');
            setPayslips(response.data?.results || response.data?.data || response.data || []);
        } catch (err) {
            toast.error('Failed to load payslips');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            await hrService.downloadDocument('hr_payroll.Payslip', id);
        } catch (err) {
            toast.error('Failed to download payslip');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <FileText className="text-emerald-400" size={28} />
                    My Payslips
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">View and download your monthly salary slips</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-medium">Period</th>
                            <th className="p-4 font-medium">Reference</th>
                            <th className="p-4 font-medium">Net Salary</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading payslips...</td></tr>
                        ) : payslips.map(ps => (
                            <tr key={ps.id} className="hover:bg-slate-800/30">
                                <td className="p-4 text-sm text-slate-300">
                                    {ps.date_from} to {ps.date_to}
                                </td>
                                <td className="p-4 text-sm font-medium text-white">{ps.reference || `SLIP-${ps.id}`}</td>
                                <td className="p-4 text-sm font-medium text-emerald-400">${parseFloat(ps.net_salary || 0).toFixed(2)}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${ps.state === 'done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                        {ps.state?.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 flex justify-end">
                                    <button onClick={() => handleDownload(ps.id)} className="p-2 text-slate-400 hover:text-emerald-400 transition-colors" title="Download PDF">
                                        <Download size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && payslips.length === 0 && (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-500">No payslips available.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
