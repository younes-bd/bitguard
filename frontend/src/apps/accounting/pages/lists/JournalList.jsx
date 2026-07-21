import React, { useState, useEffect } from 'react';
import DataTable from '../../../../core/components/shared/views/DataTable';
import { erpService } from '../../../../core/api/erpService';
import { BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function JournalList() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const res = await erpService.getAccountJournals();
      setJournals(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch journals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Journal Name', sortable: true },
    { key: 'code', label: 'Short Code' },
    { 
      key: 'journal_type', 
      label: 'Type',
      render: (val) => (
        <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-full">
          {val?.toUpperCase()}
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

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Accounting Journals</h1>
            <p className="text-sm text-slate-400">Manage transaction ledgers</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns}
          data={journals}
          isLoading={loading}
          emptyMessage="No accounting journals found."
        />
      </div>
    </div>
  );
}
