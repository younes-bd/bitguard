import React from 'react';
import { BarChart3, Users, MousePointerClick, TrendingUp, ShoppingCart, DollarSign, Activity, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const MetricCard = ({ title, value, trend, icon: Icon, trendUp }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-800/50 text-blue-400 rounded-lg">
                <Icon size={24} />
            </div>
            <span className={`text-sm font-bold flex items-center gap-1 ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {trendUp ? '+' : '-'}{trend}%
                <TrendingUp size={14} className={trendUp ? '' : 'rotate-180'} />
            </span>
        </div>
        <div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const WebsiteDashboard = () => {
    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Globe className="text-blue-500" />
                        Website Overview
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Analytics and performance metrics for your primary website.</p>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/" target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                        <Globe size={16} /> Go to Website
                    </a>
                    <Link to="/admin/website/pages/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                        New Page
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Unique Visitors" value="124,592" trend="12.5" icon={Users} trendUp={true} />
                <MetricCard title="Page Views" value="482,019" trend="8.2" icon={MousePointerClick} trendUp={true} />
                <MetricCard title="Bounce Rate" value="42.3%" trend="2.1" icon={Activity} trendUp={false} />
                <MetricCard title="Avg. Time on Site" value="2m 45s" trend="5.4" icon={BarChart3} trendUp={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Traffic Overview</h3>
                        <select className="bg-slate-950 border border-slate-800 text-sm text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="flex-1 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-500 bg-slate-950/50">
                        {/* Placeholder for actual Chart component */}
                        <div className="text-center">
                            <BarChart3 size={48} className="mx-auto mb-3 text-slate-700" />
                            <p className="font-semibold text-slate-400">Plausible Analytics Integration</p>
                            <p className="text-xs mt-1">Connect your analytics provider to view traffic charts.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">eCommerce Snapshot</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                        <DollarSign size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Revenue</p>
                                        <p className="text-white font-semibold">$24,592</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-400">+15%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                                        <ShoppingCart size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Orders</p>
                                        <p className="text-white font-semibold">1,249</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-400">+8%</span>
                            </div>
                        </div>
                        <Link to="/admin/store/orders" className="block text-center text-sm font-semibold text-blue-400 hover:text-blue-300 mt-4 transition-colors">
                            View All Orders &rarr;
                        </Link>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Top Pages</h3>
                        <div className="space-y-3">
                            {['/home', '/pricing', '/about', '/contact', '/products'].map((path, i) => (
                                <div key={path} className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300 font-mono">{path}</span>
                                    <span className="text-sm font-semibold text-white">{1000 - i * 150} views</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default WebsiteDashboard;
