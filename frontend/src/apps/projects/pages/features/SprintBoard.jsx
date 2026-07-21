import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Plus, Loader2 } from 'lucide-react';
import projectsService from '../../../../core/api/projectsService';
import { toast } from 'react-hot-toast';

export default function SprintBoard() {
    const [columns] = useState(['todo', 'in_progress', 'review', 'done']);
    const [sprint, setSprint] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const sprints = await projectsService.getSprints({ is_active: true });
            const activeSprint = sprints.length > 0 ? sprints[0] : null;
            setSprint(activeSprint);

            if (activeSprint) {
                const sprintTasks = await projectsService.getTasks({ sprint: activeSprint.id });
                setTasks(sprintTasks || []);
            }
        } catch (error) {
            toast.error("Failed to load sprint board");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-purple-500" size={32} /></div>;

    if (!sprint) return (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-2">No Active Sprint</h2>
            <p className="text-slate-400">Start a sprint in a project to view the sprint board.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <LayoutDashboard className="text-purple-500" /> Sprint Board
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Active Sprint: {sprint.name} — Ends on {new Date(sprint.end_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                        <Plus size={18} /> Add Task
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {columns.map(col => (
                    <div key={col} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-bold text-slate-300 uppercase">{col.replace('_', ' ')}</h3>
                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full font-bold">
                                {tasks.filter(t => t.status === col).length}
                            </span>
                        </div>

                        {tasks.filter(t => t.status === col).map(task => (
                            <div key={task.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-lg hover:border-purple-500/50 transition-colors cursor-pointer group">
                                <h4 className="font-bold text-white mb-2">{task.title}</h4>
                                <div className="flex justify-between items-center mt-4 text-xs font-bold">
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-white border border-slate-600">
                                            {task.assignee_name ? task.assignee_name.charAt(0) : '?'}
                                        </div>
                                    </div>
                                    <span className="bg-slate-900 text-purple-400 px-2 py-1 rounded-md border border-slate-700">
                                        {task.estimated_hours || 0} hrs
                                    </span>
                                </div>
                            </div>
                        ))}

                        <button className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500 font-bold text-sm hover:border-slate-500 hover:text-slate-300 transition-colors flex justify-center items-center gap-2">
                            <Plus size={16}/> Add Task
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
