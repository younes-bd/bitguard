import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Server, Users, AlertTriangle, Settings, Shield, RefreshCw, CheckCircle2 } from 'lucide-react';
import { sysadminService } from '../api/sysadminService';

const MetricCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-slate-900 dark:text-white text-3xl font-bold mt-1 tracking-tight">{value}</p>
  </div>
);

const SysadminDashboard = () => {
  const [metrics, setMetrics] = useState({
    active_users: 0,
    error_rate: 0,
    server_uptime: '0%',
    cpu_load: '0%'
  });

  const [activities, setActivities] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchData = async () => {
    try {
      const metricsRes = await sysadminService.getSystemMetrics();
      if (metricsRes.data) setMetrics(metricsRes.data);
      
      const auditRes = await sysadminService.getAuditLogs({ limit: 5 });
      setActivities(auditRes.data?.results || auditRes.data || []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (actionName, triggerFn) => {
    setLoadingAction(actionName);
    try {
      const res = await triggerFn();
      setNotification({ type: 'success', message: res.data?.status || 'Action completed successfully.' });
      setTimeout(() => setNotification(null), 3000);
      fetchData(); // Refresh logs to show the new audit
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to complete action.' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up relative">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-xl flex items-center space-x-3 z-50 animate-in slide-in-from-top-4 text-white ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold text-sm">{notification.message}</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Administration</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Enterprise Command Center & Platform Health</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/system/settings" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium">
            <Settings className="w-4 h-4 mr-2" /> Configure
          </Link>
          <button onClick={() => sysadminService.generateReport()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/30 font-medium">
            <Activity className="w-4 h-4 mr-2" /> Generate Report
          </button>
        </div>
      </div>

      {/* KPI KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Active Connections" value={metrics.active_users.toLocaleString()} icon={Users} trend="+12.5%" colorClass="bg-blue-500 text-blue-500" />
        <MetricCard title="Global Uptime" value={metrics.server_uptime} icon={Server} trend="+0.01%" colorClass="bg-emerald-500 text-emerald-500" />
        <MetricCard title="System Error Rate" value={`${metrics.error_rate}%`} icon={AlertTriangle} trend="-0.02%" colorClass="bg-amber-500 text-amber-500" />
        <MetricCard title="Average CPU Load" value={metrics.cpu_load} icon={Activity} trend="-5%" colorClass="bg-purple-500 text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Status feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-500" /> System Activity Stream
          </h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {activities.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-sm">No recent activity found.</div>
            ) : (
                activities.map((act, index) => (
                    <div key={act.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 dark:bg-slate-700 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${act.action === 'settings_change' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {act.action === 'settings_change' ? <Settings className="w-5 h-5"/> : <Shield className="w-5 h-5"/>}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm capitalize">{act.action.replace('_', ' ')}</div>
                                <time className="font-mono text-xs text-slate-500">
                                    {act.created_at ? new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                                </time>
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-sm">{act.user_name || act.user_email || 'System'} modified {act.resource_type}. {act.details?.message || ''}</div>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* Quick Actions / Configuration */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-fit">
           <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-slate-500" /> Platform Maintenance
          </h2>
          <div className="space-y-3">
             <button onClick={() => handleAction('cache', sysadminService.clearCache)} disabled={loadingAction} className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group disabled:opacity-50">
                <div className="flex items-center text-slate-700 dark:text-slate-300 font-medium text-sm">
                    {loadingAction === 'cache' ? <RefreshCw className="w-4 h-4 mr-3 animate-spin text-emerald-500" /> : <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></span>}
                    Clear System Cache
                </div>
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Execute</span>
             </button>
             <button onClick={() => handleAction('index', sysadminService.syncIndexes)} disabled={loadingAction} className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group disabled:opacity-50">
                <div className="flex items-center text-slate-700 dark:text-slate-300 font-medium text-sm">
                    {loadingAction === 'index' ? <RefreshCw className="w-4 h-4 mr-3 animate-spin text-blue-500" /> : <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>}
                    Sync Search Indexes
                </div>
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Execute</span>
             </button>
             <button onClick={() => handleAction('maint', sysadminService.toggleMaintenance)} disabled={loadingAction} className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group disabled:opacity-50">
                <div className="flex items-center text-red-600 dark:text-red-400 font-medium text-sm">
                    {loadingAction === 'maint' ? <RefreshCw className="w-4 h-4 mr-3 animate-spin text-red-500" /> : <span className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse"></span>}
                    Toggle Maintenance Mode
                </div>
                <span className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Danger</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SysadminDashboard;
