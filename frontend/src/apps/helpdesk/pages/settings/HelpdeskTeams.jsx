import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import helpdeskService from '../../../../core/api/helpdeskService';

const HelpdeskTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', alias_email: '', use_sla: true });

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        setLoading(true);
        try {
            const data = await helpdeskService.getTeams();
            setTeams(data.results || data);
        } catch (error) {
            console.error('Failed to load teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await helpdeskService.createTeam(formData);
            setIsModalOpen(false);
            setFormData({ name: '', alias_email: '', use_sla: true });
            loadTeams();
        } catch (error) {
            console.error('Failed to create team:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this team?')) return;
        try {
            await helpdeskService.deleteTeam(id);
            loadTeams();
        } catch (error) {
            console.error('Failed to delete team:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Users className="text-indigo-400" size={28} /> Helpdesk Teams
                    </h1>
                    <p className="text-slate-400">Manage support teams and assignments.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} /> New Team
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>
                ) : teams.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Users size={48} className="mx-auto mb-4 text-slate-700" />
                        <p className="text-lg">No teams configured yet.</p>
                        <p className="text-sm mt-2">Create teams to organize tickets and manage SLAs efficiently.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-800/50 text-slate-400 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Alias Email</th>
                                <th className="px-6 py-4">Use SLA</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {teams.map(team => (
                                <tr key={team.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{team.name}</td>
                                    <td className="px-6 py-4">{team.alias_email || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${team.use_sla ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                            {team.use_sla ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex justify-end gap-3">
                                        <button onClick={() => handleDelete(team.id)} className="text-red-400 hover:text-red-300 p-1">
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
                        <h2 className="text-xl font-bold text-white mb-4">Create Helpdesk Team</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Team Name</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Alias Email</label>
                                <input 
                                    type="email" 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                    value={formData.alias_email}
                                    onChange={e => setFormData({...formData, alias_email: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={formData.use_sla}
                                    onChange={e => setFormData({...formData, use_sla: e.target.checked})}
                                    className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500"
                                />
                                <label className="text-sm text-slate-300">Enable SLA Policies for this team</label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">Save Team</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpdeskTeams;
