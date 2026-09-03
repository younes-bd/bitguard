import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, Wrench } from 'lucide-react';
import mrpService from '../../api/mrpService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function WorkOrderList() {
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkOrders();
    }, []);

    const fetchWorkOrders = async () => {
        try {
            setLoading(true);
            const res = await mrpService.getWorkOrders();
            setWorkOrders(res.results || res || []);
        } catch (err) {
            toast.error('Failed to load work orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-slate-800 text-slate-300';
            case 'ready': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
            case 'in_progress': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
            case 'done': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            case 'cancel': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
            default: return 'bg-slate-800 text-slate-300';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <Wrench className="text-amber-400" size={28} />
                    Work Orders
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Manage shop floor operations and tracking</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-medium">Operation</th>
                            <th className="p-4 font-medium">Work Center</th>
                            <th className="p-4 font-medium">Mfg Order</th>
                            <th className="p-4 font-medium">Scheduled Start</th>
                            <th className="p-4 font-medium">Expected Dur.</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading work orders...</td></tr>
                        ) : workOrders.map(wo => (
                            <tr key={wo.id} onClick={() => navigate(`/admin/mrp/work-orders/${wo.id}`)} className="hover:bg-slate-800/30 cursor-pointer transition-colors">
                                <td className="p-4 text-sm font-medium text-white">{wo.name || 'Operation'}</td>
                                <td className="p-4 text-sm text-slate-400">{wo.work_center_name || 'N/A'}</td>
                                <td className="p-4 text-sm font-medium text-emerald-400">{wo.manufacturing_order_reference || `MO-${wo.manufacturing_order || 'Unknown'}`}</td>
                                <td className="p-4 text-sm text-slate-400">{wo.scheduled_start ? new Date(wo.scheduled_start).toLocaleDateString() : '-'}</td>
                                <td className="p-4 text-sm text-slate-400">{wo.duration_expected ? `${wo.duration_expected} min` : '-'}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(wo.status)}`}>
                                        {wo.status?.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {!loading && workOrders.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">No work orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
