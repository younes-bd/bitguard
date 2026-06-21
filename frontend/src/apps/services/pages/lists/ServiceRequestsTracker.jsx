import React, { useState, useEffect } from 'react';
import { 
    CheckSquare, Loader2, Calendar, User, Clock, ExternalLink, 
    Shield, Activity, FileText, CheckCircle, XCircle, ChevronRight, HelpCircle
} from 'lucide-react';
import serviceService from '../../../../core/api/serviceService';
import { toast } from 'react-hot-toast';

export default function ServiceRequestsTracker() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchRequests = () => {
        setLoading(true);
        serviceService.getServiceRequests()
            .then(data => {
                setRequests(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to sync service requests');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRequests();
        
        // Fetch current user from localStorage or API client if available to verify if they can approve
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                setCurrentUser(JSON.parse(userStr));
            }
        } catch (e) {
            console.error('Failed to resolve authenticated context user', e);
        }
    }, []);

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'in_progress': return 'bg-blue-500/10 text-blue-400 animate-pulse border-blue-500/20';
            case 'approved': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'pending_approval': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    const handleApprove = async (id) => {
        setActionLoading(true);
        try {
            await serviceService.approveServiceRequest(id);
            toast.success('IT Service Request approved successfully!');
            // Refresh detailed request
            const updated = await serviceService.getServiceRequest(id);
            setSelectedRequest(updated);
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error('Failed to approve request');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        setActionLoading(true);
        try {
            await serviceService.rejectServiceRequest(id);
            toast.success('IT Service Request rejected and closed.');
            // Refresh detailed request
            const updated = await serviceService.getServiceRequest(id);
            setSelectedRequest(updated);
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error('Failed to reject request');
        } finally {
            setActionLoading(false);
        }
    };

    // Calculate progression step indexes:
    // Submitted (1) -> Approval Gate (2) -> Provisioning Ticket (3) -> Fulfill/Complete (4)
    const getProgressStep = (req) => {
        if (req.status === 'rejected') return { step: 2, error: true };
        if (req.status === 'pending_approval') return { step: 1, error: false };
        if (req.status === 'approved') return { step: 2, error: false };
        if (req.status === 'in_progress') return { step: 3, error: false };
        if (req.status === 'completed') return { step: 4, error: false };
        return { step: 1, error: false };
    };

    if (loading && requests.length === 0) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-emerald-400" size={40} />
            <p className="text-slate-400 font-medium font-['Inter']">Querying active IT operations...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 px-4 sm:px-6 font-['Inter']">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                    <CheckSquare className="text-emerald-500 w-10 h-10" /> 
                    IT Service Requests Tracker
                </h1>
                <p className="text-slate-400 mt-2 text-lg">Trace security compliance, approval stages, and operational ticket progress in real-time.</p>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Requests list (2 columns if wide, else 1) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-2xl flex items-center justify-between">
                        <span className="text-slate-400 font-bold text-sm tracking-wider uppercase">Active Pipeline</span>
                        <span className="bg-slate-800 text-slate-300 font-extrabold px-3 py-1 rounded-full text-xs">
                            {requests.length} Requests
                        </span>
                    </div>

                    {requests.length === 0 ? (
                        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-20 text-center">
                            <HelpCircle size={48} className="mx-auto text-slate-700 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400 mb-2">No Service Requests Tracked</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">Go to the IT Service Catalog to submit your first infrastructure or credential provisioning request.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <div 
                                    key={req.id} 
                                    onClick={() => setSelectedRequest(req)}
                                    className={`group bg-slate-900 border rounded-2xl p-6 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                                        selectedRequest?.id === req.id 
                                            ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5 bg-slate-900/90' 
                                            : 'border-slate-800 hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl bg-slate-800 ${selectedRequest?.id === req.id ? 'bg-emerald-500/10 text-emerald-400' : 'group-hover:bg-slate-700'} transition-colors duration-300`}>
                                            <Activity size={22} className={req.status === 'in_progress' ? 'animate-pulse text-blue-400' : 'text-slate-400'} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors font-['Outfit']">
                                                REQ-{req.id}: {req.service_item_details?.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(req.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1 border-l border-slate-800 pl-4">
                                                    <User size={12} /> Requested by: {req.requester_name || 'Self'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusBadgeStyle(req.status)}`}>
                                            {req.status.replace(/_/g, ' ')}
                                        </span>
                                        <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Request Details & Lifecycle Step Progress */}
                <div className="lg:col-span-1">
                    {selectedRequest ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl sticky top-6">
                            {/* Panel Header */}
                            <div className="border-b border-slate-800/80 pb-4">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Request Detail View</span>
                                <h2 className="text-lg font-bold text-white uppercase font-['Outfit']">
                                    REQ-{selectedRequest.id}: {selectedRequest.service_item_details?.name}
                                </h2>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusBadgeStyle(selectedRequest.status)}`}>
                                    {selectedRequest.status.replace(/_/g, ' ')}
                                </span>
                            </div>

                            {/* ITIL Step Progress Bar */}
                            <div className="space-y-4">
                                <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                                    <Activity size={14} className="text-emerald-500" /> Lifecycle Status Tracker
                                </h4>
                                <div className="space-y-6 pl-4 border-l-2 border-slate-800 relative mt-4">
                                    {/* Step 1: Submission */}
                                    <div className="relative pl-6">
                                        <div className={`absolute -left-[23px] top-0 w-4.5 h-4.5 rounded-full border-4 ${
                                            getProgressStep(selectedRequest).step >= 1 
                                                ? 'bg-emerald-500 border-slate-900' 
                                                : 'bg-slate-800 border-slate-900'
                                        }`} />
                                        <h5 className="text-xs font-bold text-white">Submitted</h5>
                                        <p className="text-[11px] text-slate-500">Request logged under tenant context.</p>
                                    </div>

                                    {/* Step 2: Approval Gate */}
                                    <div className="relative pl-6">
                                        <div className={`absolute -left-[23px] top-0 w-4.5 h-4.5 rounded-full border-4 ${
                                            getProgressStep(selectedRequest).error && selectedRequest.status === 'rejected'
                                                ? 'bg-rose-500 border-slate-900'
                                                : getProgressStep(selectedRequest).step >= 2 
                                                    ? 'bg-emerald-500 border-slate-900' 
                                                    : 'bg-slate-800 border-slate-900'
                                        }`} />
                                        <h5 className="text-xs font-bold text-white flex items-center gap-2">
                                            Approval Stage 
                                            {selectedRequest.service_item_details?.approval_required && (
                                                <Shield size={12} className="text-amber-500" />
                                            )}
                                        </h5>
                                        <p className="text-[11px] text-slate-500">
                                            {selectedRequest.status === 'rejected' 
                                                ? 'Request rejected by Service Owner.' 
                                                : selectedRequest.status === 'pending_approval' 
                                                    ? 'Awaiting approval request verification...' 
                                                    : 'Approved by Service Owner.'}
                                        </p>
                                    </div>

                                    {/* Step 3: Support Desk Provisioning */}
                                    <div className="relative pl-6">
                                        <div className={`absolute -left-[23px] top-0 w-4.5 h-4.5 rounded-full border-4 ${
                                            getProgressStep(selectedRequest).step >= 3 
                                                ? 'bg-emerald-500 border-slate-900' 
                                                : 'bg-slate-800 border-slate-900'
                                        }`} />
                                        <h5 className="text-xs font-bold text-white">Provisioning in Progress</h5>
                                        <p className="text-[11px] text-slate-500">Support Desk Ticket generated.</p>
                                        {selectedRequest.ticket_id && (
                                            <a 
                                                href={`/admin/support/tickets/${selectedRequest.ticket_id}`} 
                                                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 mt-1"
                                            >
                                                <span>Ticket #{selectedRequest.ticket_id}</span>
                                                <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>

                                    {/* Step 4: Closed / Complete */}
                                    <div className="relative pl-6">
                                        <div className={`absolute -left-[23px] top-0 w-4.5 h-4.5 rounded-full border-4 ${
                                            getProgressStep(selectedRequest).step >= 4 
                                                ? 'bg-emerald-500 border-slate-900' 
                                                : 'bg-slate-800 border-slate-900'
                                        }`} />
                                        <h5 className="text-xs font-bold text-white">Closed / Fulfilled</h5>
                                        <p className="text-[11px] text-slate-500">Resources provisioned and operational.</p>
                                    </div>
                                </div>
                            </div>

                            {/* custom inputs form details */}
                            <div className="border-t border-slate-800 pt-4 space-y-4">
                                <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={14} className="text-slate-500" /> Dynamic Form Input
                                </h4>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-slate-300 text-xs space-y-3 font-mono">
                                    {Object.entries(selectedRequest.form_data || {}).map(([key, val]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-slate-500 text-left capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                            <span className="text-slate-200 text-right">{String(val)}</span>
                                        </div>
                                    ))}
                                    {(!selectedRequest.form_data || Object.keys(selectedRequest.form_data).length === 0) && (
                                        <span className="text-slate-600 block text-center">No input data recorded</span>
                                    )}
                                </div>
                            </div>

                            {/* Service Owner Approve/Reject Action Gate */}
                            {selectedRequest.status === 'pending_approval' && (
                                <div className="border-t border-slate-800 pt-6 space-y-3">
                                    <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl text-[11px] text-amber-400 flex items-center gap-2">
                                        <Shield size={14} className="shrink-0" />
                                        <span>Approver Gate: Standard compliance protocol validation.</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => handleReject(selectedRequest.id)}
                                            disabled={actionLoading}
                                            className="bg-slate-950 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-rose-400/90 py-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                                        >
                                            <XCircle size={14} /> Reject
                                        </button>
                                        <button 
                                            onClick={() => handleApprove(selectedRequest.id)}
                                            disabled={actionLoading}
                                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/10 disabled:opacity-50"
                                        >
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-12 text-center sticky top-6">
                            <Activity size={32} className="mx-auto text-slate-700 mb-3 animate-pulse" />
                            <h4 className="text-sm font-bold text-slate-400 mb-1">Select a Service Request</h4>
                            <p className="text-slate-500 text-xs">Pick an operational request from the active pipeline to audit SLA and approval transitions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

