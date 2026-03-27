import React from 'react';
import { CheckSquare, Clock, AlertCircle, CheckCircle2, XCircle, FileText, ShoppingCart, Calendar } from 'lucide-react';

const MOCK_APPROVALS = [
    { id: 1, type: 'Purchase Order', title: 'PO-2026-042 — Dell Server Rack', requester: 'John Admin', amount: '$12,500', status: 'pending', date: '2026-03-20' },
    { id: 2, type: 'Leave Request', title: '5 Days PTO — March 24-28', requester: 'Sarah Chen', amount: null, status: 'pending', date: '2026-03-19' },
    { id: 3, type: 'Expense', title: 'Client dinner — $245.50', requester: 'Mike Johnson', amount: '$245.50', status: 'pending', date: '2026-03-18' },
    { id: 4, type: 'Quote', title: 'QT-2026-018 — Enterprise Security Package', requester: 'Emma Davis', amount: '$48,000', status: 'approved', date: '2026-03-15' },
    { id: 5, type: 'Change Request', title: 'CR-042 — Firewall rule update', requester: 'Admin', amount: null, status: 'rejected', date: '2026-03-12' },
];

const STATUS_MAP = {
    pending: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
    approved: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    rejected: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
};

const TYPE_ICONS = { 'Purchase Order': '🛒', 'Leave Request': '🏖️', Expense: '💰', Quote: '📋', 'Change Request': '🔄' };

const ApprovalsDashboard = () => {
    const pending = MOCK_APPROVALS.filter(a => a.status === 'pending');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <CheckSquare className="text-amber-400" size={28} />
                    Approval Center
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Review and process pending approval requests across the platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Pending</div>
                    <div className="text-3xl font-bold text-amber-400">{pending.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Approved (30d)</div>
                    <div className="text-3xl font-bold text-emerald-400">{MOCK_APPROVALS.filter(a => a.status === 'approved').length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Rejected (30d)</div>
                    <div className="text-3xl font-bold text-red-400">{MOCK_APPROVALS.filter(a => a.status === 'rejected').length}</div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                    <h3 className="text-white font-semibold">All Requests</h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Type', 'Request', 'Requester', 'Amount', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_APPROVALS.map(a => {
                            const st = STATUS_MAP[a.status];
                            return (
                                <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                    <td className="px-5 py-4"><span className="text-lg mr-1">{TYPE_ICONS[a.type]}</span><span className="text-slate-400 text-xs">{a.type}</span></td>
                                    <td className="px-5 py-4 text-white font-medium">{a.title}</td>
                                    <td className="px-5 py-4 text-slate-400">{a.requester}</td>
                                    <td className="px-5 py-4 text-white font-mono">{a.amount || '—'}</td>
                                    <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${st.color}`}>{a.status}</span></td>
                                    <td className="px-5 py-4">
                                        {a.status === 'pending' ? (
                                            <div className="flex gap-2">
                                                <button className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors">Approve</button>
                                                <button className="px-2 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded text-xs font-semibold transition-colors">Reject</button>
                                            </div>
                                        ) : <span className="text-slate-600 text-xs">—</span>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovalsDashboard;
