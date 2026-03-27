import React, { useState, useEffect } from 'react';
import { marketingService } from '../api/marketingService';

const MarketingDashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await marketingService.getCampaigns();
            setCampaigns(res.data?.results || []);
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-slate-300">Loading Marketing Campaigns...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Marketing Campaigns</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Total Campaigns</h3>
                    <div className="text-3xl font-bold text-white">{campaigns.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Active Campaigns</h3>
                    <div className="text-3xl font-bold text-blue-500">
                        {campaigns.filter(c => c.status === 'active').length}
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Total Interactions</h3>
                    <div className="text-3xl font-bold text-emerald-400">
                        {campaigns.reduce((sum, c) => sum + (c.interactions_count || 0), 0)}
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800 text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Campaign Name</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Budget</th>
                            <th className="px-6 py-4 font-medium">Interactions</th>
                            <th className="px-6 py-4 font-medium">Start Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {campaigns.length > 0 ? (
                            campaigns.map(campaign => (
                                <tr key={campaign.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-white">{campaign.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                campaign.status === 'draft' ? 'bg-slate-500/10 text-slate-400' :
                                                    'bg-blue-500/10 text-blue-400'}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">${campaign.budget || '0.00'}</td>
                                    <td className="px-6 py-4 font-mono">{campaign.interactions_count || 0}</td>
                                    <td className="px-6 py-4">{campaign.start_date || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                    No marketing campaigns found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarketingDashboard;
