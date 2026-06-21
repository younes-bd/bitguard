import React, { useState } from 'react';
import { LayoutDashboard, Plus, Clock, CheckCircle } from 'lucide-react';

export default function SprintBoard() {
    const [columns] = useState(['To Do', 'In Progress', 'Review', 'Done']);
    const [tasks] = useState([
        { id: 1, title: 'Setup CI/CD Pipeline', sprint: 'Sprint 4', status: 'In Progress', points: 5, assignee: 'Alice' },
        { id: 2, title: 'Fix Database Migration', sprint: 'Sprint 4', status: 'To Do', points: 3, assignee: 'Bob' },
        { id: 3, title: 'Write API Documentation', sprint: 'Sprint 4', status: 'Review', points: 2, assignee: 'Charlie' },
        { id: 4, title: 'Implement Auth Guards', sprint: 'Sprint 4', status: 'Done', points: 8, assignee: 'Alice' }
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <LayoutDashboard className="text-purple-500" /> Sprint Board
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Active Sprint 4 — Ends in 3 days.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-slate-300">
                        Velocity: 24 pts
                    </div>
                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                        <Plus size={18} /> Add Task
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {columns.map(col => (
                    <div key={col} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-bold text-slate-300">{col}</h3>
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
                                            {task.assignee.charAt(0)}
                                        </div>
                                    </div>
                                    <span className="bg-slate-900 text-purple-400 px-2 py-1 rounded-md border border-slate-700">
                                        {task.points} pts
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
