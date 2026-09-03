import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, RefreshCcw, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PayslipBatchDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [batch, setBatch] = useState(null);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const batchData = await accountingService.get(`hrm/payslip-batches/${id}`);
            setBatch(batchData);
            
            const payslipsData = await accountingService.get(`hrm/payslips`, { batch: id });
            setPayslips(Array.isArray(payslipsData) ? payslipsData : payslipsData.results || []);
        } catch (error) {
            toast.error("Failed to load batch details");
        } finally {
            setLoading(false);
        }
    };

    const generatePayslips = async () => {
        if (!batch) return;
        try {
            setGenerating(true);
            const response = await accountingService.post(`hrm/payslip-batches/${id}/generate_payslips`);
            if (response.status === 'success') {
                toast.success(response.message || "Payslips generated successfully");
                await loadData();
            } else {
                toast.error(response.error || "Failed to generate payslips");
            }
        } catch (error) {
            toast.error("Failed to generate payslips");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div></div>;
    if (!batch) return <div className="text-center p-12 text-slate-400">Batch not found</div>;

    const totalNet = payslips.reduce((s, p) => s + parseFloat(p.net_salary || 0), 0);

    return (
        <div className="space-y-6">
            <div>
                <button
                    onClick={() => navigate('/hrm/payroll/batches')}
                    className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Batches
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{batch.name}</h1>
                        <p className="text-slate-400 text-sm">
                            Period: {batch.date_start} to {batch.date_end}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${batch.state === 'draft' ? 'bg-slate-500/20 text-slate-400 border-slate-500/50' : 'bg-amber-500/20 text-amber-400 border-amber-500/50'}`}>
                            {batch.state.toUpperCase()}
                        </span>
                        {batch.state !== 'close' && (
                            <button 
                                onClick={generatePayslips}
                                disabled={generating}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {generating ? <RefreshCcw size={18} className="animate-spin" /> : <FileText size={18} />} 
                                {generating ? 'Generating...' : 'Generate Payslips'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-2">
                    <p className="text-slate-400 text-sm font-bold">Total Payslips</p>
                    <h2 className="text-3xl font-black text-white">{payslips.length}</h2>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-2">
                    <p className="text-slate-400 text-sm font-bold">Total Net Pay</p>
                    <h2 className="text-3xl font-black text-emerald-400 flex items-center">
                        <DollarSign size={24} className="mr-1"/>
                        {totalNet.toLocaleString()}
                    </h2>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-2">
                    <p className="text-slate-400 text-sm font-bold">Action Needed</p>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-2">
                        {batch.state === 'draft' && "Generate Payslips"}
                        {batch.state === 'verify' && "Verify & Close Batch"}
                        {batch.state === 'close' && <><CheckCircle className="text-emerald-500"/> Batch Closed</>}
                    </h2>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mt-8">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="font-bold text-white text-lg">Payslips</h3>
                </div>
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Basic</th>
                            <th className="px-6 py-4">Gross</th>
                            <th className="px-6 py-4">Deductions</th>
                            <th className="px-6 py-4">Net Salary</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {payslips.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-slate-500">No payslips generated yet.</td></tr>
                        ) : payslips.map(payslip => (
                            <tr key={payslip.id} className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">Employee #{payslip.employee}</td>
                                <td className="px-6 py-4">${parseFloat(payslip.basic_salary).toLocaleString()}</td>
                                <td className="px-6 py-4">${parseFloat(payslip.gross_salary).toLocaleString()}</td>
                                <td className="px-6 py-4 text-rose-400">${parseFloat(payslip.total_deductions).toLocaleString()}</td>
                                <td className="px-6 py-4 font-bold text-emerald-400">${parseFloat(payslip.net_salary).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-md text-xs font-bold border bg-slate-800 text-slate-400 border-slate-700">
                                        {payslip.state.toUpperCase()}
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
