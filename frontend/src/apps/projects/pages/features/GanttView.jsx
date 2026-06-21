import React, { useState } from 'react';
import { GanttChart, Calendar, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function GanttView() {
    const [tasks] = useState([
        { id: 1, name: 'Phase 1: Architecture', start: 1, duration: 3, color: 'bg-blue-500' },
        { id: 2, name: 'Database Setup', start: 3, duration: 2, color: 'bg-purple-500' },
        { id: 3, name: 'Backend API', start: 5, duration: 5, color: 'bg-emerald-500' },
        { id: 4, name: 'Frontend UI', start: 7, duration: 4, color: 'bg-orange-500' },
        { id: 5, name: 'Testing & QA', start: 10, duration: 3, color: 'bg-rose-500' }
    ]);

    // Create a 14-day timeline grid
    const days = Array.from({ length: 14 }, (_, i) => i + 1);

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
                        <Calendar size={16} className="text-blue-500"/> June 2026
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
                            {tasks.map(task => (
                                <div key={task.id} className="flex items-center group">
                                    <div className="w-64 font-medium text-slate-300 text-sm pr-4 truncate group-hover:text-white transition-colors">
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
