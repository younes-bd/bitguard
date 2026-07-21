import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import helpdeskService from '../../../../core/api/helpdeskService';

const HelpdeskStages = () => {
    const [stages, setStages] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', sequence: 10, team: '', is_closed: false, fold: false });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [stagesData, teamsData] = await Promise.all([
                helpdeskService.getStages(),
                helpdeskService.getTeams()
            ]);
            setStages(stagesData.results || stagesData);
            setTeams(teamsData.results || teamsData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                team: formData.team ? parseInt(formData.team) : null
            };
            await helpdeskService.createStage(payload);
            setIsModalOpen(false);
            setFormData({ name: '', sequence: 10, team: '', is_closed: false, fold: false });
            loadData();
        } catch (error) {
            console.error('Failed to create stage:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this stage?')) return;
        try {
            await helpdeskService.deleteStage(id);
            loadData();
        } catch (error) {
            console.error('Failed to delete stage:', error);
        }
    };

    const getTeamName = (teamId) => {
        if (!teamId) return 'All Teams';
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : 'Unknown';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Layers className="text-teal-400" size={28} /> Helpdesk Stages
                    </h1>
                    <p className="text-slate-400">Configure Kanban stages for ticket workflow.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} /> Add Stage
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-teal-400" size={32} /></div>
                ) : stages.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Layers size={48} className="mx-auto mb-4 text-slate-700" />
                        <p className="text-lg">No custom stages found.</p>
                        <p className="text-sm mt-2">Using default stages (New, In Progress, Solved).</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-800/50 text-slate-400 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Sequence</th>
                                <th className="px-6 py-4">Team</th>
                                <th className="px-6 py-4">Settings</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {stages.sort((a,b) => a.sequence - b.sequence).map(stage => (
                                <tr key={stage.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{stage.name}</td>
                                    <td className="px-6 py-4">{stage.sequence}</td>
                                    <td className="px-6 py-4">{getTeamName(stage.team)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {stage.is_closed && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Closing Stage</span>}
                                            {stage.fold && <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">Folded</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 flex justify-end gap-3">
                                        <button onClick={() => handleDelete(stage.id)} className="text-red-400 hover:text-red-300 p-1">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Create Stage</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Stage Name</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Sequence</label>
                                    <input 
                                        type="number" required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.sequence}
                                        onChange={e => setFormData({...formData, sequence: parseInt(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Team</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.team}
                                        onChange={e => setFormData({...formData, team: e.target.value})}
                                    >
                                        <option value="">All Teams</option>
                                        {teams.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.is_closed}
                                        onChange={e => setFormData({...formData, is_closed: e.target.checked})}
                                        className="rounded bg-slate-800 border-slate-700 text-teal-500 focus:ring-teal-500"
                                    />
                                    Is Closing Stage (Tickets enter resolved status)
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.fold}
                                        onChange={e => setFormData({...formData, fold: e.target.checked})}
                                        className="rounded bg-slate-800 border-slate-700 text-teal-500 focus:ring-teal-500"
                                    />
                                    Fold in Kanban by default
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors">Save Stage</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpdeskStages;
