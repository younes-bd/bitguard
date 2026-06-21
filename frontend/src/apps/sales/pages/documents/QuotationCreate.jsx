import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../../core/api/erpService';
import { crmService } from '../../../../core/api/crmService';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, FileCheck, User, Calendar } from 'lucide-react';
import InvoiceLineItems from '../../../billing/pages/billing/InvoiceLineItems';

const QuotationCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    client: '',
    type: 'quotation',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    expiry_date: '',
    status: 'draft',
    reference: '',
    notes: '',
    currency: 'USD',
    items: []
  });

  useEffect(() => {
    Promise.all([
      crmService.getClients(),
      erpService.getCatalogItems(),
    ]).then(([clientsRes, productsRes]) => {
      setClients(Array.isArray(clientsRes) ? clientsRes : clientsRes.results || []);
      setProducts(Array.isArray(productsRes) ? productsRes : productsRes.results || []);
    }).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await erpService.createInvoice({ ...formData, type: 'quotation' });
      toast.success('Quotation created successfully!');
      navigate('/admin/sales/quotations');
    } catch (error) {
      toast.error('Failed to create quotation.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/sales/quotations')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors border border-slate-700/30">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Quotation</h1>
          <p className="text-slate-400">Send a professional price estimate to your client.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-slate-700/50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} className="text-purple-500" /> Client
                </label>
                <select name="client" value={formData.client} onChange={handleChange} required
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none">
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reference / Subject</label>
                <input type="text" name="reference" value={formData.reference} onChange={handleChange}
                  placeholder="e.g. Security Audit Q2 2026"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/50">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Issue Date</label>
                <input type="date" name="issue_date" value={formData.issue_date} onChange={handleChange} required
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Valid Until</label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Currency</label>
                <select name="currency" value={formData.currency} onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none appearance-none">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-slate-700/50 space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Terms & Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="8"
              placeholder="Payment terms, scope of work, validity conditions..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-purple-500 outline-none resize-none" />
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6">Services & Pricing</h3>
          <InvoiceLineItems items={formData.items} onChange={(items) => setFormData(p => ({...p, items}))} products={products} />
        </div>

        <div className="flex justify-end items-center gap-6 pt-8 border-t border-slate-800">
          <button type="button" onClick={() => navigate('/admin/sales/quotations')} className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Discard</button>
          <button type="submit" disabled={loading}
            className="px-10 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
            <span>{loading ? 'Saving...' : 'Send Quotation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuotationCreate;
