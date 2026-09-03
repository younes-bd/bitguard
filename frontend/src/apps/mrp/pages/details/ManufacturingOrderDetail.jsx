import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecordFormLayout from '@/core/components/shared/forms/RecordFormLayout';
import mrpService from '../../api/mrpService';
import { toast } from 'react-hot-toast';
import { Loader2, Play, CheckCircle, Wrench } from 'lucide-react';

export default function ManufacturingOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [order, setOrder] = useState({
    name: '',
    product_name: '',
    product_id: '',
    qty_to_produce: 1,
    state: 'draft',
    date_planned_start: '',
    bom: '',
    routing: ''
  });
  
  const [boms, setBoms] = useState([]);
  const [routings, setRoutings] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bomsRes, routingsRes] = await Promise.all([
          mrpService.getBOMs(),
          mrpService.getRoutings()
        ]);
        setBoms(bomsRes.results || bomsRes || []);
        setRoutings(routingsRes.results || routingsRes || []);

        if (!isNew) {
          const [orderRes, workOrdersRes] = await Promise.all([
            mrpService.getOrder(id),
            mrpService.getOrderWorkOrders(id)
          ]);
          setOrder(orderRes.data || orderRes);
          setWorkOrders(workOrdersRes.results || workOrdersRes || []);
        }
      } catch (err) {
        toast.error('Failed to load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isNew) {
        const res = await mrpService.createOrder(order);
        toast.success('Manufacturing Order created');
        navigate(`/mrp/orders/${res.id || res.data?.id}`);
      } else {
        await mrpService.updateOrder(id, order);
        toast.success('Manufacturing Order updated');
      }
    } catch (err) {
      toast.error('Failed to save order');
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (actionFn, successMsg) => {
    try {
      setSaving(true);
      const res = await actionFn(id);
      setOrder(prev => ({ ...prev, state: res.status || prev.state }));
      if (actionFn === mrpService.confirmOrder) {
        const woRes = await mrpService.getOrderWorkOrders(id);
        setWorkOrders(woRes.results || woRes || []);
      }
      toast.success(successMsg);
    } catch (err) {
      toast.error('Action failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Manufacturing', href: '/mrp/overview' },
    { label: 'Orders', href: '/mrp/orders' },
    { label: isNew ? 'New Order' : order.name || 'Order' }
  ];

  const statusBarStages = [
    { key: 'draft', label: 'Draft', color: 'bg-slate-500' },
    { key: 'confirmed', label: 'Confirmed', color: 'bg-amber-500' },
    { key: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
    { key: 'done', label: 'Done', color: 'bg-emerald-500' },
    { key: 'cancel', label: 'Cancelled', color: 'bg-red-500' }
  ];

  const actions = [];
  if (order.state === 'draft' && !isNew) {
    actions.push({ label: 'Confirm', variant: 'secondary', onClick: () => handleAction(mrpService.confirmOrder, 'Order confirmed') });
  } else if (order.state === 'confirmed' && !isNew) {
    actions.push({ label: 'Start Production', variant: 'secondary', onClick: () => handleAction(mrpService.startOrder, 'Production started') });
  } else if (order.state === 'in_progress' && !isNew) {
    actions.push({ label: 'Mark as Done', variant: 'primary', onClick: () => handleAction(mrpService.produceOrder, 'Order marked as done') });
  }
  
  actions.push({ label: 'Save', variant: 'primary', onClick: handleSave });

  return (
    <RecordFormLayout
      title={isNew ? 'New Manufacturing Order' : order.name || 'Order'}
      breadcrumbs={breadcrumbs}
      stages={!isNew ? statusBarStages : []}
      currentStage={order.state}
      actions={actions}
      chatterModel={!isNew ? "mrp.manufacturingorder" : null}
      chatterObjectId={!isNew ? id : null}
    >
      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Reference (Name)</label>
            <input 
              type="text" 
              name="name"
              value={order.name || ''}
              onChange={handleChange}
              placeholder="e.g., WH/MO/0001"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Product</label>
            <input 
              type="text" 
              name="product_name"
              value={order.product_name || ''}
              onChange={handleChange}
              placeholder="e.g., Desk Combination"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-rose-500 outline-none"
            />
          </div>
          
          {/* Product ID (Inventory Ref) */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Product ID (Inventory)</label>
            <input 
              type="number" 
              name="product_id"
              value={order.product_id || ''}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Quantity To Produce</label>
            <input 
              type="number" 
              name="qty_to_produce"
              value={order.qty_to_produce || 1}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-rose-500 outline-none"
            />
          </div>

          {/* BOM */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Bill of Material</label>
            <select 
              name="bom"
              value={order.bom || ''}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-rose-500 outline-none"
            >
              <option value="">-- Select BOM --</option>
              {boms.map(b => (
                <option key={b.id} value={b.id}>{b.product_name || b.code || `BOM-${b.id}`}</option>
              ))}
            </select>
          </div>

          {/* Routing */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Routing (Operations)</label>
            <select 
              name="routing"
              value={order.routing || ''}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-rose-500 outline-none"
            >
              <option value="">-- Select Routing --</option>
              {routings.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Planned Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Planned Start</label>
            <input 
              type="datetime-local" 
              name="date_planned_start"
              value={order.date_planned_start ? order.date_planned_start.slice(0, 16) : ''}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-rose-500 outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Work Orders Stepper */}
        {!isNew && workOrders.length > 0 && (
          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-slate-400" /> 
              Work Orders (Operations)
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-800/50 text-slate-300 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-medium">Operation</th>
                    <th className="px-6 py-3 font-medium">Expected Duration</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {workOrders.map((wo, idx) => (
                    <tr key={wo.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {idx + 1}. {wo.name}
                      </td>
                      <td className="px-6 py-4">{wo.duration_expected} min</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs ${
                          wo.state === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
                          wo.state === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {wo.state.toUpperCase().replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </form>
    </RecordFormLayout>
  );
}
