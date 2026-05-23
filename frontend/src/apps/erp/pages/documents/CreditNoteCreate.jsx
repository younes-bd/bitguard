import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../../core/api/erpService';
import { crmService } from '../../../../core/api/crmService';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, FileMinus, AlertTriangle } from 'lucide-react';

const REASONS = [
  'Duplicate billing',
  'Service not rendered',
  'Billing error',
  'Client returned service',
  'Goodwill adjustment',
  'Partial cancellation',
  'Other',
];

const CreditNoteCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [formData, setFormData] = useState({
    client: '',
    invoice: '',
    amount: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    crmService.getClients().then(data => setClients(Array.isArray(data) ? data : data?.results || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (formData.client) {
      erpService.getInvoices({ client: formData.client }).then(data => {
        setInvoices(Array.isArray(data) ? data : data?.results || []);
      }).catch(() => {});
    }
  }, [formData.client]);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Please enter a valid credit amount.');
      return;
    }
    setLoading(true);
    try {
      await erpService.createCreditNote({
        ...formData,
        invoice: formData.invoice || null,
        amount: Number(formData.amount),
      });
      toast.success('Credit note created!');
      navigate('/admin/erp/credit-notes');
    } catch (err) {
      toast.error('Failed to create credit note.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/erp/credit-notes')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors border border-slate-700/30">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Issue Credit Note</h1>
          <p className="text-slate-400">Issue an Avoir to adjust or refund a client's account.</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 flex items-start gap-3">
        <AlertTriangle size={18} className="text-orange-400 mt-0.5 shrink-0" />
        <p className="text-sm text-orange-300">Credit notes reduce the client's outstanding balance. Once issued, they cannot be deleted — only voided.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-slate-700/50 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Client *</label>
            <select name="client" value={formData.client} onChange={handleChange} required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-red-500 outline-none appearance-none">
              <option value="">Select Client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Linked Invoice (optional)</label>
            <select name="invoice" value={formData.invoice} onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-red-500 outline-none appearance-none">
              <option value="">-- No specific invoice --</option>
              {invoices.map(inv => <option key={inv.id} value={inv.id}>{inv.invoice_number} (${Number(inv.total_amount).toLocaleString()})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Credit Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 pl-7 text-white focus:border-red-500 outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reason *</label>
            <select name="reason" value={formData.reason} onChange={handleChange} required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-red-500 outline-none appearance-none">
              <option value="">Select reason...</option>
              {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
          <button type="button" onClick={() => navigate('/admin/erp/credit-notes')} className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={loading}
            className="px-8 py-3 bg-red-700 hover:bg-red-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileMinus size={18} />}
            {loading ? 'Issuing...' : 'Issue Credit Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditNoteCreate;
