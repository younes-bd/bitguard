import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mrpService from '../../../../core/api/mrpService';
import DataTable from '../../../../core/components/shared/views/DataTable';
import { Settings, Plus, LayoutDashboard, Wrench } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ManufacturingOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await mrpService.getOrders();
      setOrders(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch manufacturing orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Reference', sortable: true },
    { key: 'product_name', label: 'Product', sortable: true },
    { key: 'qty_to_produce', label: 'Qty' },
    { 
      key: 'state', 
      label: 'Status',
      render: (val) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          val === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
          val === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
          val === 'confirmed' ? 'bg-amber-500/10 text-amber-400' :
          val === 'cancel' ? 'bg-red-500/10 text-red-400' :
          'bg-slate-800 text-slate-300'
        }`}>{val?.toUpperCase().replace('_', ' ')}</span>
      )
    },
    { key: 'date_planned_start', label: 'Planned Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
    { key: 'origin', label: 'Source' }
  ];

  const actions = [
    {
      label: 'New Order',
      icon: Plus,
      variant: 'primary',
      onClick: () => navigate('/mrp/orders/new')
    }
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <Wrench className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Manufacturing Orders</h1>
            <p className="text-sm text-slate-400">Manage production schedules and work orders</p>
          </div>
        </div>
        <div className="flex space-x-3">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium text-sm"
            >
              {action.icon && <action.icon className="w-4 h-4" />}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns}
          data={orders}
          isLoading={loading}
          onRowClick={(row) => navigate(`/mrp/orders/${row.id}`)}
          emptyMessage="No manufacturing orders found."
        />
      </div>
    </div>
  );
}
