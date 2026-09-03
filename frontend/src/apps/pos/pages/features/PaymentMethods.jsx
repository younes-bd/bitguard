import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckCircle, XCircle } from 'lucide-react';

// Functional POS Payment Methods UI
export default function PaymentMethods() {
    const [methods, setMethods] = useState([
        { id: 'cash', name: 'Cash', type: 'Cash', journal: 'Cash Journal', enabled: true },
        { id: 'bank', name: 'Bank / Card', type: 'Bank', journal: 'Bank Journal', enabled: true },
        { id: 'stripe', name: 'Stripe Terminal', type: 'Electronic', journal: 'Stripe Journal', enabled: false },
        { id: 'paypal', name: 'PayPal QR', type: 'Electronic', journal: 'PayPal Journal', enabled: false },
    ]);

    const handleToggle = (id) => {
        setMethods(prev => prev.map(m => 
            m.id === id ? { ...m, enabled: !m.enabled } : m
        ));
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <LayoutDashboard className="text-sky-400" size={28} /> Payment Methods
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure which payment methods are available on the POS terminal</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Journal</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {methods.map((method) => (
                                <tr key={method.id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-semibold text-white">{method.name}</td>
                                    <td className="p-4 text-slate-400">{method.type}</td>
                                    <td className="p-4 text-slate-400">{method.journal}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            {method.enabled ? (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <CheckCircle size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                    <XCircle size={12} /> Disabled
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={method.enabled} 
                                                onChange={() => handleToggle(method.id)}
                                            />
                                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
