import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Server, Users, AlertTriangle, Settings, Shield, RefreshCw, CheckCircle2 } from 'lucide-react';
import { sysadminService } from '../api/sysadminService';

const MetricCard = ({ title, value, icon: Icon, trend, colorClass, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-300 cursor-pointer group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${colorClass.split(' ')[0]} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${colorClass.split(' ')[1]}`} />
      </div>
      {trend && (
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors uppercase tracking-widest">{title}</h3>
    <p className="text-slate-900 dark:text-white text-3xl font-bold mt-1 tracking-tight">{value}</p>
  </div>
);

const SysadminDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    active_users: 0,
    error_rate: 0,
    server_uptime: '0%',
    cpu_load: '0%',
    cpu_cores_load: [],
    memory: { total: 0, used: 0, percent: 0 },
    disk: { total: 0, used: 0, percent: 0 },
    services_health: []
  });

  const [activities, setActivities] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [notification, setNotification] = useState(null);
  const [telemetryModal, setTelemetryModal] = useState(null); // 'health', 'performance', or null

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
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
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

  const handleDownloadReport = async () => {
    try {
      const response = await sysadminService.generateReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sysadmin_platform_report.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setNotification({ type: 'success', message: 'Platform report downloaded successfully.' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Failed to download report", error);
      setNotification({ type: 'error', message: 'Failed to generate report.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Oswald'] uppercase">System Administration</h1>
          <p className="text-slate-400 mt-2">Enterprise Command Center & Platform Health</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/system/settings" className="flex items-center px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-850 hover:text-white transition-colors shadow-sm font-medium">
            <Settings className="w-4 h-4 mr-2" /> Configure
          </Link>
          <button onClick={handleDownloadReport} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors shadow-md font-medium border-none cursor-pointer">
            <Activity className="w-4 h-4 mr-2" /> Generate Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard onClick={() => navigate('/admin/iam/sessions')} title="Active Connections" value={metrics.active_users.toLocaleString()} icon={Users} trend="+12.5%" colorClass="bg-blue-500/10 text-blue-400 border-blue-500/20" />
        <MetricCard onClick={() => setTelemetryModal('health')} title="Global Uptime" value={metrics.server_uptime} icon={Server} colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" />
        <MetricCard onClick={() => navigate('/admin/system/logs')} title="System Error Rate" value={`${metrics.error_rate}%`} icon={AlertTriangle} trend="-0.02%" colorClass="bg-amber-500/10 text-amber-400 border-amber-500/20" />
        <MetricCard onClick={() => setTelemetryModal('performance')} title="Average CPU Load" value={metrics.cpu_load} icon={Activity} colorClass="bg-purple-500/10 text-purple-400 border-purple-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Status feed */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" /> System Activity Stream
          </h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {activities.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-sm">No recent activity found.</div>
            ) : (
                activities.map((act, index) => (
                    <div key={act.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${act.action === 'settings_change' ? 'text-amber-500 bg-amber-500/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                            {act.action === 'settings_change' ? <Settings className="w-5 h-5"/> : <Shield className="w-5 h-5"/>}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-950/50 p-4 rounded-xl shadow-sm border border-slate-800">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-white text-sm capitalize">{act.action.replace('_', ' ')}</div>
                                <time className="font-mono text-xs text-slate-500">
                                    {act.created_at ? new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                                </time>
                            </div>
                            <div className="text-slate-400 text-sm">{act.user_email || act.user_name || 'System'} modified {act.resource_type}. {act.details?.message || ''}</div>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* Quick Actions / Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-6 h-fit">
           <h2 className="text-lg font-bold text-white mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-slate-400" /> Platform Maintenance
          </h2>
          <div className="space-y-3">
             <button onClick={() => handleAction('cache', sysadminService.clearCache)} disabled={loadingAction} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/20 hover:bg-slate-800/40 hover:border-slate-700 transition-colors group disabled:opacity-50 cursor-pointer">
                <div className="flex items-center text-slate-300 font-medium text-sm">
                    {loadingAction === 'cache' ? <RefreshCw className="w-4 h-4 mr-3 animate-spin text-emerald-500" /> : <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></span>}
                    Clear System Cache
                </div>
                <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Execute</span>
             </button>
             <button onClick={() => handleAction('index', sysadminService.syncIndexes)} disabled={loadingAction} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/20 hover:bg-slate-800/40 hover:border-slate-700 transition-colors group disabled:opacity-50 cursor-pointer">
                <div className="flex items-center text-slate-300 font-medium text-sm">
                    {loadingAction === 'index' ? <RefreshCw className="w-4 h-4 mr-3 animate-spin text-blue-500" /> : <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>}
                    Sync Search Indexes
                </div>
                <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Execute</span>
             </button>
             <button onClick={() => handleAction('maint', sysadminService.toggleMaintenance)} disabled={loadingAction} className="w-full flex items-center justify-between p-4 rounded-xl border border-red-950/50 bg-slate-950/20 hover:bg-red-950/20 hover:border-red-900/40 transition-colors group disabled:opacity-50 cursor-pointer">
                <div className="flex items-center text-red-400 font-medium text-sm">
                    {loadingAction === 'maint' ? <RefreshCw className="w-4 h-4 mr-3 animate-spin text-red-500" /> : <span className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse"></span>}
                    Toggle Maintenance Mode
                </div>
                <span className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Danger</span>
             </button>
          </div>
        </div>
      </div>

      {/* Telemetry Modals */}
      {telemetryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setTelemetryModal(null)} className="absolute top-4 right-4 bg-transparent border-none text-slate-500 hover:text-slate-300 text-lg cursor-pointer">✕</button>
            
            {telemetryModal === 'health' ? (
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4 font-['Oswald'] tracking-wider uppercase">
                  <Server className="text-emerald-400" /> Services Health & Status
                </h3>
                <div className="space-y-3">
                  {(metrics.services_health || []).map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-850">
                      <div>
                        <div className="text-sm font-semibold text-white">{service.name}</div>
                        <div className="text-xs text-slate-500">Response latency: {service.latency}</div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${service.color}`}>
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4 font-['Oswald'] tracking-wider uppercase">
                  <Activity className="text-purple-400" /> System Telemetry & Performance
                </h3>
                <div className="space-y-4">
                  {/* CPU Load Gauges */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                      <span>CPU Core Utilisation</span>
                      <span>{metrics.cpu_load} Average</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(metrics.cpu_cores_load || []).map((load, idx) => (
                        <div key={idx} className="bg-slate-950/50 p-2 rounded-lg border border-slate-850 text-center">
                          <span className="block text-[10px] text-slate-500">Core {idx + 1}</span>
                          <span className="text-sm font-bold text-white">{load}%</span>
                          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-purple-500 h-full" style={{ width: `${load}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RAM & Disk gauges */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                        <span>Memory Utilisation</span>
                        <span>{formatBytes(metrics.memory?.used || 0)} / {formatBytes(metrics.memory?.total || 0)} ({metrics.memory?.percent || 0}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                        <div className="bg-blue-500 h-full" style={{ width: `${metrics.memory?.percent || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                        <span>Main Partition Disk Storage</span>
                        <span>{formatBytes(metrics.disk?.used || 0)} / {formatBytes(metrics.disk?.total || 0)} ({metrics.disk?.percent || 0}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                        <div className="bg-amber-500 h-full" style={{ width: `${metrics.disk?.percent || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SysadminDashboard;
