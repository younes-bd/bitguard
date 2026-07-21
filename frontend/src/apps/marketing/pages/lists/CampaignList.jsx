import React, { useState, useEffect } from 'react';
import { Megaphone, Search, Plus, Calendar, Users, TrendingUp, Pause, Play, Loader2, Edit2, Trash2, Target, BarChart2 } from 'lucide-react';
import { marketingService } from '../../../../core/api/marketingService';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const STATUS_BADGE = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    draft: 'bg-slate-700 text-slate-400 border-slate-600',
    paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const CampaignList = () => {
    const [search, setSearch] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const data = await marketingService.getCampaigns();
            setCampaigns(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error("Failed to fetch campaigns", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedCampaign) {
                await marketingService.updateCampaign(selectedCampaign.id, formData);
            } else {
                await marketingService.createCampaign(formData);
            }
            setIsModalOpen(false);
            fetchCampaigns();
            toast.success(selectedCampaign ? 'Campaign updated' : 'Campaign created');
        } catch (error) {
            toast.error('Failed to save campaign');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCampaign) return;
        setActionLoading(true);
        try {
            await marketingService.deleteCampaign(selectedCampaign.id);
            setIsDeleteModalOpen(false);
            fetchCampaigns();
            toast.success('Campaign deleted');
        } catch (error) {
            toast.error('Failed to delete campaign');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const CAMPAIGN_FIELDS = [
        { name: 'name', label: 'Campaign Name', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: [
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' }
        ], default: 'draft' },
        { name: 'start_date', label: 'Start Date', type: 'date' },
        { name: 'end_date', label: 'End Date', type: 'date' },
        { name: 'budget', label: 'Budget ($)', type: 'number', step: '0.01' },
        { name: 'target_audience', label: 'Target Audience', type: 'textarea' },
        { name: 'platforms', label: 'Platforms (e.g., LinkedIn, Google, Meta)', type: 'text' }
    ];

    const filtered = campaigns.filter(c => (c.name || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Megaphone className="text-yellow-500" size={28} />
                        Campaign Registry
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Strategic marketing initiatives and budget allocation</p>
                </div>
                <button onClick={() => { setSelectedCampaign(null); setIsModalOpen(true); }} className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-yellow-600/20 active:scale-95">
                    <Plus size={18} /> New Campaign
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Live Now', value: campaigns.filter(c => c.status === 'active').length, icon: Play, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Interactions', value: campaigns.reduce((s, c) => s + (c.interactions_count || 0), 0).toLocaleString(), icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Total Budget', value: '$' + campaigns.reduce((s, c) => s + parseFloat(c.budget || 0), 0).toLocaleString(), icon: BarChart2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Drafts', value: campaigns.filter(c => c.status === 'draft').length, icon: Edit2, color: 'text-slate-400', bg: 'bg-slate-800' },
                ].map(kpi => (
                    <div key={kpi.label} className="glass-panel border border-slate-700/50 rounded-2xl p-5 hover:border-yellow-500/30 transition-all group">
                        <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color} w-fit mb-3 group-hover:scale-110 transition-transform`}>
                            <kpi.icon size={20} />
                        </div>
                        <div className="text-2xl font-bold text-white">{loading ? '...' : kpi.value}</div>
                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">{kpi.label}</div>
                    </div>
                ))}
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search campaigns by name..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 backdrop-blur-sm transition-all" />
            </div>

            <div className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-700/50">
                                {['Campaign Name', 'Status', 'Budget', 'Engagement', 'Timeline', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-yellow-500" />
                                        Fetching active campaigns...
                                    </td>
                                </tr>
                            ) : filtered.length > 0 ? filtered.map(c => (
                                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="text-white font-bold group-hover:text-yellow-500 transition-colors">{c.name}</div>
                                        <div className="text-[10px] text-slate-500 italic mt-0.5 truncate max-w-[250px]">{c.description || 'No description provided'}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_BADGE[c.status] || STATUS_BADGE.draft}`}>
                                            {c.status || 'draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 font-mono text-white font-medium">
                                        ${parseFloat(c.budget || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="text-emerald-400 font-bold">{c.interactions_count || 0}</div>
                                            <TrendingUp size={12} className="text-emerald-500/50" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                                            <Calendar size={12} className="text-slate-500" />
                                            <span>{c.start_date || 'TBD'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { setSelectedCampaign(c); setIsModalOpen(true); }}
                                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedCampaign(c); setIsDeleteModalOpen(true); }}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                                        No campaigns found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCampaign ? 'Edit Campaign' : 'Initialize New Campaign'}
                fields={CAMPAIGN_FIELDS}
                initialData={selectedCampaign}
                onSubmit={handleSave}
                loading={actionLoading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Archive Campaign"
                message={`Are you sure you want to archive ${selectedCampaign?.name}? This data will be moved to history.`}
                loading={actionLoading}
            />
        </div>
    );
};

export default CampaignList;

