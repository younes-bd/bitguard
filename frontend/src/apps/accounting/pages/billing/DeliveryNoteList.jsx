import React, { useState, useEffect } from 'react';
import { 
    Truck, Package, MapPin, Calendar, 
    Search, Filter, MoreHorizontal, ChevronRight,
    CheckCircle2, Clock, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { accountingService } from '../../api/accountingService';
import { Download } from 'lucide-react';

const DeliveryNoteList = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const data = await accountingService.getDeliveryNotes();
                setNotes(data || []);
            } catch (err) {
                console.error("Failed to load delivery notes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'returned': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 size={14} />;
            case 'shipped': return <Truck size={14} />;
            case 'returned': return <AlertCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/accounting/overview')}
                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Truck className="text-blue-500" />
                            Delivery Management
                        </h1>
                        <p className="text-sm text-slate-400">Track fulfillment and shipment status for all client orders.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search notes, tracking #..."
                            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white w-64 transition-all"
                        />
                    </div>
                    <button className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:text-white border border-slate-700/50">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                        <Package size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{notes.filter(n => n.status === 'shipped').length}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">In Transit</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{notes.filter(n => n.status === 'delivered').length}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Delivered Today</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">99.2%</div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">On-Time Rate</div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-800">
                            <th className="px-6 py-4">DN Number</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Tracking ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Est. Delivery</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {notes.length > 0 ? notes.map((note) => (
                            <tr key={note.id} className="group hover:bg-blue-500/[0.02] transition-colors cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{note.dn_number}</span>
                                        <span className="text-[10px] text-slate-500">INV: {note.invoice_number || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                            {note.client_name?.substring(0, 2).toUpperCase() || '??'}
                                        </div>
                                        <span className="text-sm text-slate-300">{note.client_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                    {note.tracking_number || '--'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(note.status)}`}>
                                        {getStatusIcon(note.status)}
                                        {note.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar size={14} className="text-slate-600" />
                                        {note.delivery_date || 'TBD'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                accountingService.downloadDeliveryNote(note.id).catch(() => alert('Failed to download PDF'));
                                            }}
                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="Download PDF"
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button className="p-2 text-slate-600 hover:text-white transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-600">
                                            <Package size={48} />
                                        </div>
                                        <div className="text-slate-400 font-medium">No delivery notes found</div>
                                        <button className="text-sm text-blue-500 font-bold hover:underline">Generate from Invoice</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeliveryNoteList;
