import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mrpService from '../../api/mrpService';
import DataTable from '@/core/components/shared/views/DataTable';
import { Plus, List as ListIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function BomList() {
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoms();
  }, []);

  const fetchBoms = async () => {
    try {
      setLoading(true);
      const res = await mrpService.getBOMs();
      setBoms(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch Bills of Material');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'product_name', label: 'Product Name', sortable: true },
    { key: 'code', label: 'BOM Code' },
    { key: 'quantity', label: 'Quantity' },
    { 
      key: 'type', 
      label: 'BOM Type',
      render: (val) => (
        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
          {val === 'phantom' ? 'Kit / Phantom' : 'Manufacture'}
        </span>
      )
    },
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

  const actions = [
    {
      label: 'New BOM',
      icon: Plus,
      variant: 'primary',
      onClick: () => navigate('/mrp/boms/new')
    }
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <ListIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Bills of Material</h1>
            <p className="text-sm text-slate-400">Manage component lists for manufactured products</p>
          </div>
        </div>
        <div className="flex space-x-3">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
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
          data={boms}
          isLoading={loading}
          onRowClick={(row) => navigate(`/mrp/boms/${row.id}`)}
          emptyMessage="No BOMs found."
        />
      </div>
    </div>
  );
}
