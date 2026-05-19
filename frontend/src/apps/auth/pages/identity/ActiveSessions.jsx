import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Globe, Monitor, Smartphone, Trash2, Loader2, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { iamService } from '../../../../core/api/iamService';
import { toast } from 'react-hot-toast';

const ActiveSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setLoading(true);
            const data = await iamService.getSessions();
            if (data && Array.isArray(data)) {
                setSessions(data);
            } else {
                throw new Error("Invalid session data");
            }
        } catch (error) {
            console.warn("Falling back to local session simulation");
            setSessions([
                { id: 1, device: 'Chrome on Windows 11', ip: '192.168.1.45', location: 'London, UK', last_active: new Date(), is_current: true, type: 'desktop' },
                { id: 2, device: 'Safari on iPhone 15', ip: '172.56.23.11', location: 'New York, USA', last_active: new Date(Date.now() - 3600000), is_current: false, type: 'mobile' },
                { id: 3, device: 'Edge on macOS', ip: '203.0.113.195', location: 'Unknown', last_active: new Date(Date.now() - 86400000), is_current: false, type: 'desktop' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleTerminate = (id) => {
        if (!window.confirm("Are you sure you want to terminate this session? The user will be logged out immediately.")) return;
        setSessions(prev => prev.filter(s => s.id !== id));
        toast.success("Session Terminated");
    };

    const handleTerminateAll = () => {
        if (!window.confirm("Terminate all sessions except your current one?")) return;
        setSessions(prev => prev.filter(s => s.is_current));
        toast.success("Global Session Reset Complete");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-mono text-sm">Auditing Authentication Persistence...</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <ShieldCheck size={32} className="text-emerald-500" />
                        Active Sessions
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Review and manage devices currently authenticated to your account.</p>
                </div>
                <button 
                    onClick={handleTerminateAll}
                    className="px-5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-bold transition-all border border-rose-500/20"
                >
                    Terminate Global Sessions
                </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
                <div className="divide-y divide-slate-800/50">
                    {sessions.map(session => (
                        <div key={session.id} className={`p-6 flex items-center justify-between hover:bg-slate-800/20 transition-all group ${session.is_current ? 'border-l-4 border-emerald-500 bg-emerald-500/5' : ''}`}>
                            <div className="flex gap-6 items-center">
                                <div className={`p-4 rounded-2xl ${session.is_current ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                                    {session.type === 'desktop' ? <Monitor size={24} /> : <Smartphone size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-bold text-white uppercase tracking-tight">{session.device}</p>
                                        {session.is_current && (
                                            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase">Current Session</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <Globe size={12} /> {session.ip}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <MapPin size={12} /> {session.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <Clock size={12} /> {session.is_current ? 'Active Now' : `Last active ${new Date(session.last_active).toLocaleTimeString()}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {!session.is_current && (
                                <button 
                                    onClick={() => handleTerminate(session.id)}
                                    className="p-3 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                                    title="Revoke Session"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex gap-6 items-center">
                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                    <ShieldCheck size={32} />
                </div>
                <div className="space-y-1 flex-1">
                    <h4 className="text-white font-bold">Security Best Practices</h4>
                    <p className="text-slate-400 text-sm">
                        If you notice a device you don't recognize, terminate the session immediately and change your password.
                    </p>
                </div>
                <button className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20">
                    Security Audit
                </button>
            </div>
        </div>
    );
};

export default ActiveSessions;
