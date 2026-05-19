import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Search, FileText, CheckCircle, AlertTriangle, XCircle, User } from 'lucide-react';
import client from '../../../core/api/client';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
    compliant: { label: 'Compliant', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
    partial: { label: 'Partial', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: AlertTriangle },
    non_compliant: { label: 'Non-Compliant', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: XCircle },
    na: { label: 'N/A', color: 'text-slate-400 bg-slate-800 border-slate-700', icon: FileText }
};

export default function ComplianceRegister() {
    const [frameworks, setFrameworks] = useState([]);
    const [controls, setControls] = useState([]);
    const [activeFramework, setActiveFramework] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch frameworks and controls (simulate with dummy list if no backend yet)
        Promise.all([
            client.get('soc/compliance-frameworks/'),
            client.get('soc/compliance-controls/')
        ]).then(([fwRes, ctrlRes]) => {
            const fws = fwRes.data?.results || fwRes.data || [];
            setFrameworks(fws);
            setControls(ctrlRes.data?.results || ctrlRes.data || []);
            if (fws.length > 0 && !activeFramework) setActiveFramework(fws[0].id);
        }).finally(() => setLoading(false));
    }, []);

    const handleUpdateStatus = async (controlId, newStatus) => {
        try {
            await client.patch(`soc/compliance-controls/${controlId}/`, { status: newStatus });
            setControls(controls.map(c => c.id === controlId ? { ...c, status: newStatus } : c));
            toast.success('Status updated');
        } catch {
            toast.error('Failed to update control status');
        }
    };

    const activeControls = controls.filter(c => c.framework_id === activeFramework);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading compliance frameworks...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <ShieldCheck className="text-indigo-400" size={28} /> Compliance Center
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage and track security frameworks and controls</p>
                </div>
            </div>

            {/* Framework Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {frameworks.map(fw => (
                    <div key={fw.id} onClick={() => setActiveFramework(fw.id)}
                        className={`bg-slate-900 border rounded-2xl p-5 cursor-pointer transition-all ${activeFramework === fw.id ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <h3 className={`font-bold ${activeFramework === fw.id ? 'text-white' : 'text-slate-400'}`}>{fw.name}</h3>
                            <span className="text-lg font-black text-white">{fw.compliance_pct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full transition-all ${fw.compliance_pct >= 80 ? 'bg-emerald-500' : fw.compliance_pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${fw.compliance_pct}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                    <h2 className="text-sm font-bold text-white">Framework Controls</h2>
                    <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Export Report</button>
                </div>
                {activeControls.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                        No controls mapped for this framework yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800/50">
                        {activeControls.map(ctrl => {
                            const sc = STATUS_CONFIG[ctrl.status] || STATUS_CONFIG.na;
                            const Icon = sc.icon;
                            return (
                                <div key={ctrl.id} className="p-5 hover:bg-slate-800/30 transition-colors group">
                                    <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-slate-500 px-1.5 py-0.5 bg-slate-800 rounded">{ctrl.identifier}</span>
                                                <h4 className="text-white font-medium text-sm">{ctrl.title}</h4>
                                            </div>
                                            <p className="text-slate-400 text-xs mb-3 leading-relaxed max-w-3xl">{ctrl.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><User size={12} /> {ctrl.owner || 'Unassigned'}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> Last Reviewed: {ctrl.last_reviewed || 'Never'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <select value={ctrl.status} onChange={e => handleUpdateStatus(ctrl.id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none text-center ${sc.color}`}>
                                                <option value="compliant" className="bg-slate-900 text-emerald-400">Compliant</option>
                                                <option value="partial" className="bg-slate-900 text-amber-400">Partial</option>
                                                <option value="non_compliant" className="bg-slate-900 text-rose-400">Non-Compliant</option>
                                                <option value="na" className="bg-slate-900 text-slate-400">N/A</option>
                                            </select>
                                            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100">
                                                Upload Evidence
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
