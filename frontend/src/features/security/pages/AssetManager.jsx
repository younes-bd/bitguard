import React, { useState, useEffect } from 'react';
import { platformService } from '../../../shared/core/services/platformService';
import {
    ComputerDesktopIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ServerIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

const AssetManager = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, secure: 0, atRisk: 0, compromised: 0 });

    const fetchEndpoints = async () => {
        setLoading(true);
        try {
            const data = await platformService.getEndpoints();
            setEndpoints(data);

            // Calculate stats
            const currentStats = {
                total: data.length,
                secure: data.filter(e => e.status === 'secure').length,
                atRisk: data.filter(e => e.status === 'at_risk').length,
                compromised: data.filter(e => e.status === 'compromised').length
            };
            setStats(currentStats);
        } catch (error) {
            console.error("Failed to fetch endpoints", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEndpoints();
    }, []);

    const handleIsolate = async (id) => {
        try {
            await platformService.isolateEndpoint(id);
            // Optimistic update
            setEndpoints(prev => prev.map(e =>
                e.id === id ? { ...e, status: 'isolated' } : e
            ));
        } catch (error) {
            console.error("Failed to isolate endpoint", error);
            alert("Failed to isolate endpoint. Please try again.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'secure': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'at_risk': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'compromised': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'isolated': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'offline': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-500';
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Asset Inventory</h1>
                    <p className="text-slate-400 mt-1">Manage and monitor organization endpoints.</p>
                </div>
                <button
                    onClick={fetchEndpoints}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <ServerIcon className="w-4 h-4" />
                    Sync Assets
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">Total Assets</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
                        </div>
                        <ComputerDesktopIcon className="w-8 h-8 text-indigo-500 opacity-80" />
                    </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">Secure</p>
                            <h3 className="text-2xl font-bold text-emerald-500 mt-1">{stats.secure}</h3>
                        </div>
                        <ShieldCheckIcon className="w-8 h-8 text-emerald-500 opacity-80" />
                    </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">At Risk</p>
                            <h3 className="text-2xl font-bold text-amber-500 mt-1">{stats.atRisk}</h3>
                        </div>
                        <ExclamationTriangleIcon className="w-8 h-8 text-amber-500 opacity-80" />
                    </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm">Compromised</p>
                            <h3 className="text-2xl font-bold text-rose-500 mt-1">{stats.compromised}</h3>
                        </div>
                        <BoltIcon className="w-8 h-8 text-rose-500 opacity-80" />
                    </div>
                </div>
            </div>

            {/* Assets Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Asset Name</th>
                                <th className="p-4 font-medium">IP Address</th>
                                <th className="p-4 font-medium">OS Version</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Risk Score</th>
                                <th className="p-4 font-medium">Vulnerabilities</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {endpoints.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-500">
                                        No assets found or loading...
                                    </td>
                                </tr>
                            ) : (
                                endpoints.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{asset.name}</div>
                                            <div className="text-xs text-slate-500">ID: {asset.id}</div>
                                        </td>
                                        <td className="p-4 text-slate-300 font-mono text-sm">{asset.ip_address || 'N/A'}</td>
                                        <td className="p-4 text-slate-300">{asset.os_version}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)} capitalize`}>
                                                {asset.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${asset.risk_score > 70 ? 'bg-rose-500' : asset.risk_score > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${asset.risk_score}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-slate-400">{asset.risk_score}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">{asset.vulnerabilities_count}</td>
                                        <td className="p-4 text-right">
                                            {asset.status !== 'isolated' && (
                                                <button
                                                    onClick={() => handleIsolate(asset.id)}
                                                    className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded text-sm transition-colors"
                                                >
                                                    Isolate
                                                </button>
                                            )}
                                            {asset.status === 'isolated' && (
                                                <span className="text-xs text-purple-400 italic">Isolated</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssetManager;
