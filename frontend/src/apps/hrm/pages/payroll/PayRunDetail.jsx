import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, FileText, Download, PlayCircle } from 'lucide-react';
import { hrmService } from '../../../../core/api/hrmService';

const PayRunDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [run, setRun] = useState(null);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch the payroll period details
                const runData = await hrmService.api.get(`/payroll-periods/${id}/`);
                setRun(runData.data);
                
                // Fetch payslips for this period
                const payslipsData = await hrmService.api.get(`/payslips/?period=${id}`);
                setPayslips(payslipsData.data?.results || payslipsData.data || []);
            } catch (error) {
                console.error("Failed to load pay run details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleProcessPayroll = async () => {
        if (!window.confirm("Process payroll for this period? This will compute taxes, deductions, and finalize payslips for all active employees.")) return;
        
        setProcessing(true);
        try {
            // Trigger the payroll engine endpoint
            await hrmService.api.post(`/payroll-periods/${id}/process/`);
            
            // Refetch payslips
            const payslipsData = await hrmService.api.get(`/payslips/?period=${id}`);
            setPayslips(payslipsData.data?.results || payslipsData.data || []);
            
            // Refetch run data
            const runData = await hrmService.api.get(`/payroll-periods/${id}/`);
            setRun(runData.data);
            
            alert("Payroll processed successfully!");
        } catch (error) {
            console.error("Failed to process payroll", error);
            alert("Error processing payroll.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (!run) return (
        <div className="text-center py-12 text-slate-400">Pay run not found.</div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/hrm/payroll/runs')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Pay Runs</span>
                </button>
                <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50">
                        <Download size={18} />
                        <span>Export Bank File</span>
                    </button>
                    {!run.is_closed && (
                        <button 
                            onClick={handleProcessPayroll}
                            disabled={processing}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/10 font-medium"
                        >
                            {processing ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div> : <PlayCircle size={18} />}
                            <span>{processing ? 'Computing...' : 'Compute Payroll'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Run Details Header */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-wider font-['Oswald']">{run.name}</h2>
                        <p className="text-slate-400 mt-1 font-medium">{run.start_date} to {run.end_date}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${run.is_closed ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-amber-500/20 text-amber-400 border-amber-500/50'}`}>
                        {run.is_closed ? 'Closed & Finalized' : 'Draft / Open'}
                    </span>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 p-6 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total Gross</p>
                        <p className="text-xl text-white font-mono font-medium">${run.total_gross?.toLocaleString() || '0.00'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total Deductions</p>
                        <p className="text-xl text-rose-400 font-mono font-medium">${run.total_deductions?.toLocaleString() || '0.00'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Net Pay</p>
                        <p className="text-xl text-emerald-400 font-mono font-bold">${run.total_net?.toLocaleString() || '0.00'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Employees</p>
                        <p className="text-xl text-white font-mono font-medium">{payslips.length}</p>
                    </div>
                </div>
            </div>

            {/* Payslips List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-5 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Generated Payslips</h3>
                </div>
                
                {payslips.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <FileText size={48} className="mx-auto text-slate-700 mb-4 opacity-50" />
                        <p>No payslips generated for this run.</p>
                        <p className="text-sm mt-2">Click 'Compute Payroll' to generate payslips based on employee contracts.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800/30">
                                <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                    <th className="p-4 pl-6 border-b border-slate-800">Employee</th>
                                    <th className="p-4 border-b border-slate-800 text-right">Basic Pay</th>
                                    <th className="p-4 border-b border-slate-800 text-right">Earnings</th>
                                    <th className="p-4 border-b border-slate-800 text-right">Deductions</th>
                                    <th className="p-4 border-b border-slate-800 text-right">Net Pay</th>
                                    <th className="p-4 border-b border-slate-800 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payslips.map((ps) => (
                                    <tr key={ps.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 pl-6 font-medium text-white text-sm">
                                            {ps.employee_name || `Employee #${ps.employee}`}
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-400 text-sm">
                                            ${Number(ps.basic_salary).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right font-mono text-emerald-400/80 text-sm">
                                            +${Number(ps.total_earnings).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right font-mono text-rose-400/80 text-sm">
                                            -${Number(ps.total_deductions).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right font-mono text-emerald-400 font-bold">
                                            ${Number(ps.net_pay).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${ps.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                                                {ps.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayRunDetail;
