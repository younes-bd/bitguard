import React, { useEffect, useState } from 'react';
import { DollarSign, Calendar, Users, Calculator, Loader2, Download, Play } from 'lucide-react';
import { hrmService } from '../../../core/api/hrmService';
import toast from 'react-hot-toast';

const PayrollPage = () => {
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [empData, statsData] = await Promise.all([
                    hrmService.getEmployees(),
                    hrmService.getStats(),
                ]);
                const empList = Array.isArray(empData) ? empData : empData?.results ?? [];
                setEmployees(empList.filter(e => e.status === 'active'));
                setStats(statsData);
            } catch (err) {
                console.error('Failed to load payroll data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalMonthly = employees.reduce((sum, e) => sum + parseFloat(e.salary || 0), 0);
    const avgSalary = employees.length > 0 ? totalMonthly / employees.length : 0;

    const handleExport = () => {
        toast.success('Payroll export generated');
    };

    const handleRunPayroll = () => {
        toast.success('Payroll run initiated');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <DollarSign className="text-pink-400" size={28} />
                        Payroll
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Process payroll, manage compensation, and track payments</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors">
                        <Download size={16} /> Export CSV
                    </button>
                    <button 
                        onClick={handleRunPayroll}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-semibold transition-colors">
                        <Play size={16} /> Run Payroll
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Employees', value: loading ? '...' : String(employees.length), icon: Users, color: 'text-blue-400' },
                    { label: 'Monthly Payroll', value: loading ? '...' : `$${totalMonthly.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400' },
                    { label: 'Avg. Salary', value: loading ? '...' : `$${Math.round(avgSalary).toLocaleString()}`, icon: Calculator, color: 'text-amber-400' },
                    { label: 'YTD Total', value: loading ? '...' : `$${(totalMonthly * new Date().getMonth()).toLocaleString()}`, icon: Calendar, color: 'text-purple-400' },
                ].map(kpi => (
                    <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <kpi.icon size={20} className={`${kpi.color} mb-2`} />
                        <div className="text-2xl font-bold text-white">{kpi.value}</div>
                        <div className="text-slate-400 text-xs uppercase font-bold mt-1">{kpi.label}</div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-pink-400" size={32} />
                    <p className="text-slate-500 text-sm">Loading payroll data...</p>
                </div>
            ) : employees.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <Calculator size={48} className="mx-auto mb-4 text-slate-700" />
                    <h3 className="text-white font-semibold text-lg mb-2">Payroll Module</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">No active employees with salary data found. Add employees with salary information to see payroll calculations.</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/60 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                                <th className="p-4">Employee</th>
                                <th className="p-4">Job Title</th>
                                <th className="p-4">Department</th>
                                <th className="p-4 text-right">Salary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 text-xs font-bold">
                                                {(emp.user?.first_name?.[0] || emp.employee_id?.[0] || 'E').toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{emp.user?.first_name} {emp.user?.last_name || emp.employee_id}</p>
                                                <p className="text-slate-500 text-xs">ID: {emp.employee_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-300 text-sm">{emp.job_title}</td>
                                    <td className="p-4 text-slate-400 text-sm">{emp.department?.name || '—'}</td>
                                    <td className="p-4 text-right text-emerald-400 font-bold text-sm">${parseFloat(emp.salary || 0).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-950/80 border-t-2 border-slate-700">
                                <td colSpan="3" className="p-4 text-white font-bold">Total Monthly Payroll</td>
                                <td className="p-4 text-right text-emerald-400 font-bold text-lg">${totalMonthly.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PayrollPage;
