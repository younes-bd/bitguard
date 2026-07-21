import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Sparkles, Activity, Box, CheckCircle, AlertOctagon, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mrpService from '../../../../core/api/mrpService';
import DataTable from '../../../../core/components/shared/views/DataTable';

export default function MrpDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    mrpService.getOrders().then(data => {
      setOrders(Array.isArray(data) ? data : data.results || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const now = new Date();
  
  const inProgress = orders.filter(o => o.state === 'in_progress').length;
  
  const doneThisMonth = orders.filter(o => {
    if (o.state !== 'done' || !o.date_planned_finished) return false;
    const fin = new Date(o.date_planned_finished);
    return fin.getMonth() === now.getMonth() && fin.getFullYear() === now.getFullYear();
  }).length;

  const blocked = orders.filter(o => {
    if (o.state === 'done' || o.state === 'cancel') return false;
    if (!o.date_planned_start) return false;
    return new Date(o.date_planned_start) < now;
  }).length;

  // Bar chart logic
  const chartData = useMemo(() => {
    // Last 8 weeks
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(now.getDate() - (i * 7 + now.getDay()));
      start.setHours(0,0,0,0);
      
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23,59,59,999);
      
      let count = 0;
      orders.forEach(o => {
        if (o.state === 'done' && o.date_planned_finished) {
          const d = new Date(o.date_planned_finished);
          if (d >= start && d <= end) count++;
        }
      });
      
      weeks.push({
        label: `W${start.getDate()}/${start.getMonth()+1}`,
        count,
        maxCount: Math.max(1, count) // track max for scaling
      });
    }
    
    const maxVal = Math.max(...weeks.map(w => w.count), 5); // at least 5 for scale
    
    return weeks.map(w => ({
      ...w,
      height: `${(w.count / maxVal) * 100}%`
    }));
  }, [orders, now]);

  const recentColumns = [
    { key: 'name', label: 'Reference' },
    { key: 'product_name', label: 'Product' },
    { key: 'qty_to_produce', label: 'Qty' },
    { 
      key: 'state', 
      label: 'Status',
      render: (val) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          val === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
          val === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
          val === 'cancel' ? 'bg-red-500/10 text-red-400' :
          'bg-slate-800 text-slate-300'
        }`}>{val?.toUpperCase().replace('_', ' ')}</span>
      )
    },
    { key: 'date_planned_start', label: 'Planned Start', render: (val) => val ? new Date(val).toLocaleDateString() : '-' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-rose-400 dark:from-rose-400 dark:to-rose-300">
            Manufacturing Operations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Monitor shop floor activity, work orders, and overall equipment effectiveness.
          </p>
        </div>
        <button 
          onClick={() => navigate('/mrp/orders/new')}
          className="flex items-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/30 transition-all hover:scale-105 active:scale-95 font-medium"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          New Order
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Box className="w-5 h-5 text-slate-400" />
            <h3 className="text-slate-400 font-medium text-sm">Total Orders</h3>
          </div>
          <p className="text-3xl font-bold text-white">{loading ? '...' : orders.length}</p>
        </div>
        
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-blue-400 font-medium text-sm">In Progress</h3>
          </div>
          <p className="text-3xl font-bold text-white">{loading ? '...' : inProgress}</p>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-emerald-400 font-medium text-sm">Done This Month</h3>
          </div>
          <p className="text-3xl font-bold text-white">{loading ? '...' : doneThisMonth}</p>
        </div>

        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <div className="flex items-center gap-3 mb-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <h3 className="text-red-400 font-medium text-sm">Blocked (Overdue)</h3>
          </div>
          <p className="text-3xl font-bold text-white">{loading ? '...' : blocked}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 col-span-1 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-200">Production (8 Weeks)</h3>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 min-h-[200px] mt-4">
            {chartData.map((w, i) => (
              <div key={i} className="flex flex-col items-center flex-1 group">
                <div className="w-full relative flex items-end justify-center h-[180px] rounded bg-slate-800/50 mb-2">
                  <div 
                    style={{ height: w.height }} 
                    className="w-full bg-rose-500/80 rounded-t transition-all group-hover:bg-rose-400 group-hover:shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  ></div>
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 transition-opacity">
                    {w.count}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent MOs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Manufacturing Orders</h3>
          <div className="overflow-hidden border border-slate-800 rounded-xl">
             <DataTable 
                columns={recentColumns}
                data={orders.slice(0, 5)}
                isLoading={loading}
                onRowClick={(row) => navigate(`/mrp/orders/${row.id}`)}
              />
          </div>
        </div>
      </div>

    </div>
  );
}
