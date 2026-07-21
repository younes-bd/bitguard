import React from 'react';
import { Activity, DollarSign, Users, ShoppingBag } from 'lucide-react';

const SalesDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Sales Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your sales performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
              <DollarSign size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-300">Total Sales</h3>
          </div>
          <div className="text-4xl font-black text-white">$0.00</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-300">Orders</h3>
          </div>
          <div className="text-4xl font-black text-white">0</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Activity size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-300">Quotations</h3>
          </div>
          <div className="text-4xl font-black text-white">0</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-300">Customers</h3>
          </div>
          <div className="text-4xl font-black text-white">0</div>
        </div>
      </div>
      
      <div className="glass-panel rounded-2xl border border-slate-700/50 p-12 flex flex-col items-center justify-center text-center">
        <Activity size={48} className="text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Sales Analytics Coming Soon</h3>
        <p className="text-slate-400 max-w-md">Detailed charts and pipeline analysis will be available here based on your confirmed sales orders and quotations.</p>
      </div>
    </div>
  );
};

export default SalesDashboard;
