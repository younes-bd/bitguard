import React, { useEffect, useState } from 'react';
import { erpService } from '../../../core/api/erpService';
import { 
    Shield, AlertTriangle, Search, Filter, Plus, Edit2, Trash2, X, CheckCircle2
} from 'lucide-react';

const RiskList = () => {
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        summary: '',
        description: '',
        impact: 'medium',
        probability: 'possible',
        status: 'identified',
        mitigation_plan: ''
    });

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

    const handleSave = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (selectedRisk) {
                await erpService.updateRisk(selectedRisk.id, formData);
            } else {
                await erpService.createRisk(formData);
            }
            setShowModal(false);
            loadRisks();
        } catch (error) {
            alert("Failed to save risk");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this risk?")) return;
        try {
            await erpService.deleteRisk(id);
            loadRisks();
        } catch (error) {
            alert("Delete failed");
        }
    };

    const openModal = (risk = null) => {
        if (risk) {
            setSelectedRisk(risk);
            setFormData({
                summary: risk.summary,
                description: risk.description,
                impact: risk.impact,
                probability: risk.probability,
                status: risk.status,
                mitigation_plan: risk.mitigation_plan || ''
            });
        } else {
            setSelectedRisk(null);
            setFormData({
                summary: '',
                description: '',
                impact: 'medium',
                probability: 'possible',
                status: 'identified',
                mitigation_plan: ''
            });
        }
        setShowModal(true);
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Shield className="text-emerald-400" size={32} />
                        Risk Register
                    </h1>
                    <p className="text-slate-400">Identify and mitigate operational risks</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>New Risk</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {risks.map((risk) => (
                    <div key={risk.id} className="glass-panel p-6 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row gap-6 relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(risk)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700">
                                <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(risk.id)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-slate-700">
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white">{risk.summary}</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getImpactColor(risk.impact)}`}>
                                    {risk.impact} Impact
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{risk.description}</p>
                            
                            {risk.mitigation_plan && (
                                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-2">
                                        <CheckCircle2 size={12} className="text-emerald-400" />
                                        Mitigation Plan
                                    </div>
                                    <div className="text-sm text-slate-300 italic">"{risk.mitigation_plan}"</div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 min-w-[200px] border-l border-slate-700/50 pl-6 justify-center bg-slate-800/20 -my-6 py-6 rounded-r-xl">
                            <div className="space-y-1">
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Probability</div>
                                <div className="text-white font-medium capitalize text-sm">{risk.probability}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Status</div>
                                <div className="text-emerald-400 font-bold capitalize text-sm">{risk.status}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Last Update</div>
                                <div className="text-slate-400 text-xs">
                                    {new Date(risk.updated_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {risks.length === 0 && (
                    <div className="glass-panel p-16 text-center border border-dashed border-slate-700 rounded-xl">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600 border border-slate-700">
                             <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-white font-bold mb-1">No Risks Logged</h3>
                        <p className="text-slate-400 text-sm">Your risk register is currently clean.</p>
                    </div>
                )}
            </div>

            {/* CRUD Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Shield className="text-emerald-400" size={20} />
                                {selectedRisk ? 'Edit Risk' : 'Log New Risk'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Summary</label>
                                <input
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    placeholder="e.g. Server Hardware Failure"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Impact</label>
                                    <select
                                        value={formData.impact}
                                        onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="severe">Severe</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Probability</label>
                                    <select
                                        value={formData.probability}
                                        onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                                    >
                                        <option value="unlikely">Unlikely</option>
                                        <option value="possible">Possible</option>
                                        <option value="likely">Likely</option>
                                        <option value="certain">Certain</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mitigation Plan</label>
                                <textarea
                                    value={formData.mitigation_plan}
                                    onChange={(e) => setFormData({ ...formData, mitigation_plan: e.target.value })}
                                    rows={2}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 active:scale-95"
                                >
                                    {actionLoading ? 'Saving...' : (selectedRisk ? 'Update Risk' : 'Log Risk')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskList;



