import React, { useState, useEffect } from 'react';
import DataTable from '../../../../core/components/shared/views/DataTable';
import { erpService } from '../../../../core/api/erpService';
import { Link2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function BankReconciliationList() {
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReconciliations();
  }, []);

  const fetchReconciliations = async () => {
    try {
      setLoading(true);
      const res = await erpService.getBankReconciliations();
      setReconciliations(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch reconciliations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'date', label: 'Date', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
    { key: 'journal', label: 'Journal ID' },
    { key: 'statement_balance', label: 'Statement Balance', render: (val) => `$${parseFloat(val || 0).toFixed(2)}` },
    { key: 'system_balance', label: 'System Balance', render: (val) => `$${parseFloat(val || 0).toFixed(2)}` },
    { key: 'difference', label: 'Difference', render: (val) => {
        const num = parseFloat(val || 0);
        return <span className={num !== 0 ? 'text-red-400 font-medium' : 'text-emerald-400 font-medium'}>
          ${num.toFixed(2)}
        </span>;
      }
    },
    { 
      key: 'is_reconciled', 
      label: 'Status',
      render: (val) => (
        <span className={`text-xs px-2 py-1 rounded-full ${val ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
          {val ? 'Reconciled' : 'Pending'}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Link2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Bank Reconciliations</h1>
            <p className="text-sm text-slate-400">Match bank statements with system ledgers</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns}
          data={reconciliations}
          isLoading={loading}
          emptyMessage="No bank reconciliations found."
        />
      </div>
    </div>
  );
}
