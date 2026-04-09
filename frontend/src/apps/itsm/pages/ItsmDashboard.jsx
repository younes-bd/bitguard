import React, { useState, useEffect } from 'react';
import { 
    Layers, GitPullRequest, Activity, Loader2, 
    AlertTriangle, CheckCircle2, Clock, Shield, 
    Search, Filter, Plus, ChevronRight, User, 
    Calendar, MoreVertical, RefreshCw, AlertCircle
} from 'lucide-react';
import client from '../../../core/api/client';

export default function ItsmDashboard() {
    const [changes, setChanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const fetchChanges = () => {
        setLoading(true);
        client.get('itsm/changes/')
            .then(res => setChanges(res.data?.results || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchChanges();
    }, []);

    const filteredChanges = changes.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'medium': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-400';
            case 'failed': return 'bg-rose-500/10 text-rose-400';
            case 'in_progress': return 'bg-indigo-500/10 text-indigo-400 animate-pulse';
            case 'approved': return 'bg-blue-500/10 text-blue-400';
            default: return 'bg-slate-800 text-slate-400';
        }
    };

    if (loading && changes.length === 0) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-indigo-400" size={40} />
            <p className="text-slate-400 font-medium font-['Inter']">Synchronizing with Change Advisory Board...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                        <Shield className="text-indigo-500 w-10 h-10" /> 
                        Change Control (ITSM)
                    </h1>
                    <p className="text-slate-400 mt-2 font-['Inter'] text-lg">Formal management of infrastructure modifications, risk assessment, and peer review.</p>
                </div>
                <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
                    <Plus size={20}/> 
                    <span>Submit Change Request</span>
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900/50 p-4 border border-slate-800 rounded-2xl backdrop-blur-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search change directives..."
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-500" />
                    {['all', 'critical', 'high', 'medium'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPriorityFilter(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                                priorityFilter === p 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Change List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredChanges.length === 0 ? (
                    <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-20 text-center">
                        <Activity size={48} className="mx-auto text-slate-700 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400 mb-2">Zero Active Directives</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">All systems are currently operating under approved steady-state configurations.</p>
                    </div>
                ) : (
                    filteredChanges.map((c) => (
                        <div key={c.id} className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-3 rounded-xl bg-slate-800 group-hover:bg-indigo-500/10 transition-colors`}>
                                        <GitPullRequest size={24} className="text-indigo-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                                                {c.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getPriorityStyle(c.priority)}`}>
                                                {c.priority}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm line-clamp-1">{c.description}</p>
                                        
                                        <div className="flex flex-wrap items-center gap-4 mt-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <User size={14} />
                                                {c.requester_name}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 border-l border-slate-800 pl-4">
                                                <Calendar size={14} />
                                                {new Date(c.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 border-l border-slate-800 pl-4">
                                                <AlertTriangle size={14} className={c.risk_level === 'high' ? 'text-orange-500' : 'text-slate-500'} />
                                                {c.risk_level.toUpperCase()} RISK
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(c.status)}`}>
                                        {c.status.replace('_', ' ')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                        <span className="p-2 bg-slate-800 rounded-lg text-indigo-400">
                                            <ChevronRight size={20} />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Risk Indicators */}
                            {c.risk_level === 'high' && (
                                <div className="mt-4 p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-center gap-3">
                                    <AlertCircle size={16} className="text-orange-500 shrink-0" />
                                    <p className="text-xs text-orange-400/80 font-medium">This change requires CAB (Change Advisory Board) quorum approval before execution.</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                    <Activity className="absolute -right-4 -bottom-4 text-indigo-500/5 w-32 h-32 group-hover:scale-110 transition-transform" />
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Change Success Rate</p>
                    <p className="text-4xl font-extrabold text-white tracking-tight font-['Outfit']">98.4%</p>
                    <div className="w-full h-1 bg-slate-800 mt-4 rounded-full overflow-hidden">
                        <div className="w-[98%] h-full bg-indigo-500"></div>
                    </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">MTTR (Change)</p>
                    <p className="text-4xl font-extrabold text-white tracking-tight font-['Outfit']">2.1h</p>
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-bold">
                        <CheckCircle2 size={12} /> -14% from last month
                    </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Pending CAB Reviews</p>
                    <p className="text-4xl font-extrabold text-orange-400 tracking-tight font-['Outfit']">3</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Next CAB session in 14 hours</p>
                </div>
            </div>
        </div>
    );
}
