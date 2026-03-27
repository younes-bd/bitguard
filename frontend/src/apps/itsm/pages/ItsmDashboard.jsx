import React from 'react';
import { GitBranch, Clock, AlertCircle, CheckCircle2, Settings, Search } from 'lucide-react';

const MOCK_CHANGES = [
    { id: 'CR-001', title: 'Firewall rule update — Allow port 8443', severity: 'high', status: 'pending_review', requester: 'Admin', date: '2026-03-20', affected: 'All production servers' },
    { id: 'CR-002', title: 'DNS record change — api.bitguard.tech', severity: 'medium', status: 'approved', requester: 'DevOps Team', date: '2026-03-18', affected: 'DNS infrastructure' },
    { id: 'CR-003', title: 'Add new VLAN for IoT devices', severity: 'low', status: 'implemented', requester: 'Network Admin', date: '2026-03-15', affected: 'Network switches L2-L4' },
    { id: 'CR-004', title: 'Upgrade database to PostgreSQL 16', severity: 'high', status: 'pending_review', requester: 'DBA', date: '2026-03-12', affected: 'Production database cluster' },
];

const STATUS_MAP = {
    pending_review: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Pending Review' },
    approved: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Approved' },
    implemented: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Implemented' },
    rejected: { color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Rejected' },
};

const SEVERITY_MAP = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const ItsmDashboard = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <GitBranch className="text-indigo-400" size={28} />
                Change Management
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">ITSM change request tracking, reviews, and implementation governance</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
                { label: 'Open Requests', value: MOCK_CHANGES.filter(c => c.status !== 'implemented').length, color: 'text-amber-400' },
                { label: 'Pending Review', value: MOCK_CHANGES.filter(c => c.status === 'pending_review').length, color: 'text-blue-400' },
                { label: 'Implemented (30d)', value: MOCK_CHANGES.filter(c => c.status === 'implemented').length, color: 'text-emerald-400' },
                { label: 'High Severity', value: MOCK_CHANGES.filter(c => c.severity === 'high').length, color: 'text-red-400' },
            ].map(kpi => (
                <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">{kpi.label}</div>
                    <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                </div>
            ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-semibold">Change Requests</h3>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-800">
                        {['ID', 'Change Request', 'Severity', 'Affected', 'Status', 'Requester', 'Date'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {MOCK_CHANGES.map(cr => {
                        const st = STATUS_MAP[cr.status] || STATUS_MAP.pending_review;
                        return (
                            <tr key={cr.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                                <td className="px-5 py-4 text-white font-mono">{cr.id}</td>
                                <td className="px-5 py-4 text-white font-medium">{cr.title}</td>
                                <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${SEVERITY_MAP[cr.severity]}`}>{cr.severity}</span></td>
                                <td className="px-5 py-4 text-slate-400 text-xs">{cr.affected}</td>
                                <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${st.color}`}>{st.label}</span></td>
                                <td className="px-5 py-4 text-slate-400">{cr.requester}</td>
                                <td className="px-5 py-4 text-slate-500 text-xs">{cr.date}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

export default ItsmDashboard;
