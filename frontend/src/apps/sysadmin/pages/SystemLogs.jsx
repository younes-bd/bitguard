import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, AlertCircle, Download, Monitor } from 'lucide-react';
import { sysadminService } from '../api/sysadminService';

const SystemLogs = () => {
    const [logs, setLogs] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchLogs = () => {
        setLoading(true);
        sysadminService.getServerLogs()
            .then(res => setLogs(res.data.logs || 'No logs available.'))
            .catch(err => setLogs(`Error fetching logs: ${err.message}`))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleDownload = () => {
        const url = window.URL.createObjectURL(new Blob([logs]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'django_server_logs.txt');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Oswald'] uppercase flex items-center gap-3">
                        <Monitor className="text-blue-500" /> Live Server Logs
                    </h1>
                    <p className="text-slate-400 mt-1">Raw diagnostic output from the backend infrastructure.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchLogs} className="flex items-center gap-2 p-2 px-4 border border-slate-700 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors border-none cursor-pointer shadow-lg shadow-blue-900/20">
                        <Download size={16} /> Download Logs
                    </button>
                </div>
            </div>

            <div className="bg-[#0D1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
                <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5 mr-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                        </div>
                        <Terminal size={16} className="text-slate-500" />
                        <span className="text-xs font-mono text-slate-400">root@bitguard-enterprise: /var/log/django.log (tail -n 100)</span>
                    </div>
                    {loading && <span className="text-xs text-blue-400 flex items-center gap-2"><RefreshCw size={12} className="animate-spin" /> Polling stream...</span>}
                </div>
                
                <div className="p-4 overflow-x-auto min-h-[500px] max-h-[700px] overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed">
                    {loading && !logs ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <RefreshCw className="animate-spin mb-4" size={24} />
                            <span>Establishing log stream connection...</span>
                        </div>
                    ) : (
                        <pre className="text-slate-300 whitespace-pre-wrap break-all">
                            {logs.split('\n').map((line, idx) => {
                                let colorClass = 'text-slate-300';
                                if (line.includes('ERROR') || line.includes('CRITICAL') || line.includes('Traceback') || line.includes('Exception')) {
                                    colorClass = 'text-red-400 font-bold';
                                } else if (line.includes('WARNING')) {
                                    colorClass = 'text-amber-400';
                                } else if (line.includes('INFO')) {
                                    colorClass = 'text-blue-300';
                                }
                                
                                return (
                                    <div key={idx} className={`${colorClass} hover:bg-slate-800/50 px-2 rounded`}>
                                        <span className="text-slate-600 select-none mr-4 text-xs">{String(idx + 1).padStart(3, '0')}</span>
                                        {line}
                                    </div>
                                );
                            })}
                        </pre>
                    )}
                </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-400/90 leading-relaxed">
                    <strong>Security Notice:</strong> Raw server logs may contain sensitive stack traces or environment variables if debug mode is active. Ensure proper access controls are maintained for this dashboard module.
                </p>
            </div>
        </div>
    );
};

export default SystemLogs;
