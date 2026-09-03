import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesService } from '../../api/salesService';
import { Plus, FileCheck, Search, Eye } from 'lucide-react';

const STATUS_STYLES = {
  draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  sent: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  void: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const QuotationList = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    salesService.getSaleOrders({ status__in: 'draft,sent' }).then(data => {
      const arr = Array.isArray(data) ? data : data?.results || [];
      setQuotations(arr);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = quotations.filter(q =>
    q.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    q.client_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <FileCheck className="text-purple-400" size={30} /> Devis
          </h1>
          <p className="text-slate-400 mt-1">Quotations sent to prospects and clients.</p>
        </div>
        <button
          onClick={() => navigate('/admin/sales/quotations/create')}
          className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus size={18} /> New Quotation
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search size={16} className="text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by number or client..."
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
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Issue Date</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-12 text-center text-slate-500">No quotations yet. Create your first one!</td></tr>
              ) : filtered.map(q => (
                <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-purple-400 text-sm">{q.order_number}</td>
                  <td className="p-4 font-bold text-white">{q.client_name}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(q.date_order).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-400 text-sm">{q.validity_date ? new Date(q.validity_date).toLocaleDateString() : '—'}</td>
                  <td className="p-4 text-right font-mono font-bold text-white">${(Number(q.amount_total) || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${STATUS_STYLES[q.status] || STATUS_STYLES.draft}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => navigate(`/admin/sales/quotations/${q.id}`)} className="text-slate-500 hover:text-white transition-colors">
                      <Eye size={16} />
                    </button>
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

export default QuotationList;
