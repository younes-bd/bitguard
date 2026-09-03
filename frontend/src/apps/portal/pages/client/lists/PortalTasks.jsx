import React, { useState, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import { projectsService } from '../../../../projects/api/projectsService';
import toast from 'react-hot-toast';

const PortalTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await projectsService.getTasks();
                const items = data?.data || data?.results || data || [];
                setTasks(Array.isArray(items) ? items : []);
            } catch (error) {
                toast.error('Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                    <CheckSquare className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">Tasks</h1>
                    <p className="dark:text-slate-400 text-slate-500">Manage your project tasks</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="p-4 font-semibold">Task Name</th>
                            <th className="p-4 font-semibold">Project</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Assignee</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading tasks...
                                </td>
                            </tr>
                        ) : tasks.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <CheckSquare size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    No tasks found.
                                </td>
                            </tr>
                        ) : (
                            tasks.map(task => (
                                <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{task.name || task.title}</td>
                                    <td className="p-4 text-slate-500 text-sm">{task.project_name || task.project?.name || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                                            task.status === 'done' || task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {task.status ? task.status.replace('_', ' ') : 'Todo'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">{task.assignee_name || task.assignee?.name || 'Unassigned'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortalTasks;

