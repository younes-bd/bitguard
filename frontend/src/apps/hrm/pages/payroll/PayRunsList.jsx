import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Clock, Search, Filter } from 'lucide-react';
import { hrmService } from '../../../../core/api/hrmService';

const PayRunsList = () => {
    const navigate = useNavigate();
    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRuns = async () => {
            try {
                const data = await hrmService.getPayrollPeriods();
                setRuns(data || []);
            } catch (error) {
                console.error("Failed to fetch pay runs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRuns();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/hrm/payroll')} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase">
                            Pay Runs
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Manage payroll periods and processing</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-bold text-sm">
                    <Plus size={16} />
                    New Pay Run
                </button>
            </div>

            {/* List */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-700/50 flex flex-wrap gap-4 items-center justify-between bg-slate-800/30">
                    <div className="relative flex-1 min-w-[250px] max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search pay runs..." 
                            className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50 text-sm font-medium">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-800/20">
                        <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                            <th className="p-5 border-b border-slate-700/50">Run Name</th>
                            <th className="p-5 border-b border-slate-700/50">Period</th>
                            <th className="p-5 border-b border-slate-700/50">Status</th>
                            <th className="p-5 border-b border-slate-700/50 text-right">Total Amount</th>
                            <th className="p-5 border-b border-slate-700/50"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {runs.map((run) => (
                            <tr key={run.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                                <td className="p-5">
                                    <div className="font-bold text-white">{run.name}</div>
                                    <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{run.start_date} to {run.end_date}</div>
                                </td>
                                <td className="p-5 text-sm text-slate-300 font-medium">{run.name}</td>
                                <td className="p-5">
                                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                        {run.is_processed ? 'Processed' : 'Draft'}
                                    </span>
                                </td>
                                <td className="p-5 text-right font-mono font-bold text-slate-200 text-lg">
                                    ${(run.amount || 0).toLocaleString()}
                                </td>
                                <td className="p-5 text-right">
                                    <button onClick={() => navigate(`/admin/hrm/payroll/runs/${run.id}`)} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold uppercase tracking-wider transition-colors">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayRunsList;
