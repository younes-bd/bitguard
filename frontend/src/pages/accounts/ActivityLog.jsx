import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../shared/core/services/client';
import { ArrowLeft, Monitor, AlertCircle, Clock, Shield } from 'lucide-react';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await client.get('accounts/security/logs/');
                setLogs(res.data);
            } catch (err) {
                console.error("Failed to fetch logs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/account/security" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Security Activity</h1>
                    <p className="text-slate-400">Full history of sign-ins and security events.</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading activity history...</div>
                ) : logs.length > 0 ? (
                    <div className="divide-y divide-slate-800">
                        {logs.map((log, i) => (
                            <div key={i} className="p-6 hover:bg-slate-800/30 transition-colors flex items-center justify-between group">
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 p-2 rounded-full ${log.status === 'success' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                                        <Monitor size={20} />
                                    </div>
                                    <div>
                                        <div className="text-slate-200 font-medium flex items-center gap-2">
                                            {log.status === 'success' ? 'Successful Sign-in' : 'Failed Login Attempt'}
                                            {log.status !== 'success' && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Alert</span>}
                                        </div>
                                        <div className="text-sm text-slate-400 mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(log.timestamp).toLocaleString()}</span>
                                            <span className="hidden sm:inline text-slate-700">•</span>
                                            <span className="flex items-center gap-1"><Shield size={12} /> IP: {log.ip_address}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 font-mono truncate max-w-xs">{log.user_agent}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center gap-4 text-slate-500">
                        <AlertCircle size={48} className="opacity-20" />
                        <p>No activity logs found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLog;
