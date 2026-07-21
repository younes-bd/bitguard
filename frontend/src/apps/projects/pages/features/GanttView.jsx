import React, { useState, useEffect } from 'react';
import { GanttChart, Calendar, ChevronLeft, ChevronRight, Layers, Loader2 } from 'lucide-react';
import projectsService from '../../../../core/api/projectsService';
import { toast } from 'react-hot-toast';

export default function GanttView() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await projectsService.getTasks();
            
            // map tasks to Gantt view compatible structure
            const mappedTasks = data.map((task, index) => {
                const start = task.start_date ? new Date(task.start_date) : new Date();
                const end = task.deadline ? new Date(task.deadline) : new Date(start.getTime() + 3 * 24 * 60 * 60 * 1000); // default 3 days if no deadline
                
                // For a simple visual representation, we'll assign pseudo start and duration based on index for now, 
                // in a real app this would calculate exact offsets from a base date.
                const visualStart = Math.max(1, index * 2 + 1);
                const duration = Math.max(2, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
                
                return {
                    id: task.id,
                    name: task.title,
                    start: visualStart > 12 ? (visualStart % 12) + 1 : visualStart,
                    duration: Math.min(duration, 14), // Cap at 14 days for this view
                    color: 'bg-blue-500' // Default color
                };
            });
            
            setTasks(mappedTasks.slice(0, 10)); // Just show first 10 for neatness
        } catch (error) {
            toast.error("Failed to load Gantt data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Create a 14-day timeline grid
    const days = Array.from({ length: 14 }, (_, i) => i + 1);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <GanttChart className="text-blue-500" /> Gantt View
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Timeline and dependencies for project tasks.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white">
                        <ChevronLeft size={18} />
                    </button>
                    <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-white flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500"/> Current View
                    </div>
                    <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-6">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Header Row */}
                        <div className="flex border-b border-slate-800 pb-2 mb-4">
                            <div className="w-64 font-bold text-slate-400 text-sm flex items-center gap-2 uppercase tracking-wider">
                                <Layers size={16}/> Tasks
                            </div>
                            <div className="flex-1 flex">
                                {days.map(day => (
                                    <div key={day} className="flex-1 text-center text-xs font-bold text-slate-500 border-l border-slate-800/50">
                                        Day {day}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Task Rows */}
                        <div className="space-y-4">
                            {tasks.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">No tasks available for timeline.</div>
                            ) : (
                                tasks.map(task => (
                                    <div key={task.id} className="flex items-center group">
                                        <div className="w-64 font-medium text-slate-300 text-sm pr-4 truncate group-hover:text-white transition-colors" title={task.name}>
                                            {task.name}
                                        </div>
                                        <div className="flex-1 relative h-8 bg-slate-950/50 rounded-lg flex border border-slate-800/30">
                                            {days.map(day => (
                                                <div key={day} className="flex-1 border-l border-slate-800/30 h-full"></div>
                                            ))}
                                            {/* Task Bar */}
                                            <div 
                                                className={`absolute h-6 top-1 rounded-md shadow-lg flex items-center px-2 text-[10px] font-bold text-white truncate ${task.color}`}
                                                style={{ 
                                                    left: `${((task.start - 1) / 14) * 100}%`,
                                                    width: `${(task.duration / 14) * 100}%` 
                                                }}
                                            >
                                                {task.duration} Days
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
