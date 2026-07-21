import React from 'react';
import { Tag, Plus } from 'lucide-react';

const TicketTypes = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Tag className="text-pink-400" size={28} /> Ticket Types
                    </h1>
                    <p className="text-slate-400">Manage categories and types for incoming tickets.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus size={20} /> Add Type
                </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
                <Tag size={48} className="mx-auto mb-4 text-slate-700" />
                <p className="text-lg">No Ticket Types defined.</p>
                <p className="text-sm mt-2">Create types like 'Bug', 'Question', or 'Feature Request'.</p>
            </div>
        </div>
    );
};

export default TicketTypes;
