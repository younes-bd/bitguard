import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mrpService from '../../../../core/api/mrpService';
import { Wrench, Plus, Search, Edit2, Trash2 } from 'lucide-react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    mrpService.getOrders().then(data => {
      setOrders(Array.isArray(data) ? data : data.results || []);
      setLoading(false);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this manufacturing order?")) {
      mrpService.deleteOrder ? mrpService.deleteOrder(id).then(() => fetchOrders()) : console.log("delete not implemented in mrpService");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
          <Wrench className="w-6 h-6 mr-3 text-slate-500" />
          Manufacturing Orders
        </h1>
        <button 
          onClick={() => navigate('/admin/mrp/orders/new')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-medium text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Product ID</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No orders found.</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{o.name}</td>
                  <td className="px-6 py-4">Product #{o.product_id}</td>
                  <td className="px-6 py-4">{o.qty_producing}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      o.state === 'done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      o.state === 'in_progress' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' :
                      o.state === 'cancel' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400'
                    }`}>
                      {o.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => navigate(`/admin/mrp/orders/${o.id}`)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(o.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
