import React from 'react';
import { LayoutDashboard, Plus } from 'lucide-react';

export default function AppointmentsSettings() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <LayoutDashboard className="text-blue-500" />
                        Appointments Settings
                    </h1>
                    <p className="text-slate-400 mt-1">configure appointment types and availability</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <Plus size={20} />
                    New Action
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                    <LayoutDashboard className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Appointments Settings Workspace</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    This section is currently under construction. configure appointment types and availability.
                </p>
            </div>
        </div>
    );
}
