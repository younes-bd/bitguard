import React, { useState, useEffect } from 'react';
import DataTable from '@/core/components/shared/views/DataTable';
import inventoryService from '../../api/inventoryService';
import { Truck, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StockPickingList() {
  const [pickings, setPickings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickings();
  }, []);

  const fetchPickings = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getPickings();
      setPickings(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch transfers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Reference', sortable: true },
    { key: 'origin', label: 'Source Document' },
    { 
      key: 'picking_type', 
      label: 'Type',
      render: (val) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          val === 'receipt' ? 'bg-blue-500/10 text-blue-400' :
          val === 'delivery' ? 'bg-emerald-500/10 text-emerald-400' :
          val === 'return' ? 'bg-rose-500/10 text-rose-400' :
          'bg-slate-800 text-slate-300'
        }`}>{val?.charAt(0).toUpperCase() + val?.slice(1)}</span>
      )
    },
    { key: 'scheduled_date', label: 'Scheduled Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
    { 
      key: 'state', 
      label: 'Status',
      render: (val) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          val === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
          val === 'confirmed' ? 'bg-amber-500/10 text-amber-400' :
          val === 'cancel' ? 'bg-red-500/10 text-red-400' :
          'bg-slate-800 text-slate-400'
        }`}>{val?.toUpperCase()}</span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex justify-end" onClick={e => e.stopPropagation()}>
          <button
            onClick={async () => {
              try {
                const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
                const res = await reportingService.generateReport(null, 'stock.StockPicking', row.id);
                if (res && res.url) {
                  window.open(res.url, '_blank');
                }
              } catch (err) {
                console.error('Failed to generate PDF', err);
              }
            }}
            className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Truck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Transfers (Pickings)</h1>
            <p className="text-sm text-slate-400">Receipts, deliveries, and internal moves</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns}
          data={pickings}
          isLoading={loading}
          onRowClick={(row) => window.location.href = `/admin/stock/transfers/${row.id}`}
          emptyMessage="No transfers found."
        />
      </div>
    </div>
  );
}
