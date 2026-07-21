import React, { useState, useEffect, useMemo } from 'react';
import DataTable from '../../../../core/components/shared/views/DataTable';
import inventoryService from '../../../../core/api/inventoryService';
import { DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ValuationReport() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getInventoryItems();
      setItems(res.results || res || []);
    } catch (err) {
      toast.error('Failed to load valuation data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = useMemo(() => {
    return items.reduce((acc, item) => {
      const val = (item.quantity_on_hand || 0) * (parseFloat(item.unit_price || item.unit_cost || 0));
      return acc + val;
    }, 0);
  }, [items]);

  const columns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'sku', label: 'SKU' },
    { key: 'quantity_on_hand', label: 'Qty On Hand', sortable: true },
    { 
      key: 'unit_price', 
      label: 'Unit Cost', 
      render: (val, row) => `$${parseFloat(val || row.unit_cost || 0).toFixed(2)}` 
    },
    { 
      key: 'total_value', 
      label: 'Total Value', 
      sortable: true,
      render: (_, row) => {
        const val = (row.quantity_on_hand || 0) * parseFloat(row.unit_price || row.unit_cost || 0);
        return <span className="font-semibold text-emerald-400">${val.toFixed(2)}</span>;
      }
    }
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
      <div className="flex justify-between items-end mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <DollarSign className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Inventory Valuation</h1>
            <p className="text-sm text-slate-400">Total value of stock on hand</p>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-4 flex flex-col items-end">
          <span className="text-sm text-slate-400">Total Portfolio Value</span>
          <span className="text-3xl font-bold text-emerald-400">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden border border-slate-800 rounded-xl">
        <DataTable 
          columns={columns}
          data={items}
          isLoading={loading}
          emptyMessage="No inventory data available for valuation."
        />
      </div>
    </div>
  );
}
