import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Sparkles, TrendingUp, Activity, FileText } from 'lucide-react';
import mrp_plmService from '../../api/plmService';

const PlmDashboard = () => {
  const [ecos, setEcos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    plmService.getECOs().then(data => {
      setEcos(Array.isArray(data) ? data : data.results || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const inProgress = ecos.filter(e => e.state === 'confirmed').length;
  const approved = ecos.filter(e => e.state === 'approved').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
            PLM
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Manage your operations seamlessly with Odoo-level architecture.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 font-medium">
          <Sparkles className="w-5 h-5 mr-2" />
          Quick Action
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total ECOs</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{loading ? '...' : ecos.length}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
              <Activity className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">In Progress</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{loading ? '...' : inProgress}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
              <Activity className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Approved</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{loading ? '...' : approved}</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20"></div>
        <div className="relative text-center space-y-4 max-w-md px-6">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <LayoutDashboard className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Workspace Ready</h2>
          <p className="text-slate-500 dark:text-slate-400">
            This module is structurally wired to the Django backend.
          </p>
        </div>
      </div>

    </div>
  );
};

export default PlmDashboard;
