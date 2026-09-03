import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { projectsService } from '../../../../projects/api/projectsService';
import toast from 'react-hot-toast';

const PortalTimesheets = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                const data = await projectsService.getTimeLogs();
                const items = data?.data || data?.results || data || [];
                setTimesheets(Array.isArray(items) ? items : []);
            } catch (error) {
                toast.error('Failed to load timesheets');
            } finally {
                setLoading(false);
            }
        };
        fetchTimesheets();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">Timesheets</h1>
                    <p className="dark:text-slate-400 text-slate-500">Review logged hours and timesheet entries.</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Project / Task</th>
                            <th className="p-4 font-semibold">Description</th>
                            <th className="p-4 font-semibold">Hours</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading timesheets...
                                </td>
                            </tr>
                        ) : timesheets.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <Clock size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    No timesheets found.
                                </td>
                            </tr>
                        ) : (
                            timesheets.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 text-slate-800 dark:text-slate-200">{log.date || log.created_at?.split('T')[0] || 'N/A'}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800 dark:text-slate-200">{log.project_name || log.project?.name || 'N/A'}</div>
                                        <div className="text-sm text-slate-500">{log.task_name || log.task?.name || ''}</div>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm max-w-[200px] truncate">{log.description || log.notes || 'N/A'}</td>
                                    <td className="p-4 font-mono font-medium text-slate-800 dark:text-slate-200">{parseFloat(log.hours || log.duration || 0).toFixed(2)}h</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            log.is_billed || log.status === 'billed' ? 'bg-emerald-100 text-emerald-700' : 
                                            log.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {log.is_billed ? 'Billed' : (log.status || 'Draft')}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortalTimesheets;

