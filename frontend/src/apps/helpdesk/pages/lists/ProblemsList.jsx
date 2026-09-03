import React, { useState, useEffect } from 'react';
import { 
    AlertCircle, Search, Filter, Plus, ChevronRight, 
    User, Calendar, CheckCircle, XCircle, Activity,
    FileText, Zap, HelpCircle, Loader2
} from 'lucide-react';
import serviceService from '../../../field-service/api/serviceService';
import GenericModal from '@/core/components/shared/forms/GenericModal';
import { toast } from 'react-hot-toast';

export default function ProblemsList() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchProblems = () => {
        setLoading(true);
        serviceService.getProblems()
            .then(data => setProblems(data))
            .catch(err => {
                console.error(err);
                toast.error('Failed to sync problem database');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const filteredProblems = problems.filter(p => {
        const matchesSearch = (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'closed': return 'bg-slate-700 text-slate-400 border-slate-600';
            case 'root_cause_identified': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'investigating': return 'bg-blue-500/10 text-blue-400 animate-pulse border-blue-500/20';
            case 'workaround_provided': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    const handleResolve = async (permanentFix) => {
        setActionLoading(true);
        try {
            await serviceService.resolveProblem(selectedProblem.id, permanentFix);
            toast.success('Problem marked as resolved');
            setSelectedProblem(null);
            fetchProblems();
        } catch (err) {
            toast.error('Failed to resolve problem');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && problems.length === 0) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-amber-400" size={40} />
            <p className="text-slate-400 font-medium">Synchronizing Root Cause database...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                        <AlertCircle className="text-amber-500 w-10 h-10" /> 
                        Problem Management
                    </h1>
                    <p className="text-slate-400 mt-2 font-['Inter'] text-lg">Root cause identification and permanent resolution of recurring incidents.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all hover:scale-105 active:scale-95">
                    <Plus size={20}/> 
                    <span>Log New Problem</span>
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900/50 p-4 border border-slate-800 rounded-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title, description, RCA..."
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                    <option value="all">All Status</option>
                    <option value="identified">Identified</option>
                    <option value="investigating">Investigating</option>
                    <option value="root_cause_identified">Root Cause Found</option>
                    <option value="workaround_provided">Workaround Live</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredProblems.length === 0 ? (
                    <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-20 text-center">
                        <HelpCircle size={48} className="mx-auto text-slate-700 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400 mb-2">No Problems Tracked</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Either your systems are perfect, or you haven't identified the root cause of your incidents yet.</p>
                    </div>
                ) : (
                    filteredProblems.map((p) => (
                        <div key={p.id} 
                            onClick={() => setSelectedProblem(p)}
                            className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all cursor-pointer relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 rounded-xl bg-slate-800 group-hover:bg-amber-500/10 transition-colors">
                                        <Zap size={24} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">{p.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-1 mt-1">{p.description}</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                <Activity size={12} /> {p.priority} priority
                                            </span>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 border-l border-slate-800 pl-4">
                                                <User size={12} /> {p.assigned_to_name || 'Unassigned'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(p.status)}`}>
                                        {p.status.replace(/_/g, ' ')}
                                    </span>
                                    <ChevronRight size={20} className="text-slate-600 group-hover:text-amber-400 transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {selectedProblem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
                                    <Zap size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white uppercase font-['Outfit']">{selectedProblem.title}</h2>
                                    <p className="text-slate-400 text-sm">Logged on {new Date(selectedProblem.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedProblem(null)} className="text-slate-500 hover:text-white">
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-slate-400 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-widest"><FileText size={16}/> Description</h4>
                                    <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed">
                                        {selectedProblem.description}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-rose-400/80 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-widest"><Activity size={16}/> Root Cause (RCA)</h4>
                                        <textarea 
                                            className="w-full bg-rose-500/5 p-5 rounded-2xl border border-rose-500/10 text-slate-300 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                                            value={selectedProblem.root_cause || ''}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-blue-400/80 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-widest"><Zap size={16}/> Active Workaround</h4>
                                        <textarea 
                                            className="w-full bg-blue-500/5 p-5 rounded-2xl border border-blue-500/10 text-slate-300 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                            value={selectedProblem.workaround || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-emerald-400/80 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-widest"><CheckCircle size={16}/> Permanent Resolution</h4>
                                    <textarea 
                                        className="w-full bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10 text-slate-300 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                                        placeholder="Document the permanent fix applied to prevent recurrence..."
                                        id="permanent_fix_input"
                                        defaultValue={selectedProblem.permanent_fix || ''}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex gap-3">
                                {selectedProblem.status !== 'resolved' && selectedProblem.status !== 'closed' && (
                                    <button 
                                        onClick={() => {
                                            const fix = document.getElementById('permanent_fix_input').value;
                                            handleResolve(fix);
                                        }}
                                        disabled={actionLoading}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        <CheckCircle size={18} /> Resolve Problem
                                    </button>
                                )}
                                <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all">
                                    Create Change Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <GenericModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Log IT Problem"
                fields={PROBLEM_FIELDS}
                onSubmit={async (formData) => {
                    setActionLoading(true);
                    try {
                        await serviceService.createProblem(formData);
                        setIsCreateModalOpen(false);
                        toast.success('Problem logged successfully');
                        fetchProblems();
                    } catch (err) {
                        toast.error('Failed to log problem');
                    } finally {
                        setActionLoading(false);
                    }
                }}
                loading={actionLoading}
            />
        </div>
    );
}

const PROBLEM_FIELDS = [
    { name: 'title', label: 'Problem Title', required: true, placeholder: 'e.g. Recurring SQL Timeout on Order API' },
    { name: 'description', label: 'Detailed Symptoms', type: 'textarea', required: true, rows: 4 },
    { name: 'severity', label: 'Severity', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' },
    ], default: 'medium' },
    { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'identified', label: 'Identified' },
        { value: 'investigating', label: 'Investigating' },
        { value: 'root_cause_identified', label: 'Root Cause Found' },
        { value: 'workaround_provided', label: 'Workaround Live' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
    ], default: 'identified' },
    { name: 'workaround', label: 'Immediate Workaround (if any)', type: 'textarea', rows: 3 },
    { name: 'root_cause', label: 'Initial RCA Findings', type: 'textarea', rows: 3 },
];

