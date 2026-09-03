import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { boardService } from '@/apps/board/api/boardService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueReport = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ from_date: '', to_date: '' });

    const fetchReport = () => {
        setLoading(true);
        const params = {};
        if (dateRange.from_date) params.from_date = dateRange.from_date;
        if (dateRange.to_date) params.to_date = dateRange.to_date;
        
        boardService.getRevenueReport(params)
            .then(res => { setData(res || {}); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleFilter = () => {
        fetchReport();
    };

    const monthly = data?.monthly ?? [];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl text-sm">
                    <p className="font-semibold text-white mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
                            <span>{entry.name}:</span>
                            <span className="font-mono">${Number(entry.value).toLocaleString()}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-400">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <TrendingUp size={22} className="text-emerald-400" /> Revenue Report
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Time series revenue analysis</p>
                </div>
                
                {/* Date Filter */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
                    <div className="flex items-center px-2">
                        <Calendar size={16} className="text-slate-400 mr-2" />
                        <input 
                            type="date" 
                            className="bg-transparent text-sm text-white border-none outline-none"
                            value={dateRange.from_date}
                            onChange={e => setDateRange({...dateRange, from_date: e.target.value})}
                        />
                    </div>
                    <span className="text-slate-600">-</span>
                    <div className="flex items-center px-2">
                        <input 
                            type="date" 
                            className="bg-transparent text-sm text-white border-none outline-none"
                            value={dateRange.to_date}
                            onChange={e => setDateRange({...dateRange, to_date: e.target.value})}
                        />
                    </div>
                    <button 
                        onClick={handleFilter}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-16 text-slate-500 flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    Loading report data...
                </div>
            ) : (
                <>
                    {/* Chart */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `$${val/1000}k`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="store_revenue" name="Store Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="invoice_collected" name="Invoices Collected" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Table */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/50">
                                    {['Period', 'Store Revenue', 'Invoices Collected', 'Total Revenue'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...monthly].reverse().map((m, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                        <td className="px-5 py-4 text-slate-300 font-medium">{m.month}</td>
                                        <td className="px-5 py-4 text-emerald-400 font-mono">${Number(m.store_revenue || 0).toLocaleString()}</td>
                                        <td className="px-5 py-4 text-blue-400 font-mono">${Number(m.invoice_collected || 0).toLocaleString()}</td>
                                        <td className="px-5 py-4 text-white font-bold font-mono">${Number(m.total || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {monthly.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-5 py-8 text-center text-slate-500">No revenue data found for this period.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default RevenueReport;

