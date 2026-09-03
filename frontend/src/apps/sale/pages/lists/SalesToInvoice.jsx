import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesService } from '../../api/salesService';
import { FileText, Search, Eye } from 'lucide-react';

const SalesToInvoice = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    salesService.getSaleOrders({ status: 'sale', invoice_status: 'to_invoice' }).then(data => {
      const arr = Array.isArray(data) ? data : data?.results || [];
      setOrders(arr);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(q =>
    q.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    q.client_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <FileText className="text-purple-400" size={30} /> Orders to Invoice
          </h1>
          <p className="text-slate-400 mt-1">Sales orders ready to be invoiced.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search size={16} className="text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by number or customer..."
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
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order #</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice Status</th>
                <th className="p-4 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length === 0 ? (
                <tr><td colSpan="5" className="p-12 text-center text-slate-500">No orders to invoice at this time.</td></tr>
              ) : filtered.map(q => (
                <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-purple-400 text-sm">{q.order_number}</td>
                  <td className="p-4 font-bold text-white">{q.client_name || `Client #${q.client}`}</td>
                  <td className="p-4 text-right font-mono font-bold text-white">${(Number(q.amount_total) || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest bg-amber-500/20 text-amber-400 border-amber-500/30">
                      To Invoice
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => navigate(`/admin/sales/orders/${q.id}`)} className="text-slate-500 hover:text-white transition-colors">
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

export default SalesToInvoice;
