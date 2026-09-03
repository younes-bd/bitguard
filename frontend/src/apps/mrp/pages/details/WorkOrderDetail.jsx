import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Square, CheckCircle, Wrench, Clock, FileText } from 'lucide-react';
import mrpService from '../../api/mrpService';
import toast from 'react-hot-toast';

export default function WorkOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workOrder, setWorkOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchWorkOrder();
    }, [id]);

    const fetchWorkOrder = async () => {
        try {
            // Note: mrpService doesn't have a direct getWorkOrder by ID by default in our current setup, 
            // but assuming REST API, we can fetch all and filter or add an endpoint.
            // For now, let's just fetch all and find it, or if backend supports it, we could use apiClient directly.
            setLoading(true);
            const res = await mrpService.getWorkOrders({ id: id });
            const wo = Array.isArray(res.results) ? res.results.find(w => w.id === parseInt(id) || w.id === id) : res.find(w => w.id === parseInt(id) || w.id === id);
            
            if (wo) {
                setWorkOrder(wo);
                setNotes(wo.notes || '');
            } else {
                toast.error("Work order not found");
                navigate('/admin/mrp/work-orders');
            }
        } catch (err) {
            toast.error('Failed to load work order');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            await mrpService.updateWorkOrder(id, { status: newStatus });
            toast.success(`Work order marked as ${newStatus.replace('_', ' ')}`);
            fetchWorkOrder();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const saveNotes = async () => {
        try {
            await mrpService.updateWorkOrder(id, { notes: notes });
            toast.success('Notes saved');
        } catch (err) {
            toast.error('Failed to save notes');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading work order details...</div>;
    if (!workOrder) return null;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="flex gap-2">
                    {workOrder.status === 'ready' || workOrder.status === 'pending' ? (
                        <button onClick={() => updateStatus('in_progress')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                            <Play size={16} /> Start
                        </button>
                    ) : null}
                    {workOrder.status === 'in_progress' && (
                        <button onClick={() => updateStatus('done')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                            <CheckCircle size={16} /> Mark as Done
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-start border-b border-slate-800 pb-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Wrench className="text-amber-400" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{workOrder.name || 'Unnamed Operation'}</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                MO Reference: <span className="text-emerald-400 font-medium">{workOrder.manufacturing_order_reference || `MO-${workOrder.manufacturing_order}`}</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 uppercase tracking-wider">
                            {workOrder.status?.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Planning</h3>
                            <div className="bg-slate-950 rounded-lg p-4 space-y-3 border border-slate-800/50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Work Center</span>
                                    <span className="text-white font-medium">{workOrder.work_center_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Expected Duration</span>
                                    <span className="text-white font-medium">{workOrder.duration_expected ? `${workOrder.duration_expected} min` : 'Not set'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Real Duration</span>
                                    <span className="text-white font-medium">{workOrder.duration ? `${workOrder.duration} min` : '-'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Timing</h3>
                            <div className="bg-slate-950 rounded-lg p-4 space-y-3 border border-slate-800/50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Scheduled Start</span>
                                    <span className="text-white font-medium">{workOrder.scheduled_start ? new Date(workOrder.scheduled_start).toLocaleString() : '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Actual Start</span>
                                    <span className="text-white font-medium">{workOrder.date_start ? new Date(workOrder.date_start).toLocaleString() : '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Finished</span>
                                    <span className="text-white font-medium">{workOrder.date_finished ? new Date(workOrder.date_finished).toLocaleString() : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FileText size={16} /> Operator Notes & Instructions
                        </h3>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 text-sm resize-none focus:outline-none focus:border-emerald-500/50 transition-colors"
                            placeholder="Enter notes, measurements, or issues encountered..."
                        />
                        <div className="mt-3 flex justify-end">
                            <button onClick={saveNotes} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors">
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
