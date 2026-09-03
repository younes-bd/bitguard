import React, { useState, useEffect } from 'react';
import { Terminal, Search, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { aiAgentService } from '../../api/aiAgentService';

export default function AgentLogs() {
    const [logs, setLogs] = useState([]);
    const [agents, setAgents] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [agentsRes, logsRes] = await Promise.all([
                aiAgentService.getAgents(),
                aiAgentService.getLogs({ limit: 50 })
            ]);

            const agentMap = {};
            (agentsRes.data?.results || agentsRes.data || []).forEach(a => {
                agentMap[a.id] = a.name;
            });
            setAgents(agentMap);
            
            setLogs(logsRes.data?.results || logsRes.data || []);
        } catch (error) {
            console.error('Failed to load logs', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-200">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                        <Terminal className="text-purple-500 w-6 h-6" />
                        Execution Logs
                    </h1>
                    <p className="text-slate-400">Detailed audit trail of all autonomous agent actions.</p>
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="Search logs..."
                        className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                    />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Timestamp</th>
                            <th className="px-6 py-4 font-medium">Agent</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Input</th>
                            <th className="px-6 py-4 font-medium">Duration</th>
                            <th className="px-6 py-4 font-medium">Tokens</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No execution logs found.
                                </td>
                            </tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        {agents[log.agent] || `Agent #${log.agent}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.status === 'success' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <CheckCircle2 className="w-3 h-3" /> Success
                                            </span>
                                        ) : log.status === 'running' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                <Loader2 className="w-3 h-3 animate-spin" /> Running
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                <XCircle className="w-3 h-3" /> {log.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-slate-300" title={log.user_input}>
                                        {log.user_input || 'System Trigger'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {log.duration_ms} ms
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Terminal className="w-3.5 h-3.5" />
                                            {log.tokens_used.toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
