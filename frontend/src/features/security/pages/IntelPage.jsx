import React, { useState, useEffect } from 'react';
import securityService from '../../../shared/core/services/securityService';
import { Search, Globe } from 'lucide-react';

const IntelPage = () => {
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIndicators = async () => {
            try {
                const response = await securityService.getIndicators();
                setIndicators(response.data.results || response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchIndicators();
    }, []);

    const getTLPColor = (tlp) => {
        switch (tlp) {
            case 'RED': return 'text-rose-500 border-rose-500/20 bg-rose-500/10';
            case 'AMBER': return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
            case 'GREEN': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
            case 'CLEAR': return 'text-slate-400 border-slate-500/20 bg-slate-500/10';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Threat Intelligence</h1>
                    <p className="text-slate-400">Manage and monitor Indicators of Compromise (IOCs).</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase p-4">
                            <th className="p-4">Indicator Value</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Source</th>
                            <th className="p-4">Confidence</th>
                            <th className="p-4">TLP</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {indicators.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">No indicators found.</td></tr>
                        ) : (
                            indicators.map((i) => (
                                <tr key={i.id} className="hover:bg-slate-700/30">
                                    <td className="p-4 font-mono text-white">{i.value}</td>
                                    <td className="p-4 text-slate-300 capitalize">{i.type}</td>
                                    <td className="p-4 text-slate-300">{i.source}</td>
                                    <td className="p-4">
                                        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500"
                                                style={{ width: `${i.confidence}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-400 mt-1 inline-block">{i.confidence}%</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded border text-xs font-bold ${getTLPColor(i.tlp)}`}>
                                            {i.tlp}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-rose-400 hover:text-rose-300 text-sm">Revoke</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IntelPage;
