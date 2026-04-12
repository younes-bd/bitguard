import React, { useEffect, useState } from 'react';
import { crmService } from '../../../../core/api/crmService';
import {
    Users, Target, DollarSign, TrendingUp, Activity, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CrmDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalClients: 0,
        activeLeads: 0,
        openDeals: 0,
        pipelineValue: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Parallel fetch for dashboard data using valid CRM endpoints
                const [clientsResult, leadsResult, dealsResult, activitiesResult] = await Promise.all([
                    crmService.getClients(),
                    crmService.getLeads(),
                    crmService.getDeals(),
                    crmService.getActivities()
                ]);

                const clients = Array.isArray(clientsResult) ? clientsResult : clientsResult.results || [];
                const leads = Array.isArray(leadsResult) ? leadsResult : leadsResult.results || [];
                const deals = Array.isArray(dealsResult) ? dealsResult : dealsResult.results || [];
                const activities = Array.isArray(activitiesResult) ? activitiesResult : activitiesResult.results || [];

                const openDealsList = deals.filter(d => ['discovery', 'proposal', 'negotiation'].includes(d.stage));
                
                setStats({
                    totalClients: clients.length,
                    activeLeads: leads.filter(l => l.status === 'new' || l.status === 'contacted').length,
                    openDeals: openDealsList.length,
                    pipelineValue: openDealsList.reduce((sum, deal) => sum + parseFloat(deal.amount || 0), 0)
                });

                setRecentActivities(activities.slice(0, 5));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-2">CRM Overview</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    onClick={() => navigate('/admin/crm/clients')}
                    className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-blue-900/20 to-slate-900/50 cursor-pointer hover:border-blue-500/50 transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <TrendingUp size={12} /> Live
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{stats.totalClients}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Total Clients</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/crm/leads')}
                    className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-purple-900/20 to-slate-900/50 cursor-pointer hover:border-purple-500/50 transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                            <Target size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-500">Active</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{stats.activeLeads}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">New Leads</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/crm/deals')}
                    className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-amber-900/20 to-slate-900/50 cursor-pointer hover:border-amber-500/50 transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400 group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{stats.openDeals}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Open Deals</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/crm/deals')}
                    className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-emerald-900/20 to-slate-900/50 cursor-pointer hover:border-emerald-500/50 transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">${stats.pipelineValue.toLocaleString()}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Pipeline Value</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-blue-400" size={20} />
                        Recent Activities
                    </h2>
                    <button
                        onClick={() => navigate('/admin/crm/activities')}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-4">
                    {recentActivities.map(activity => (
                        <div
                            key={activity.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-slate-800/40 border border-slate-700/30 hover:border-blue-500/30 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{activity.subject || activity.type}</h3>
                                    <div className="text-xs text-slate-500">{activity.description || 'Interaction logged'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-slate-700 text-slate-300">
                                    {activity.type}
                                </span>
                                <div className="text-slate-500 text-xs flex items-center gap-1">
                                    <span>{new Date(activity.created_at || new Date()).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {recentActivities.length === 0 && (
                        <div className="text-center py-8 text-slate-500">No recent activities.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrmDashboard;


