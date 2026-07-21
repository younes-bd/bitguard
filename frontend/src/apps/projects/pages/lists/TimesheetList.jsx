import React, { useState, useEffect } from 'react';
import { 
    Clock, Search, Filter, Plus, FileSpreadsheet, 
    CheckCircle2, AlertCircle, ChevronDown, Calendar
} from 'lucide-react';
import projectsService from '../../../../core/api/projectsService';
import { toast } from 'react-hot-toast';

export default function TimesheetList() {
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                const data = await projectsService.getTimeLogs();
                setTimesheets(data);
            } catch (error) {
                console.error("Failed to load timesheets", error);
                toast.error("Failed to load timesheets");
            } finally {
                setLoading(false);
            }
        };
        fetchTimesheets();
    }, []);

    const handleBillTime = async (id) => {
        try {
            const res = await projectsService.billTimeLog(id);
            if (res.invoice_id) {
                toast.success("Time billed successfully. Invoice created.");
                setTimesheets(prev => prev.map(t => t.id === id ? { ...t, billed: true } : t));
            }
        } catch (error) {
            toast.error("Failed to bill time log");
        }
    };

    const totalHours = timesheets.reduce((sum, t) => sum + parseFloat(t.hours || 0), 0);
    const billableHours = timesheets.filter(t => t.billable !== false).reduce((sum, t) => sum + parseFloat(t.hours || 0), 0); // Assuming all are billable unless explicitly false or missing

    return (
        <div className="space-y-6">
            {/* Header & KPI */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-cyan-500" /> 
                        Timesheets
                    </h1>
                    <p className="text-slate-400 mt-1">Track billable and non-billable hours across all projects.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg flex items-center gap-2 transition-colors border border-slate-700">
                        <FileSpreadsheet size={16} /> Export
                    </button>
                    <button className="px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-cyan-500/20 font-medium">
                        <Plus size={16} /> Log Hours
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-sm mb-1">Total Hours Logged (This Week)</div>
                    <div className="text-2xl font-bold text-white">{totalHours.toFixed(1)}h</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-sm mb-1">Billable Hours</div>
                    <div className="text-2xl font-bold text-emerald-400">{billableHours.toFixed(1)}h</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-sm mb-1">Pending Approval</div>
                    <div className="text-2xl font-bold text-amber-400">1.0h</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search employee, project, or task..." 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-between gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 hover:border-slate-700">
                        <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-500"/> This Week</span>
                        <ChevronDown size={14} className="text-slate-500"/>
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 hover:border-slate-700">
                        <Filter size={14} className="text-slate-500" /> Filter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Employee</th>
                                <th className="px-6 py-4 font-medium">Project / Task</th>
                                <th className="px-6 py-4 font-medium">Hours</th>
                                <th className="px-6 py-4 font-medium">Billable</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-slate-400">Loading...</td>
                                </tr>
                            ) : timesheets.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-slate-400">No time logs found.</td>
                                </tr>
                            ) : timesheets.filter(t => 
                                (t.user_name || '').toLowerCase().includes(search.toLowerCase()) || 
                                (t.task_title || '').toLowerCase().includes(search.toLowerCase())
                            ).map((row) => (
                                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-slate-300 whitespace-nowrap">{row.date}</td>
                                    <td className="px-6 py-4 font-medium text-white">{row.user_name || 'Unknown'}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-200">{row.task_title || `Task #${row.task}`}</div>
                                        <div className="text-slate-500 text-xs mt-0.5">{row.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-cyan-400 font-mono font-medium">{parseFloat(row.hours).toFixed(1)}</td>
                                    <td className="px-6 py-4">
                                        {row.billable !== false ? (
                                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold tracking-wider rounded-md border border-emerald-500/20">Yes</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider rounded-md border border-slate-700">No</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.status === 'approved' ? (
                                            <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 size={14}/> Approved</span>
                                        ) : row.status === 'rejected' ? (
                                            <span className="flex items-center gap-1.5 text-red-400"><AlertCircle size={14}/> Rejected</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-amber-400"><Clock size={14}/> Pending</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {row.is_billable !== false && !row.billed && (
                                            <button 
                                                onClick={() => handleBillTime(row.id)}
                                                className="mr-3 px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-colors"
                                            >
                                                Bill Time
                                            </button>
                                        )}
                                        <button className="text-slate-400 hover:text-white text-xs font-medium">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

