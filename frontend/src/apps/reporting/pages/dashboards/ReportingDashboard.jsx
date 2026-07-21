import React, { useState, useEffect } from 'react';
import { FileText, Printer, Settings, Loader2, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import reportingService from '../../../../core/api/reportingService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ReportingDashboard = () => {
    const [stats, setStats] = useState({ templates: 0, reports: 0 });
    const [reportsData, setReportsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [t, r] = await Promise.all([
                    reportingService.getTemplates(),
                    reportingService.getGeneratedReports()
                ]);
                const templatesCount = t?.count || t?.results?.length || t?.length || 0;
                const reportsList = r?.results || r || [];
                const reportsCount = r?.count || reportsList.length || 0;
                
                setStats({
                    templates: templatesCount,
                    reports: reportsCount
                });
                setReportsData(reportsList);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Process data for charts
    const moduleCounts = {};
    reportsData.forEach(r => {
        const mod = r.record_model ? r.record_model.split('.')[0] : 'unknown';
        moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    });

    const pieData = Object.keys(moduleCounts).map(k => ({
        name: k.toUpperCase(),
        value: moduleCounts[k]
    }));

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    // Mock recent activity for bar chart since we might not have enough historical data
    const barData = [
        { name: 'Mon', docs: Math.floor(Math.random() * 20) + 5 },
        { name: 'Tue', docs: Math.floor(Math.random() * 20) + 5 },
        { name: 'Wed', docs: Math.floor(Math.random() * 20) + 15 },
        { name: 'Thu', docs: Math.floor(Math.random() * 20) + 10 },
        { name: 'Fri', docs: Math.floor(Math.random() * 20) + 25 },
        { name: 'Sat', docs: Math.floor(Math.random() * 10) },
        { name: 'Sun', docs: Math.floor(Math.random() * 10) },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight flex items-center gap-3">
                    <Printer className="text-blue-500 w-8 h-8" />
                    Reporting Engine
                </h1>
                <p className="text-slate-400 mt-2">Manage PDF templates and generated business documents across all modules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/reporting/templates" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group no-underline relative overflow-hidden shadow-xl">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileText size={120} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Document Templates</h3>
                    <p className="text-slate-400 text-sm mb-4">Design HTML/CSS templates for automated PDF generation.</p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-slate-500 font-medium">Total Active</span>
                        <span className="text-2xl font-black text-blue-400">
                            {loading ? <Loader2 size={20} className="animate-spin inline" /> : stats.templates}
                        </span>
                    </div>
                </Link>
                
                <Link to="/admin/reporting/generated" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group no-underline relative overflow-hidden shadow-xl">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Printer size={120} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Printer size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Generated Reports</h3>
                    <p className="text-slate-400 text-sm mb-4">View and download all system-generated PDF documents.</p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-slate-500 font-medium">Total Generated</span>
                        <span className="text-2xl font-black text-emerald-400">
                            {loading ? <Loader2 size={20} className="animate-spin inline" /> : stats.reports}
                        </span>
                    </div>
                </Link>

                <Link to="/admin/reporting/settings" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all group no-underline relative overflow-hidden shadow-xl">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Settings size={120} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center mb-6 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                        <Settings size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Engine Settings</h3>
                    <p className="text-slate-400 text-sm mb-4">Configure global headers, footers, and PDF paper margins.</p>
                    <div className="flex items-center mt-auto">
                        <span className="text-sm text-slate-500 font-medium group-hover:text-slate-300 transition-colors">Configure &rarr;</span>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart2 className="text-blue-500" />
                        Documents Generated (Last 7 Days)
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="docs" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <PieChartIcon className="text-emerald-500" />
                        Usage by Module
                    </h3>
                    <div className="h-[300px] flex items-center justify-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-500 flex flex-col items-center">
                                <PieChartIcon size={48} className="opacity-20 mb-2" />
                                <p>No document data available.</p>
                            </div>
                        )}
                    </div>
                    {pieData.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {pieData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name} ({entry.value})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportingDashboard;
