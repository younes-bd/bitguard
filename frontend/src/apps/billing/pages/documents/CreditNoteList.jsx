import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../../core/api/erpService';
import { FileMinus, Plus, Search, Eye } from 'lucide-react';

const CreditNoteList = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    erpService.getCreditNotes().then(data => {
      setNotes(Array.isArray(data) ? data : data?.results || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter(n =>
    n.credit_number?.toLowerCase().includes(search.toLowerCase()) ||
    n.client_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <FileMinus className="text-red-400" size={30} /> Avoirs
          </h1>
          <p className="text-slate-400 mt-1">Credit notes issued to clients for refunds or adjustments.</p>
        </div>
        <button
          onClick={() => navigate('/admin/accounting/credit-notes/create')}
          className="flex items-center gap-2 px-5 py-3 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/30">
          <Plus size={18} /> New Credit Note
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search size={16} className="text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search credit notes..."
            className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none text-sm" />
        </div>
        {loading ? (
          <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Credit #</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Invoice</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Remaining</th>
                <th className="p-4 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-12 text-center text-slate-500">No credit notes yet.</td></tr>
              ) : filtered.map(n => (
                <tr key={n.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-red-400 text-sm">{n.credit_number}</td>
                  <td className="p-4 font-bold text-white">{n.client_name || '—'}</td>
                  <td className="p-4 text-slate-400 text-sm">{n.date}</td>
                  <td className="p-4 text-slate-400 text-sm font-mono">{n.invoice_number || '—'}</td>
                  <td className="p-4 text-right font-mono font-bold text-white">${Number(n.amount || 0).toLocaleString()}</td>
                  <td className="p-4 text-right font-mono text-red-400">${Number(n.remaining_balance || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <button className="text-slate-500 hover:text-white transition-colors"><Eye size={16} /></button>
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

export default CreditNoteList;
