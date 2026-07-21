import React, { useState, useEffect } from 'react';
import RecordFormLayout from '../../../../core/components/shared/forms/RecordFormLayout';
import inventoryService from '../../../../core/api/inventoryService';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InventoryAdjustment() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [adjustment, setAdjustment] = useState({
    inventory_item: '',
    counted_quantity: 0,
    reason: ''
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getInventoryItems();
      setItems(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdjustment(prev => ({ ...prev, [name]: value }));
  };

  const handleAdjust = async (e) => {
    e.preventDefault();
    if (!adjustment.inventory_item) {
      toast.error('Please select an item to adjust');
      return;
    }
    
    try {
      setSaving(true);
      const currentItem = items.find(i => i.id.toString() === adjustment.inventory_item.toString());
      const difference = adjustment.counted_quantity - currentItem.quantity_on_hand;
      
      await inventoryService.adjustStock(adjustment.inventory_item, { 
        quantity: difference,
        reason: adjustment.reason
      });
      
      toast.success('Stock adjusted successfully');
      navigate('/inventory'); // Back to dashboard
    } catch (err) {
      toast.error('Failed to adjust stock');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const selectedItem = items.find(i => i.id.toString() === adjustment.inventory_item.toString());
  const difference = selectedItem ? (adjustment.counted_quantity - selectedItem.quantity_on_hand) : 0;

  const breadcrumbs = [
    { label: 'Inventory', href: '/inventory' },
    { label: 'Operations', href: '/inventory' },
    { label: 'Stock Adjustment' }
  ];

  return (
    <RecordFormLayout
      title="Inventory Adjustment"
      breadcrumbs={breadcrumbs}
      actions={[{ label: 'Apply Adjustment', variant: 'primary', onClick: handleAdjust }]}
    >
      <form onSubmit={handleAdjust} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Inventory Item</label>
            <select 
              name="inventory_item"
              value={adjustment.inventory_item}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            >
              <option value="">-- Select Item --</option>
              {items.map(i => (
                <option key={i.id} value={i.id}>{i.name} (SKU: {i.sku || 'N/A'})</option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Reason (Optional)</label>
            <input 
              type="text" 
              name="reason"
              value={adjustment.reason}
              onChange={handleChange}
              placeholder="e.g., Annual stock count"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          {selectedItem && (
            <>
              {/* Current Qty (Readonly) */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">System Quantity</label>
                <div className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-400">
                  {selectedItem.quantity_on_hand}
                </div>
              </div>

              {/* Counted Qty */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Counted Quantity</label>
                <input 
                  type="number" 
                  name="counted_quantity"
                  value={adjustment.counted_quantity}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Difference Preview */}
              <div className="col-span-2">
                <div className={`p-4 rounded-xl flex items-center justify-between border ${difference > 0 ? 'bg-emerald-500/10 border-emerald-500/30' : difference < 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800 border-slate-700'}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-400">Expected Change</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xl font-bold text-slate-200">{selectedItem.quantity_on_hand}</span>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <span className={`text-xl font-bold ${difference > 0 ? 'text-emerald-400' : difference < 0 ? 'text-red-400' : 'text-slate-200'}`}>
                        {adjustment.counted_quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-slate-400">Difference</span>
                    <div className={`text-2xl font-bold ${difference > 0 ? 'text-emerald-400' : difference < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {difference > 0 ? '+' : ''}{difference}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </RecordFormLayout>
  );
}
