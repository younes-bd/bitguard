import React, { useState, useEffect } from 'react';
import DataTable from '../../../../core/components/shared/views/DataTable';
import inventoryService from '../../../../core/api/inventoryService';
import { Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductVariants() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getInventoryItems();
      setItems(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch product variants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Product Variant', sortable: true },
    { key: 'sku', label: 'SKU' },
    { key: 'quantity_on_hand', label: 'On Hand' },
    { key: 'unit_price', label: 'Cost', render: (val) => val ? `$${parseFloat(val).toFixed(2)}` : '-' },
    { key: 'location', label: 'Location' }
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Layers className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Product Variants</h1>
            <p className="text-sm text-slate-400">Manage distinct SKUs and attributes</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns}
          data={items}
          isLoading={loading}
          emptyMessage="No product variants found."
        />
      </div>
    </div>
  );
}
