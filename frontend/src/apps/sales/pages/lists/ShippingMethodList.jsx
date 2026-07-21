import React, { useState, useEffect } from 'react';
import { erpService } from '../../../../core/api/erpService';
import { Truck, Search, Plus } from 'lucide-react';

const ShippingMethodList = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    erpService.getShippingMethods().then(data => {
      const arr = Array.isArray(data) ? data : data?.results || [];
      setMethods(arr);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = methods.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Truck className="text-purple-400" size={30} /> Shipping Methods
          </h1>
          <p className="text-slate-400 mt-1">Manage delivery methods and costs.</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus size={18} /> New Shipping Method
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search size={16} className="text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search shipping methods..."
            className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none text-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Fixed Price</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length === 0 ? (
                <tr><td colSpan="3" className="p-12 text-center text-slate-500">No shipping methods found.</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-white">{m.name}</td>
                  <td className="p-4 text-right font-mono text-white">${Number(m.fixed_price || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${m.active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {m.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ShippingMethodList;
