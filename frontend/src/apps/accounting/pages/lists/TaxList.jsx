import React, { useState, useEffect } from 'react';
import DataTable from '../../../../core/components/shared/views/DataTable';
import { erpService } from '../../../../core/api/erpService';
import { Percent } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TaxList() {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const res = await erpService.getTaxesV2();
      setTaxes(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch taxes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Tax Name', sortable: true },
    { 
      key: 'tax_type', 
      label: 'Type',
      render: (val) => (
        <span className={`text-xs px-2 py-1 rounded-full ${val === 'sale' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-500/10 text-orange-400'}`}>
          {val === 'sale' ? 'Sales Tax' : 'Purchase Tax'}
        </span>
      )
    },
    { 
      key: 'computation', 
      label: 'Computation',
      render: (val) => val === 'percent' ? 'Percentage' : 'Fixed Amount'
    },
    { key: 'amount', label: 'Amount/Rate' },
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
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Percent className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Taxes</h1>
            <p className="text-sm text-slate-400">Manage tax rates and groups</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns}
          data={taxes}
          isLoading={loading}
          emptyMessage="No taxes configured."
        />
      </div>
    </div>
  );
}
