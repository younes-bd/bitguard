import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../core/components/shared/views/DataTable';
import crmService from '../api/crmService';
import { toast } from 'react-hot-toast';
import { Plus, Search, ArrowRightCircle } from 'lucide-react';

export default function LeadList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [search, setSearch] = useState('');
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0
  });

  const loadLeads = async () => {
    try {
      setLoading(true);
      // Construct query params
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...(search && { search })
      };
      
      const res = await crmService.getLeads(params);
      
      if (res.data?.results) {
        setLeads(res.data.results);
        setPagination(prev => ({ ...prev, total: res.data.count }));
      } else {
        setLeads(res.data);
        setPagination(prev => ({ ...prev, total: res.data.length }));
      }
    } catch (err) {
      toast.error('Failed to load leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [pagination.page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRowClick = (row) => {
    navigate(`/crm/leads/${row.id}`);
  };

  const handleBulkConvert = async (ids) => {
    try {
      // Typically we'd convert them one by one or via a bulk endpoint.
      // For this implementation, we'll convert the first one selected, or loop them.
      for (const id of ids) {
        await crmService.convertLead(id);
      }
      toast.success(`Converted ${ids.length} leads to deals`);
      setSelectedIds(new Set());
      loadLeads();
    } catch (err) {
      toast.error('Failed to convert some leads');
    }
  };

  const columns = [
    { key: 'title', label: 'Lead Title', sortable: true },
    { 
      key: 'contact_name', 
      label: 'Contact Name',
      render: (_, row) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Unknown'
    },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'new' ? 'bg-blue-500/10 text-blue-400' :
          status === 'qualified' ? 'bg-green-500/10 text-green-400' :
          status === 'lost' ? 'bg-red-500/10 text-red-400' :
          'bg-slate-800 text-slate-300'
        }`}>
          {status ? status.toUpperCase() : 'UNKNOWN'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Created On', 
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleDateString() : ''
    }
  ];

  const searchSlot = (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-slate-500" />
      </div>
      <input
        type="text"
        placeholder="Search leads..."
        value={search}
        onChange={handleSearchChange}
        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
      />
    </div>
  );

  const actions = [
    { label: 'Convert to Deal', icon: <ArrowRightCircle className="w-4 h-4" />, onClick: handleBulkConvert }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-950 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Leads</h1>
          <p className="text-sm text-slate-400 mt-1">Manage inbound inquiries and prospects</p>
        </div>
        <button 
          onClick={() => navigate('/crm/leads/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-900/20 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Lead
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable 
          columns={columns}
          data={leads}
          isLoading={loading}
          onRowClick={handleRowClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          actions={actions}
          searchSlot={searchSlot}
          pagination={{
            page: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onPageChange: (newPage) => setPagination(prev => ({ ...prev, page: newPage }))
          }}
        />
      </div>
    </div>
  );
}
