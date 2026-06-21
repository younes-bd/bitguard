import React, { useState } from 'react';
import { Settings2, Plus, Search, Filter } from 'lucide-react';

export default function ReorderRules() {
    const [rules] = useState([
        { id: 1, item: 'Dell PowerEdge R740', minQuantity: 5, maxQuantity: 20, multiple: 1, active: true },
        { id: 2, item: 'Cisco Catalyst 9300', minQuantity: 10, maxQuantity: 50, multiple: 5, active: true },
        { id: 3, item: 'Logitech MX Master 3', minQuantity: 20, maxQuantity: 100, multiple: 10, active: false }
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Settings2 className="text-orange-500" /> Reorder Rules
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Automate purchase order generation based on minimum stock thresholds.</p>
                </div>
                <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    <Plus size={18} /> New Rule
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search rules..." className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-orange-500 outline-none" />
                    </div>
                    <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white flex items-center gap-2">
                        <Filter size={16}/> Filter
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Inventory Item</th>
                            <th className="px-6 py-4 font-semibold text-center">Min Qty</th>
                            <th className="px-6 py-4 font-semibold text-center">Max Qty</th>
                            <th className="px-6 py-4 font-semibold text-center">Order Multiple</th>
                            <th className="px-6 py-4 font-semibold text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                        {rules.map(rule => (
                            <tr key={rule.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-bold text-white">{rule.item}</td>
                                <td className="px-6 py-4 text-center font-mono text-slate-300">{rule.minQuantity}</td>
                                <td className="px-6 py-4 text-center font-mono text-slate-300">{rule.maxQuantity}</td>
                                <td className="px-6 py-4 text-center font-mono text-slate-300">{rule.multiple}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        rule.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                        {rule.active ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
