import React, { useState, useEffect } from 'react';
import { 
    CheckSquare, Clock, XCircle, Loader2, CheckCircle2, 
    AlertCircle, Search, Filter, MessageSquare, User, 
    Calendar, ArrowRight, ShieldCheck, RefreshCw
} from 'lucide-react';
import client from '../../../core/api/client';

export default function ApprovalsDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');

    const fetchRequests = () => {
        setLoading(true);
        client.get('approvals/requests/')
            .then(res => setRequests(res.data?.results || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, action, comments = "") => {
        setProcessing(id);
        try {
            await client.post(`approvals/requests/${id}/${action}/`, { comments });
            fetchRequests();
        } catch (err) {
            console.error(`${action} failed:`, err);
            alert(`Failed to ${action} request.`);
        } finally {
            setProcessing(null);
        }
    };

    const filteredRequests = requests.filter(r => {
        const matchesSearch = (r.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'expense': return <Clock size={16} className="text-blue-400" />;
            case 'purchase': return <CheckSquare size={16} className="text-purple-400" />;
            case 'leave': return <Calendar size={16} className="text-pink-400" />;
            default: return <AlertCircle size={16} className="text-slate-400" />;
        }
    };

    if (loading && requests.length === 0) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-orange-400" size={40} />
            <p className="text-slate-400 font-medium font-['Inter']">Loading approval queue...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                        <ShieldCheck className="text-orange-500 w-10 h-10" /> 
                        Approval Center
                    </h1>
                    <p className="text-slate-400 mt-2 font-['Inter'] text-lg">Manage and audit enterprise-wide authorization requests and compliance sign-offs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchRequests} 
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900/50 p-4 border border-slate-800 rounded-2xl backdrop-blur-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search requests..."
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-500 shrink-0" />
                    {['pending', 'approved', 'rejected', 'all'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                                statusFilter === status 
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6">
                {filteredRequests.length === 0 ? (
                    <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-20 text-center">
                        <div className="mx-auto w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                            <CheckSquare size={40} className="text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 mb-2">No Requests Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Your approval queue is currently empty for the selected filters.</p>
                        <button 
                            onClick={() => {setSearchTerm(''); setStatusFilter('all');}}
                            className="mt-6 text-orange-400 font-bold hover:underline"
                        >
                            View all history
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.map((r) => (
                            <div 
                                key={r.id} 
                                className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all hover:translate-x-1"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl bg-slate-800 group-hover:bg-slate-700 transition-colors`}>
                                            <CheckSquare className="text-orange-400" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-orange-200 transition-colors">{r.title}</h3>
                                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    {getTypeIcon(r.request_type)}
                                                    {r.request_type}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                    <User size={14} />
                                                    {r.requester_name}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                    <Calendar size={14} />
                                                    {new Date(r.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(r.status)}`}>
                                            {r.status}
                                        </span>
                                        
                                        {r.status === 'pending' && (
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    disabled={processing === r.id}
                                                    onClick={() => handleAction(r.id, 'reject')}
                                                    className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-lg shadow-rose-500/5 active:scale-95 disabled:opacity-50"
                                                    title="Reject"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                                <button 
                                                    disabled={processing === r.id}
                                                    onClick={() => handleAction(r.id, 'approve')}
                                                    className="p-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-lg shadow-emerald-500/5 active:scale-95 disabled:opacity-50"
                                                    title="Approve"
                                                >
                                                    {processing === r.id ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                                </button>
                                            </div>
                                        )}

                                        {r.status !== 'pending' && (
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Decided By</p>
                                                <p className="text-sm text-slate-300 font-medium">{r.decided_by_name || 'System'}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {r.comments && (
                                    <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-start gap-3">
                                        <MessageSquare size={14} className="text-slate-600 mt-1" />
                                        <p className="text-sm text-slate-500 italic">"{r.comments}"</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar Cards - Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1 font-['Inter']">Avg. Response Time</p>
                    <p className="text-3xl font-extrabold text-white tracking-tight font-['Outfit']">4.2h</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1 font-['Inter']">Approval Rate</p>
                    <p className="text-3xl font-extrabold text-white tracking-tight font-['Outfit']">92%</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1 font-['Inter']">compliance Index</p>
                    <p className="text-3xl font-extrabold text-emerald-400 tracking-tight font-['Outfit']">High</p>
                </div>
            </div>
        </div>
    );
}
