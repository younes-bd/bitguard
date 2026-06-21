import React, { useState, useEffect } from 'react';
import { Truck, Search, Plus, Eye } from 'lucide-react';

export default function DeliveryNoteList() {
    const [deliveryNotes, setDeliveryNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch from API when ready, currently using mock structure to show enterprise layout
        fetch('/api/inventory/delivery-notes/')
            .then(res => {
                if (res.ok) return res.json();
                return [];
            })
            .then(data => {
                setDeliveryNotes(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Truck className="w-6 h-6 text-purple-400" />
                        Delivery Notes
                    </h1>
                    <p className="text-slate-400 mt-1">Manage outbound shipments and delivery operations.</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Delivery Note
                </button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by DN number, client..." 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 text-sm">
                            <tr>
                                <th className="p-4 font-medium">DN Number</th>
                                <th className="p-4 font-medium">Client</th>
                                <th className="p-4 font-medium">Delivery Date</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Tracking</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-slate-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">Loading delivery notes...</td>
                                </tr>
                            ) : deliveryNotes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">No delivery notes found.</td>
                                </tr>
                            ) : (
                                deliveryNotes.map(dn => (
                                    <tr key={dn.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-medium text-white">{dn.dn_number}</td>
                                        <td className="p-4">{dn.client_name || `Client #${dn.client}`}</td>
                                        <td className="p-4">{dn.delivery_date || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                dn.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                                                dn.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                                                dn.status === 'returned' ? 'bg-red-500/10 text-red-400' :
                                                'bg-slate-500/10 text-slate-400'
                                            }`}>
                                                {dn.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">{dn.tracking_number || '-'}</td>
                                        <td className="p-4 text-right">
                                            <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
