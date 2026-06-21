import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Printer, Download, Mail, CheckCircle, Wallet
} from 'lucide-react';

const PayslipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data
    const payslip = {
        id: 1,
        employee_name: "Sarah Jenkins",
        employee_id: "EMP-0042",
        department: "Engineering",
        role: "Senior Full Stack Developer",
        period: "March 2026",
        pay_date: "2026-03-31",
        status: "paid",
        earnings: [
            { description: "Basic Salary", amount: 8500.00, ytd: 25500.00 },
            { description: "Housing Allowance", amount: 1500.00, ytd: 4500.00 },
            { description: "Transport Allowance", amount: 500.00, ytd: 1500.00 },
            { description: "Performance Bonus", amount: 1200.00, ytd: 1200.00 }
        ],
        deductions: [
            { description: "Income Tax (PAYE)", amount: 2150.00, ytd: 6450.00 },
            { description: "Health Insurance", amount: 250.00, ytd: 750.00 },
            { description: "Pension Contribution", amount: 425.00, ytd: 1275.00 }
        ],
        totals: {
            gross_pay: 11700.00,
            total_deductions: 2825.00,
            net_pay: 8875.00
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/hrm/payroll')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Pay Runs</span>
                </button>
                <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50">
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button 
                        onClick={() => {
                            import('../../../../core/api/reportingService').then(({ default: reportingService }) => {
                                reportingService.generateReport(null, 'hrm.Payslip', id).then(res => {
                                    if (res && res.file) window.open(res.file, '_blank');
                                }).catch(err => alert("Failed to generate payslip."));
                            });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50"
                    >
                        <Download size={18} />
                        <span>PDF Download</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-medium">
                        <Mail size={18} />
                        <span>Email to Employee</span>
                    </button>
                </div>
            </div>

            {/* Document Paper */}
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                {/* Header Decoration */}
                <div className="h-2 w-full bg-indigo-500"></div>
                
                {/* Brand & Type */}
                <div className="p-12 flex justify-between items-start border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">B</div>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">BITGUARD</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-1 uppercase tracking-tighter">
                            Payslip
                        </h1>
                        <div className="text-slate-400 font-bold uppercase tracking-widest">{payslip.period}</div>
                    </div>
                    <div className="text-right space-y-1">
                        <div className="text-slate-500 text-sm uppercase font-bold tracking-widest">Employer</div>
                        <div className="font-bold text-slate-900">BitGuard Enterprise Solutions</div>
                        <div className="text-slate-500 text-sm leading-relaxed">
                            123 Innovation Drive, Level 42<br />
                            Silicon Valley, CA 94025<br />
                            Tax ID: US994455221
                        </div>
                    </div>
                </div>

                {/* Employee Details Grid */}
                <div className="p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 bg-slate-50/50 border-b border-slate-100">
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-[0.2em]">Employee Name</div>
                        <div className="font-bold text-slate-900">{payslip.employee_name}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-[0.2em]">Employee ID</div>
                        <div className="font-bold text-slate-900">{payslip.employee_id}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-[0.2em]">Department</div>
                        <div className="font-bold text-slate-900">{payslip.department}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-[0.2em]">Role / Designation</div>
                        <div className="font-bold text-slate-900">{payslip.role}</div>
                    </div>
                </div>

                {/* Salary Tables */}
                <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-slate-100">
                    {/* Earnings */}
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Wallet size={16} className="text-indigo-500" />
                            Earnings
                        </h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest">
                                    <th className="pb-4">Description</th>
                                    <th className="pb-4 text-right">Amount</th>
                                    <th className="pb-4 text-right text-slate-400">YTD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payslip.earnings.map((e, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        <td className="py-4 font-bold text-sm text-slate-700">{e.description}</td>
                                        <td className="py-4 text-right font-mono text-sm">${e.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="py-4 text-right font-mono text-xs text-slate-400">${e.ytd.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="pt-6 font-black text-slate-900 uppercase tracking-widest text-xs">Gross Earnings</td>
                                    <td className="pt-6 text-right font-mono font-bold text-slate-900">${payslip.totals.gross_pay.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="pt-6"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Deductions */}
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ArrowLeft size={16} className="text-red-500 rotate-45" />
                            Deductions
                        </h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest">
                                    <th className="pb-4">Description</th>
                                    <th className="pb-4 text-right">Amount</th>
                                    <th className="pb-4 text-right text-slate-400">YTD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payslip.deductions.map((d, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        <td className="py-4 font-bold text-sm text-slate-700">{d.description}</td>
                                        <td className="py-4 text-right font-mono text-sm">${d.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="py-4 text-right font-mono text-xs text-slate-400">${d.ytd.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="pt-6 font-black text-slate-900 uppercase tracking-widest text-xs">Total Deductions</td>
                                    <td className="pt-6 text-right font-mono font-bold text-slate-900">${payslip.totals.total_deductions.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="pt-6"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Net Pay */}
                <div className="bg-slate-50 p-12 flex flex-col items-end border-b border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Pay (Take Home)</div>
                    <div className="text-5xl font-black font-mono text-slate-900 mb-2">
                        ${payslip.totals.net_pay.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle size={14} /> Direct Deposit Processed
                    </div>
                </div>

                {/* Secure Footer */}
                <div className="p-8 flex justify-between items-center bg-white text-slate-400">
                    <div className="text-xs max-w-lg leading-relaxed">
                        This is a computer-generated document. For any discrepancies, please contact the HR/Payroll department immediately at hr@bitguard.tech.
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest">
                        Confidential
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayslipDetail;
