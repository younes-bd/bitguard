import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Sparkles, Activity, CreditCard, Monitor, Utensils, Play, Settings } from 'lucide-react';
import posService from '../../../../core/api/posService';
import { useNavigate } from 'react-router-dom';

const PosDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      posService.getSessions().catch(() => ({ results: [] })),
      posService.getOrders().catch(() => ({ results: [] })),
      posService.getConfigs().catch(() => ({ results: [] }))
    ]).then(([sessData, ordData, confData]) => {
      setSessions(Array.isArray(sessData) ? sessData : sessData.results || []);
      setOrders(Array.isArray(ordData) ? ordData : ordData.results || []);
      setConfigs(Array.isArray(confData) ? confData : confData.results || []);
      setLoading(false);
    });
  }, []);

  const openSessions = sessions.filter(s => s.state === 'open').length;
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.amount_total || 0), 0);

  const startSession = async (configId) => {
    try {
      // Check if there is already an open session for this config
      const existing = sessions.find(s => s.config === configId && s.state === 'opened');
      if (existing) {
        navigate(`/admin/pos/terminal?session_id=${existing.id}`);
        return;
      }
      
      const newSession = await posService.createSession({ config_id: configId });
      await posService.openSession(newSession.id, { cash_register_balance_start: 0 });
      navigate(`/admin/pos/terminal?session_id=${newSession.id}`);
    } catch (e) {
      console.error("Failed to start session", e);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300">
            Point of Sale
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Manage your retail and restaurant operations seamlessly.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 font-medium">
          <Sparkles className="w-5 h-5 mr-2" />
          Quick Action
        </button>
      </div>

      {/* Config Cards (Odoo-style Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full text-center p-12 text-slate-500">Loading configurations...</div>
        ) : configs.length === 0 ? (
           <div className="col-span-full text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
             <Monitor className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">No POS Configured</h3>
             <p className="text-slate-500">You need to set up a Point of Sale in settings before starting a session.</p>
           </div>
        ) : (
          configs.map((config) => {
            const activeSession = sessions.find(s => s.config === config.id && s.state === 'opened');
            
            return (
              <div key={config.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${config.is_restaurant ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                      {config.is_restaurant ? <Utensils className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{config.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.is_restaurant ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                        {config.is_restaurant ? 'Restaurant / Bar' : 'Retail Shop'}
                      </span>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Body */}
                <div className="p-5 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Last closing balance: <span className="font-medium text-slate-700 dark:text-slate-300">$0.00</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => startSession(config.id)}
                    className="w-full flex items-center justify-center py-3 px-4 bg-slate-900 hover:bg-emerald-600 dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-500 text-white rounded-xl shadow-md transition-colors font-semibold"
                  >
                    {activeSession ? 'Resume Session' : 'New Session'}
                    <Play className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center space-x-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
            <LayoutDashboard className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total Orders Today</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{loading ? '...' : orders.length}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center space-x-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl">
            <CreditCard className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Gross Revenue</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">${loading ? '...' : totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PosDashboard;
