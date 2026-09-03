import client from '@/core/api/client';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { accountingService } from '../../../accounting/api/accountingService';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Download, Mail, FileCheck, FileText, ThumbsDown, RefreshCw } from 'lucide-react';

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleConfirmOrder = async () => {
    try {
      const { data } = await client.post(`/sale/orders/${id}/confirm/`);
      toast.success('Order confirmed!');
      fetchQuotation();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to confirm order');
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const { data } = await client.post(`/sale/orders/${id}/invoice-order/`);
      toast.success('Invoice created!');
      navigate(`/accounting/invoices/${data.invoice_id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create invoice');
    }
  };

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = async () => {
    try {
      const data = await accountingService.getInvoice(id);
      setQuotation(data);
    } catch (e) {
      const message = e.response?.data?.detail || e.message || 'An unexpected error occurred';
      console.error(e);
      toast.error(message);
      
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleAction = async (action, successMsg) => {
    setActionLoading(true);
    try {
      await action();
      toast.success(successMsg);
      await client.get();
    } catch (e) { toast.error('Action failed.'); }
    finally { setActionLoading(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>;
  if (!quotation) return <div className="text-center py-12 text-slate-400">Quotation not found.</div>;

  const isActive = quotation.status === 'draft' || quotation.status === 'sent';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <button onClick={() => navigate('/admin/sales/quotations')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={18} /> Back to Quotations
        </button>
        <div className="flex flex-wrap gap-2">
          {isActive && (
            <>
              <button
                onClick={() => handleAction(() => accountingService.convertQuotationToInvoice(id), 'Converted to Invoice!')}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/10">
                {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : <FileText size={16} />} Convert to Invoice
              </button>
              <button
                onClick={() => handleAction(() => accountingService.declineQuotation(id), 'Quotation declined.')}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 rounded-xl transition-all border border-slate-700">
                <ThumbsDown size={16} /> Decline
              </button>
            </>
          )}
          <button
            onClick={async () => {
              setActionLoading(true);
              try {
                await salesService.downloadSaleOrder(id);
              } catch (e) {
                toast.error('Failed to download PDF.');
              } finally {
                setActionLoading(false);
              }
            }}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-slate-300 rounded-xl transition-colors border border-slate-700/50">
            <Download size={16} /> Download PDF
          </button>
          <button
            onClick={() => handleAction(() => accountingService.sendInvoiceToClient(id), 'Quotation dispatched to client!')}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20">
            <Mail size={16} /> Send to Client
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="h-2 w-full bg-purple-500" />
        <div className="p-12 flex justify-between items-start border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">B</div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">BITGUARD</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-1 uppercase tracking-tighter">Devis / Quotation</h1>
            <div className="text-slate-400 font-mono text-lg">#{quotation.invoice_number}</div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-slate-500 text-sm uppercase font-bold tracking-widest">From</div>
            <div className="font-bold text-slate-900">BitGuard Enterprise Solutions</div>
            <div className="text-slate-500 text-sm">contact@bitguard.tech</div>
            {quotation.expiry_date && (
              <div className="mt-4 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl text-sm">
                <span className="font-bold text-orange-700">Valid Until:</span>
                <span className="text-orange-600 ml-2 font-mono">{quotation.expiry_date}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-12 grid grid-cols-2 gap-12 bg-slate-50/50 border-b border-slate-100">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">Prepared For</div>
            <div className="font-bold text-slate-900 text-lg">{quotation.client_name}</div>
            <div className="text-slate-500 text-sm mt-1">{quotation.client_email}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">Quotation Details</div>
            <div className="text-sm text-slate-600">Issued: <span className="font-bold text-slate-900">{quotation.issue_date}</span></div>
            {quotation.reference && <div className="text-sm text-slate-600 mt-1">Ref: <span className="font-bold">{quotation.reference}</span></div>}
          </div>
        </div>

        <div className="p-12 pb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest">
                <th className="pb-6 w-12">#</th>
                <th className="pb-6 pl-4">Description of Services</th>
                <th className="pb-6 text-right w-24">Qty</th>
                <th className="pb-6 text-right w-32">Unit Price</th>
                <th className="pb-6 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {quotation.items?.map((item, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-6 text-slate-400 font-mono text-xs">{i + 1}</td>
                  <td className="py-6 pl-4 font-bold text-slate-900">{item.description}</td>
                  <td className="py-6 text-right font-mono text-sm">{item.quantity}</td>
                  <td className="py-6 text-right font-mono text-sm">${Number(item.unit_price).toLocaleString()}</td>
                  <td className="py-6 text-right font-bold text-slate-900 font-mono text-sm">${Number(item.total).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-12 pb-12 flex justify-end">
          <div className="w-72 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Subtotal</span><span className="font-mono">${Number(quotation.subtotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Tax</span><span className="font-mono">${Number(quotation.tax_total || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Total Quote</span>
              <span className="text-3xl font-black font-mono">${Number(quotation.total_amount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {quotation.notes && (
          <div className="px-12 pb-12">
            <div className="text-[10px] text-slate-400 uppercase font-black mb-4 tracking-[0.2em]">Terms & Notes</div>
            <div className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">{quotation.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationDetail;
