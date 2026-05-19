import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Megaphone, Target, BarChart, Users, TrendingUp, MousePointer2, Share2, Eye } from 'lucide-react';
import { marketingService } from '../../../core/api/marketingService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar, Cell } from 'recharts';

const MarketingDashboard = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [campRes, statsRes] = await Promise.all([
                marketingService.getCampaigns(),
                marketingService.getGlobalStats()
            ]);
            setCampaigns(Array.isArray(campRes) ? campRes : campRes.results || []);
            setStats(statsRes);
        } catch (error) {
            console.error('Failed to fetch marketing data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Marketing Automation</h1>
                    <p className="text-slate-400 text-sm mt-1">Global campaign performance and conversion metrics</p>
                </div>
                <button
                    onClick={() => navigate('/admin/marketing/campaigns')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    <span>Manage Campaigns</span>
                </button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Megaphone size={20} /></div>
                        <span className="text-[10px] font-bold text-emerald-400">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.total_campaigns || 0}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Total Campaigns</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Target size={20} /></div>
                        <span className="text-[10px] font-bold text-blue-400">Active</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.active_campaigns || 0}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Active Now</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><MousePointer2 size={20} /></div>
                        <span className="text-[10px] font-bold text-emerald-400">High</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.total_interactions || 0}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Total Clicks</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><TrendingUp size={20} /></div>
                        <span className="text-[10px] font-bold text-purple-400">{stats?.engagement_rate}%</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.engagement_rate || 0}%</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Engagement Rate</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-700/50 min-h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart size={20} className="text-yellow-500" />
                        Engagement Trends
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.trend_data || []}>
                                <defs>
                                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#eab308' }}
                                />
                                <Area type="monotone" dataKey="conversions" stroke="#eab308" fillOpacity={1} fill="url(#colorConversions)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Share2 size={20} className="text-blue-500" />
                        Platform Reach
                    </h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Email Marketing', val: 75, color: 'bg-blue-500' },
                            { name: 'Social Ads', val: 42, color: 'bg-emerald-500' },
                            { name: 'Direct Sales', val: 28, color: 'bg-yellow-500' },
                            { name: 'Webinars', val: 15, color: 'bg-purple-500' }
                        ].map(item => (
                            <div key={item.name}>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400 font-medium">{item.name}</span>
                                    <span className="text-white font-bold">{item.val}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                        <p className="text-xs text-slate-400 mb-2">Target Conversion Goal</p>
                        <div className="text-2xl font-bold text-white">8,500 <span className="text-xs text-slate-500">Leads</span></div>
                    </div>
                </div>
            </div>

            {/* Recent Campaigns Table */}
            <div className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Eye size={20} className="text-emerald-500" />
                        Campaign Overview
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">LATEST UPDATES</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Campaign</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Budget</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Performance</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Start Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {campaigns.length > 0 ? (
                                campaigns.map(campaign => (
                                    <tr key={campaign.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white group-hover:text-yellow-500 transition-colors">{campaign.name}</div>
                                            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{campaign.description || 'No description provided'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border
                                                ${campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                  campaign.status === 'draft' ? 'bg-slate-700 text-slate-400 border-slate-600' :
                                                  'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {campaign.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-semibold">
                                            ${parseFloat(campaign.budget || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-white font-mono">{campaign.interactions_count || 0}</div>
                                                <div className="flex-1 h-1.5 bg-slate-800 rounded-full w-20">
                                                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${Math.min((campaign.interactions_count || 0)/10, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                                            {campaign.start_date || 'TBD'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                                        No active campaigns. Start your first automation journey above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketingDashboard;
