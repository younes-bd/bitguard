import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import hrmService from '../../../core/api/hrmService';

const statusBadge = (status) => {
    const map = {
        pending: 'bg-amber-500/10 text-amber-400',
        approved: 'bg-emerald-500/10 text-emerald-400',
        rejected: 'bg-red-500/10 text-red-400',
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status}</span>;
};

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);

    const fetchLeaves = () => {
        setLoading(true);
        hrmService.getLeaveRequests({ status: filter }).then(d => {
            setLeaves(d?.results ?? d ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchLeaves(); }, [filter]);

    const handleApprove = async (id) => {
        await hrmService.approveLeave(id);
        fetchLeaves();
    };
    const handleReject = async (id) => {
        await hrmService.rejectLeave(id);
        fetchLeaves();
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Leave Management</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Review and approve employee leave requests</p>
                </div>
            </div>
            {/* Status filter tabs */}
            <div className="flex gap-2">
                {['pending', 'approved', 'rejected'].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${filter === s ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                        {s}
                    </button>
                ))}
            </div>
            {/* List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-16 text-slate-500">Loading leave requests...</div>
                ) : leaves.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">No {filter} leave requests</div>
                ) : leaves.map(leave => (
                    <div key={leave.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 font-bold text-sm">
                                {(leave.employee?.first_name?.[0] ?? '?').toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white font-semibold">{leave.employee?.first_name} {leave.employee?.last_name}</p>
                                <p className="text-slate-400 text-xs mt-0.5">
                                    {leave.leave_type ?? leave.type} · {leave.start_date} → {leave.end_date}
                                </p>
                                {leave.reason && <p className="text-slate-500 text-xs mt-1 italic">"{leave.reason}"</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {statusBadge(leave.status)}
                            {leave.status === 'pending' && (
                                <>
                                    <button onClick={() => handleApprove(leave.id)}
                                        className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                        <CheckCircle size={13} /> Approve
                                    </button>
                                    <button onClick={() => handleReject(leave.id)}
                                        className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                        <XCircle size={13} /> Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaveManagement;
