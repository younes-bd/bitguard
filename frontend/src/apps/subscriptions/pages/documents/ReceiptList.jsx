import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountingService } from '../../../accounting/api/accountingService';
import { Receipt, Search, Eye, Download } from 'lucide-react';

const ReceiptList = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    accountingService.getPayments().then(data => {
      setPayments(Array.isArray(data) ? data : data?.results || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p =>
    p.reference?.toLowerCase().includes(search.toLowerCase()) ||
    p.client_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Receipt className="text-emerald-400" size={30} /> Reçus
          </h1>
          <p className="text-slate-400 mt-1">Payment receipts issued to clients.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search size={16} className="text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search receipts..."
            className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none text-sm" />
        </div>
        {loading ? (
          <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Method</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-12 text-center text-slate-500">No receipts yet.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-400 text-sm">{p.reference || `RCT-${p.id}`}</td>
                  <td className="p-4 font-bold text-white">{p.client_name || '—'}</td>
                  <td className="p-4 text-slate-400 text-sm">{p.payment_date || p.created_at?.split('T')[0]}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300">{p.method || 'bank_transfer'}</span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400">${Number(p.amount || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <button onClick={() => navigate(`/admin/accounting/receipts/${p.id}`)} className="text-slate-500 hover:text-white transition-colors">
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

export default ReceiptList;
