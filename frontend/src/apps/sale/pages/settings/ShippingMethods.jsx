import React, { useState, useEffect } from 'react';
import { Truck, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import client from '@/core/api/client';

export default function ShippingMethods() {
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        try {
            setLoading(true);
            const res = await client.get('delivery/shipping-methods/');
            setMethods(res.data?.data || res.data?.results || res.data || []);
        } catch (err) {
            toast.error('Failed to load shipping methods');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Truck className="text-blue-500" size={28} />
                        Shipping Methods
                    </h1>
                    <p className="text-slate-400 mt-1">Configure delivery methods, providers, and costs</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus size={18} />
                    New Method
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex gap-4 bg-slate-900/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search methods..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-950 sticky top-0 z-10">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Method Name</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Provider Type</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Fixed Price</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Status</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">Loading methods...</td>
                                </tr>
                            ) : methods.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Truck size={48} className="text-slate-700 mb-4" />
                                            <p>No shipping methods configured.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                methods.map((method) => (
                                    <tr key={method.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4 text-sm font-medium text-white">{method.name}</td>
                                        <td className="p-4 text-sm text-slate-300 capitalize">{method.provider_type}</td>
                                        <td className="p-4 text-sm text-slate-300">${parseFloat(method.fixed_price).toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                method.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {method.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
