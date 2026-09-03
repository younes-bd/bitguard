import React, { useState, useEffect } from 'react';
import { BarChart3, Loader2, DollarSign, Cpu, TrendingUp } from 'lucide-react';
import { aiAgentService } from '../../api/aiAgentService';

export default function UsageDashboard() {
    const [usage, setUsage] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsage();
    }, []);

    const fetchUsage = async () => {
        try {
            const res = await aiAgentService.getUsage({ limit: 100 });
            setUsage(res.data?.results || res.data || []);
        } catch (error) {
            console.error('Failed to load usage data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
    }

    const totalTokens = usage.reduce((sum, item) => sum + (item.tokens_used || 0), 0);
    const totalCost = usage.reduce((sum, item) => sum + parseFloat(item.cost_usd || 0), 0);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-200">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                    <BarChart3 className="text-purple-500 w-6 h-6" />
                    Token Usage & Analytics
                </h1>
                <p className="text-slate-400">Monitor AI Engine consumption and estimated API costs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-300">Total Tokens</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{totalTokens.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-300">Estimated Cost</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">${totalCost.toFixed(4)}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-300">API Requests</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{usage.length}</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-8">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="font-semibold text-white">Recent API Requests</h3>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Timestamp</th>
                            <th className="px-6 py-4 font-medium">Provider</th>
                            <th className="px-6 py-4 font-medium">Feature Context</th>
                            <th className="px-6 py-4 font-medium">Tokens Used</th>
                            <th className="px-6 py-4 font-medium">Cost (USD)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {usage.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No usage data recorded yet.
                                </td>
                            </tr>
                        ) : (
                            usage.map(item => (
                                <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                        {new Date(item.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white capitalize">
                                        {item.provider}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {item.feature}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 font-mono">
                                        {item.tokens_used.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-emerald-400 font-mono">
                                        ${parseFloat(item.cost_usd).toFixed(6)}
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
