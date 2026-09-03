import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salesService } from '../../api/salesService';
import { toast } from 'react-hot-toast';
import { ArrowLeft, CheckCircle, XCircle, FileText, Truck, RefreshCw } from 'lucide-react';

const SaleOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      const data = await salesService.getSaleOrder(id);
      setOrder(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load Sale Order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleAction = async (actionFn, successMsg) => {
    setActionLoading(true);
    try {
      await actionFn();
      toast.success(successMsg);
      await fetchOrder();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.error || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>;
  if (!order) return <div className="text-center py-12 text-slate-400">Order not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={() => navigate('/admin/sales/orders')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={18} /> Back to Orders
        </button>
        <div className="flex flex-wrap gap-2">
          {(order.status === 'draft' || order.status === 'sent') && (
            <button
              onClick={() => handleAction(() => salesService.confirmSaleOrder(id), 'Order Confirmed')}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg"
            >
              {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />} Confirm Order
            </button>
          )}
          
          {order.status === 'sale' && (
            <>
              <button
                onClick={() => handleAction(() => salesService.invoiceSaleOrder(id), 'Invoice Created')}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-lg"
              >
                <FileText size={16} /> Create Invoice
              </button>
              <button
                onClick={() => handleAction(() => salesService.createDeliveryFromSale(id), 'Delivery Note Created')}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg"
              >
                <Truck size={16} /> Create Delivery
              </button>
            </>
          )}

          {order.status !== 'cancel' && order.status !== 'done' && (
            <button
              onClick={() => handleAction(() => salesService.cancelSaleOrder(id), 'Order Cancelled')}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 border border-slate-700 rounded-xl transition-all"
            >
              <XCircle size={16} /> Cancel
            </button>
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
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-slate-300 rounded-xl transition-colors border border-slate-700/50"
          >
            <FileText size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-8">
        <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">{order.order_number}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.status === 'sale' ? 'bg-emerald-500/20 text-emerald-400' :
                order.status === 'cancel' ? 'bg-red-500/20 text-red-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {order.status}
              </span>
              <span className="text-slate-400 text-sm">Date: {order.date_order}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-1">Customer</div>
            <div className="text-white text-xl font-bold">{order.client_name || `Client ID: ${order.client}`}</div>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs font-bold tracking-wider">
              <th className="pb-4 pl-4">Product / Description</th>
              <th className="pb-4 text-right">Quantity</th>
              <th className="pb-4 text-right">Unit Price</th>
              <th className="pb-4 text-right pr-4">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.lines?.map((line, i) => (
              <tr key={i} className="border-b border-slate-800/50">
                <td className="py-4 pl-4 text-white font-medium">{line.name}</td>
                <td className="py-4 text-right text-slate-300 font-mono">{line.product_uom_qty}</td>
                <td className="py-4 text-right text-slate-300 font-mono">${Number(line.price_unit).toLocaleString()}</td>
                <td className="py-4 text-right pr-4 text-white font-mono font-bold">${Number(line.price_subtotal).toLocaleString()}</td>
              </tr>
            ))}
            {(!order.lines || order.lines.length === 0) && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">No items on this order.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <div className="w-72 bg-slate-950 rounded-xl p-6 border border-slate-800">
            <div className="flex justify-between items-end">
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total</span>
              <span className="text-3xl font-black text-white font-mono">
                ${order.lines?.reduce((sum, l) => sum + Number(l.price_subtotal), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleOrderDetail;
