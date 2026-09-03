import React, { useState, useEffect } from 'react';
import elearningService from '../../api/elearningService';
import { Plus, Search, Edit2, Trash2, Package, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

// A generic functional component for ElearningContents
export default function ElearningContents() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLoading(true);
        elearningService.getElearningContents()
            .then(res => setData(res.results || res || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredData = data.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <LayoutDashboard className="text-sky-400" size={28} /> Course Contents
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage course contents configurations</p>
                </div>
                <button 
                    onClick={() => toast.success("Create action clicked (Production Ready API needed)")}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95"
                >
                    <Plus size={18} /> Add New
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="flex items-center justify-center py-20 flex-col gap-4">
                        <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                        <p className="text-slate-400 text-sm">Loading data...</p>
                    </div>
                ) : filteredData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 font-semibold text-white">{item.name}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-xs font-bold border bg-sky-500/10 text-sky-400 border-sky-500/20">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400">{item.created_at}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-sky-500/10 text-slate-400 hover:text-sky-400 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <Package size={40} className="mx-auto mb-3 text-slate-700" />
                        <p className="font-bold text-slate-400">No matching records found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
