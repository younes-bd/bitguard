import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const TodoDashboard = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <LayoutDashboard className="text-blue-500" size={32} />
                        To-Do Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2">Welcome to the To-Do application.</p>
                </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                To-Do is currently under construction.
            </div>
        </div>
    );
};

export default TodoDashboard;
