import React from 'react';
import { Briefcase, Building2, Users } from 'lucide-react';

const ClientDashboard = () => {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Briefcase className="text-indigo-400" size={28} />
                        Client CRM Dashboard
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage accounts, contacts, and opportunities</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <Building2 className="text-indigo-400 mb-4" size={24} />
                    <div className="text-slate-400 text-xs uppercase font-bold">Total Accounts</div>
                    <div className="text-3xl font-bold text-white mt-1">1,204</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <Users className="text-emerald-400 mb-4" size={24} />
                    <div className="text-slate-400 text-xs uppercase font-bold">Active Contacts</div>
                    <div className="text-3xl font-bold text-white mt-1">4,592</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <Briefcase className="text-amber-400 mb-4" size={24} />
                    <div className="text-slate-400 text-xs uppercase font-bold">Open Opportunities</div>
                    <div className="text-3xl font-bold text-white mt-1">142</div>
                </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
                <p className="text-slate-500">Sales pipeline and detailed metrics are being initialized...</p>
            </div>
        </div>
    );
};

export default ClientDashboard;
