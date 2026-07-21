import React, { useState, useEffect } from 'react';
import DataTable from '../../../../core/components/shared/views/DataTable';
import inventoryService from '../../../../core/api/inventoryService';
import { Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Lots() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getLots();
      setLots(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch Lots/Serial Numbers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Lot/Serial Number', sortable: true },
    { key: 'inventory_item', label: 'Item ID' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'expiry_date', label: 'Expiry Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (val) => (
        <span className={`text-xs px-2 py-1 rounded-full ${val ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {val ? 'Active' : 'Archived'}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Tag className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Lots / Serial Numbers</h1>
            <p className="text-sm text-slate-400">Traceability across the supply chain</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns}
          data={lots}
          isLoading={loading}
          emptyMessage="No Lots/Serial Numbers found."
        />
      </div>
    </div>
  );
}
