import React, { useEffect, useState } from 'react';
import { erpService } from '../../../shared/core/services/erpService';
import { 
    Shield, AlertTriangle, Search, Filter, Plus
} from 'lucide-react';

const RiskList = () => {
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRisks();
    }, []);

    const loadRisks = async () => {
        try {
            const data = await erpService.getRisks();
            setRisks(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load risks", error);
        } finally {
            setLoading(false);
        }
    };

    const getImpactColor = (impact) => {
        switch (impact) {
            case 'severe': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Shield className="text-emerald-400" size={32} />
                        Risk Register
                    </h1>
                    <p className="text-slate-400">Identify and mitigate operational risks</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20">
                    <Plus size={20} />
                    <span>New Risk</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {risks.map((risk) => (
                    <div key={risk.id} className="glass-panel p-6 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white">{risk.summary}</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getImpactColor(risk.impact)}`}>
                                    {risk.impact} Impact
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm mb-4">{risk.description}</p>
                            
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Mitigation Plan</div>
                                <div className="text-sm text-slate-300">{risk.mitigation_plan || 'No plan defined.'}</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 min-w-[200px] border-l border-slate-700/50 pl-6 justify-center">
                            <div>
                                <div className="text-xs text-slate-500 uppercase">Probability</div>
                                <div className="text-white font-medium capitalize">{risk.probability}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase">Status</div>
                                <div className="text-emerald-400 font-medium capitalize">{risk.status}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase">Owner</div>
                                <div className="text-white font-medium">
                                    {/* Mock owner if not expanded, assumed ID or need serializer update */}
                                    Risk Team
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {risks.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                             <AlertTriangle size={32} />
                        </div>
                        <p className="text-slate-400">No risks identified.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskList;


