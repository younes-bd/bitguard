import React, { useState, useEffect } from 'react';
import { Truck, Search, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

export default function ShippingSettings() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('store/shipping-settings/')
            .then(res => setZones(res.data.results || res.data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Truck className="text-teal-400" /> Shipping & Delivery
                </h1>
                <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors">
                    Add Global Zone
                </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search rates..." className="bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-teal-500" />
                    </div>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-teal-500" />
                        Loading logistics carriers...
                    </div>
                ) : zones.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 flex flex-col items-center">
                        <Truck size={48} className="mb-4 text-slate-700" />
                        No shipping logistics endpoints configured.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50">
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Zone Name</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Transit Flat Rate</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {zones.map(zone => (
                                <tr key={zone.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 text-white font-medium">{zone.zone_name}</td>
                                    <td className="px-6 py-4 text-slate-400">${parseFloat(zone.rate).toFixed(2)} USD</td>
                                    <td className="px-6 py-4 text-right text-slate-400">
                                        <button className="hover:text-white">Configure Route</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
