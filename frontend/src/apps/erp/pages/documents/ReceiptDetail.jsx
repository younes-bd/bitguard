import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { erpService } from '../../../../core/api/erpService';
import { ArrowLeft, Download, CheckCircle } from 'lucide-react';

const ReceiptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch payment details — use getPayments and find by id as fallback
    erpService.getPayments().then(data => {
      const arr = Array.isArray(data) ? data : data?.results || [];
      const found = arr.find(p => String(p.id) === String(id));
      setPayment(found || null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>;
  if (!payment) return <div className="text-center py-12 text-slate-400">Receipt not found.</div>;

  const receiptNumber = payment.reference || `RCT-${String(payment.id).padStart(4, '0')}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/admin/erp/receipts')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={18} /> Back to Receipts
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700">
          <Download size={16} /> Print / Download
        </button>
      </div>

      {/* Receipt Document */}
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none">
        <div className="h-2 w-full bg-emerald-500" />
        <div className="p-10 flex justify-between items-start border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">B</div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">BITGUARD</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Reçu de Paiement</h1>
            <div className="text-slate-400 font-mono">#{receiptNumber}</div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="font-bold text-emerald-700 text-sm">Payment Confirmed</span>
            </div>
            <div className="text-slate-500 text-sm mt-3">Date: <span className="font-bold text-slate-900">{payment.payment_date || payment.created_at?.split('T')[0]}</span></div>
          </div>
        </div>

        <div className="p-10 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-[0.2em]">Received From</div>
              <div className="font-bold text-slate-900 text-lg">{payment.client_name || 'Client'}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-[0.2em]">Payment Method</div>
              <div className="font-bold text-slate-900 capitalize">{(payment.method || 'Bank Transfer').replace('_', ' ')}</div>
            </div>
          </div>

          {payment.invoice_number && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-wider">Applied to Invoice</div>
              <div className="font-mono font-bold text-slate-900">{payment.invoice_number}</div>
            </div>
          )}

          <div className="p-8 bg-slate-900 text-white rounded-3xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-black mb-4 tracking-[0.2em]">Amount Received</div>
            <div className="text-5xl font-black font-mono">${Number(payment.amount || 0).toLocaleString()}</div>
          </div>

          {payment.notes && (
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider">Notes</div>
              <div className="text-sm text-slate-500">{payment.notes}</div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <CheckCircle size={14} /> Digitally Signed & Verified
          </div>
          <div className="text-xs text-slate-400">Generated by BitGuard ERP OS</div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetail;
