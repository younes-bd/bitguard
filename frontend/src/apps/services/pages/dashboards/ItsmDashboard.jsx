import React, { useState, useEffect } from 'react';
import { 
    Layers, GitPullRequest, Activity, Loader2, 
    AlertTriangle, CheckCircle2, Clock, Shield, 
    Search, Filter, Plus, ChevronRight, User, 
    Calendar, MoreVertical, RefreshCw, AlertCircle,
    FileText, Trash2, XCircle, Play, CheckCircle
} from 'lucide-react';
import serviceService from '../../../../core/api/serviceService';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import { toast } from 'react-hot-toast';

export default function ItsmDashboard() {
    const [changes, setChanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedChange, setSelectedChange] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchChanges = () => {
        setLoading(true);
        serviceService.getChangeRequests()
            .then(data => setChanges(Array.isArray(data) ? data : data.results || []))
            .catch(err => {
                console.error(err);
                toast.error('Failed to sync change database');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchChanges();
    }, []);

    const handleAction = async (actionFn, successMsg) => {
        setActionLoading(true);
        try {
            await actionFn(selectedChange.id);
            toast.success(successMsg);
            const updated = await serviceService.getChangeRequest(selectedChange.id);
            setSelectedChange(updated);
            fetchChanges();
        } catch (err) {
            toast.error('Operation failed');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredChanges = changes.filter(c => {
        const matchesSearch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
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
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'failed': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'rolled_back': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'in_progress': return 'bg-indigo-500/10 text-indigo-400 animate-pulse border-indigo-500/20';
            case 'approved': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'submitted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    if (loading && changes.length === 0) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-indigo-400" size={40} />
            <p className="text-slate-400 font-medium font-['Inter']">Synchronizing with Change Advisory Board...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                        <Shield className="text-indigo-500 w-10 h-10" /> 
                        Change Control (ITSM)
                    </h1>
                    <p className="text-slate-400 mt-2 font-['Inter'] text-lg">Formal management of infrastructure modifications, risk assessment, and peer review.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
                    <Plus size={20}/> 
                    <span>Submit Change Request</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Changes', value: changes.length, color: 'slate', icon: Layers },
                    { label: 'In Flight', value: changes.filter(c => ['submitted', 'approved', 'in_progress'].includes(c.status)).length, color: 'indigo', icon: Activity },
                    { label: 'Completed', value: changes.filter(c => c.status === 'completed').length, color: 'emerald', icon: CheckCircle2 },
                    { label: 'High Risk', value: changes.filter(c => c.risk_level === 'high').length, color: 'orange', icon: AlertTriangle },
                ].map(stat => (
                    <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-500`}><stat.icon size={20} /></div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
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
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    <Filter size={16} className="text-slate-500 shrink-0" />
                    {['all', 'critical', 'high', 'medium'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPriorityFilter(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
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
                        <div key={c.id} 
                            onClick={() => setSelectedChange(c)}
                            className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${
                                c.priority === 'critical' ? 'bg-red-500' : 
                                c.priority === 'high' ? 'bg-orange-500' : 'bg-indigo-500/50'
                            }`} />
                            
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
                                                {(c.risk_level || 'low').toUpperCase()} RISK
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(c.status)}`}>
                                        {c.status.replace('_', ' ')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="p-2 bg-slate-800 rounded-lg text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <ChevronRight size={20} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail View Modal */}
            {selectedChange && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl h-fit">
                                    <GitPullRequest size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-bold text-white uppercase font-['Outfit']">{selectedChange.title}</h2>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(selectedChange.status)}`}>
                                            {selectedChange.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm">Initiated by {selectedChange.requester_name} on {new Date(selectedChange.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedChange(null)} className="text-slate-500 hover:text-white transition-colors">
                                <XCircle size={28} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto space-y-8 flex-1 scrollbar-hide">
                            {/* Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Priority</p>
                                    <p className={`font-bold capitalize ${selectedChange.priority === 'critical' ? 'text-red-400' : 'text-white'}`}>{selectedChange.priority}</p>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Risk Assessment</p>
                                    <p className={`font-bold capitalize ${selectedChange.risk_level === 'high' ? 'text-orange-400' : 'text-white'}`}>{selectedChange.risk_level} Risk</p>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Scheduled Window</p>
                                    <p className="font-bold text-white">{selectedChange.scheduled_date ? new Date(selectedChange.scheduled_date).toLocaleDateString() : 'ASAP'}</p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-slate-400 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-widest"><FileText size={16}/> Description</h4>
                                    <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {selectedChange.description}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-emerald-400/80 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-widest"><Activity size={16}/> Implementation Plan</h4>
                                        <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10 text-slate-300 leading-relaxed min-h-[100px]">
                                            {selectedChange.implementation_plan || 'No implementation steps documented.'}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-amber-400/80 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-widest"><RefreshCw size={16}/> Rollback Strategy</h4>
                                        <div className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/10 text-slate-300 leading-relaxed min-h-[100px]">
                                            {selectedChange.rollback_plan || 'No contingency plan documented.'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tasks Section */}
                            <div>
                                <h4 className="text-indigo-400 font-bold mb-4 flex items-center justify-between text-xs uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Layers size={16}/> Execution Tasks ({selectedChange.tasks?.length || 0})</span>
                                </h4>
                                <div className="space-y-2">
                                    {selectedChange.tasks?.length === 0 ? (
                                        <p className="text-slate-600 text-sm italic py-4">No tasks associated with this directive.</p>
                                    ) : (
                                        selectedChange.tasks.map(task => (
                                            <div key={task.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                                                    <span className={`text-sm ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{task.title}</span>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{task.assignee_name || 'Unassigned'}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Action Buttons */}
                        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex gap-3">
                                {selectedChange.status === 'draft' && (
                                    <button 
                                        onClick={() => handleAction(serviceService.submit, 'Change submitted for review')}
                                        disabled={actionLoading}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        <Play size={18} /> Submit for Review
                                    </button>
                                )}
                                
                                {selectedChange.status === 'submitted' && (
                                    <>
                                        <button 
                                            onClick={() => handleAction(serviceService.approve, 'Change approved by CAB')}
                                            disabled={actionLoading}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                                        >
                                            <CheckCircle size={18} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(serviceService.reject, 'Change request rejected')}
                                            disabled={actionLoading}
                                            className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </>
                                )}

                                {selectedChange.status === 'approved' && (
                                    <button 
                                        onClick={() => handleAction(serviceService.startWork, 'Implementation started')}
                                        disabled={actionLoading}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                                    >
                                        <Play size={18} /> Start Implementation
                                    </button>
                                )}

                                {selectedChange.status === 'in_progress' && (
                                    <>
                                        <button 
                                            onClick={() => handleAction(serviceService.complete, 'Change successfully completed')}
                                            disabled={actionLoading}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                                        >
                                            <CheckCircle size={18} /> Complete
                                        </button>
                                        <button 
                                            onClick={() => handleAction(serviceService.fail, 'Change marked as failed')}
                                            disabled={actionLoading}
                                            className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                                        >
                                            <AlertTriangle size={18} /> Mark Failed
                                        </button>
                                    </>
                                )}

                                {selectedChange.status === 'failed' && (
                                    <button 
                                        onClick={() => handleAction(serviceService.rollback, 'Rollback protocol initiated')}
                                        disabled={actionLoading}
                                        className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                                    >
                                        <RefreshCw size={18} /> Rollback
                                    </button>
                                )}
                            </div>
                            
                            <button className="text-slate-500 hover:text-red-400 p-2 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <GenericModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="New Change Request"
                fields={CHANGE_FIELDS}
                initialData={null}
                onSubmit={async (formData) => {
                    setActionLoading(true);
                    try {
                        await serviceService.createChangeRequest(formData);
                        setIsCreateModalOpen(false);
                        toast.success('Change request created');
                        fetchChanges();
                    } catch (err) {
                        toast.error('Failed to submit change request');
                        console.error(err);
                    } finally {
                        setActionLoading(false);
                    }
                }}
                loading={actionLoading}
            />
        </div>
    );
}

const CHANGE_FIELDS = [
    { name: 'title', label: 'Title', required: true, placeholder: 'e.g., Database Schema Upgrade v2.1' },
    { name: 'description', label: 'Overview & Rationale', type: 'textarea', required: true, rows: 3, placeholder: 'Why is this change necessary?' },
    { name: 'priority', label: 'Priority', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' },
    ], default: 'medium' },
    { name: 'risk_level', label: 'Risk Assessment', type: 'select', options: [
        { value: 'low', label: 'Low Risk' },
        { value: 'medium', label: 'Medium Risk' },
        { value: 'high', label: 'High Risk' },
    ], default: 'medium' },
    { name: 'implementation_plan', label: 'Implementation Plan', type: 'textarea', rows: 4, placeholder: 'Step-by-step technical implementation guide...' },
    { name: 'rollback_plan', label: 'Rollback Protocol', type: 'textarea', rows: 4, placeholder: 'Contingency steps if implementation fails...' },
    { name: 'scheduled_date', label: 'Scheduled Window', type: 'date' },
];

