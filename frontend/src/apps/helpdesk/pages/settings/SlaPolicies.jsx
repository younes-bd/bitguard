import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import helpdeskService from '../../api/helpdeskService';

const SlaPolicies = () => {
    const [policies, setPolicies] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        team: '', 
        priority: 'medium', 
        ticket_type: '', 
        target_type: 'resolution', 
        target_hours: 24 
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [policiesData, teamsData] = await Promise.all([
                helpdeskService.getSlaPolicies(),
                helpdeskService.getTeams()
            ]);
            setPolicies(policiesData.results || policiesData);
            setTeams(teamsData.results || teamsData);
        } catch (error) {
            console.error('Failed to load SLA policies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                team: parseInt(formData.team),
                target_hours: parseFloat(formData.target_hours)
            };
            await helpdeskService.createSlaPolicy(payload);
            setIsModalOpen(false);
            setFormData({ name: '', team: '', priority: 'medium', ticket_type: '', target_type: 'resolution', target_hours: 24 });
            loadData();
        } catch (error) {
            console.error('Failed to create SLA policy:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this SLA policy?')) return;
        try {
            await helpdeskService.deleteSlaPolicy(id);
            loadData();
        } catch (error) {
            console.error('Failed to delete SLA policy:', error);
        }
    };

    const getTeamName = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : 'Unknown';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Clock className="text-orange-400" size={28} /> SLA Policies
                    </h1>
                    <p className="text-slate-400">Define Service Level Agreements for response and resolution times.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} /> New Policy
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-400" size={32} /></div>
                ) : policies.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Clock size={48} className="mx-auto mb-4 text-slate-700" />
                        <p className="text-lg">No SLA policies defined.</p>
                        <p className="text-sm mt-2">Create policies to ensure timely responses and resolutions.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-800/50 text-slate-400 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Policy Name</th>
                                <th className="px-6 py-4">Team</th>
                                <th className="px-6 py-4">Conditions</th>
                                <th className="px-6 py-4">Target</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {policies.map(policy => (
                                <tr key={policy.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{policy.name}</td>
                                    <td className="px-6 py-4">{getTeamName(policy.team)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span className="text-slate-400">Priority: <span className="text-white capitalize">{policy.priority}</span></span>
                                            {policy.ticket_type && <span className="text-slate-400">Type: <span className="text-white">{policy.ticket_type}</span></span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={14} className={policy.target_type === 'response' ? 'text-yellow-400' : 'text-orange-400'} />
                                            <span>
                                                {policy.target_hours}h for {policy.target_type === 'response' ? 'First Response' : 'Resolution'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 flex justify-end gap-3">
                                        <button onClick={() => handleDelete(policy.id)} className="text-red-400 hover:text-red-300 p-1">
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
                        <h2 className="text-xl font-bold text-white mb-4">Create SLA Policy</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Policy Name</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Target Team</label>
                                <select 
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                    value={formData.team}
                                    onChange={e => setFormData({...formData, team: e.target.value})}
                                >
                                    <option value="" disabled>Select Team</option>
                                    {teams.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Priority Condition</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.priority}
                                        onChange={e => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Ticket Type (Optional)</label>
                                    <input 
                                        type="text" placeholder="e.g. question, incident"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.ticket_type}
                                        onChange={e => setFormData({...formData, ticket_type: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 mt-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Target Type</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.target_type}
                                        onChange={e => setFormData({...formData, target_type: e.target.value})}
                                    >
                                        <option value="response">First Response</option>
                                        <option value="resolution">Resolution</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Target Hours</label>
                                    <input 
                                        type="number" step="0.5" required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.target_hours}
                                        onChange={e => setFormData({...formData, target_hours: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors">Save Policy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlaPolicies;
