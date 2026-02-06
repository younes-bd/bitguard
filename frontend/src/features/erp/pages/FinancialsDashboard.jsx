import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, FileText, CreditCard } from 'lucide-react';

const FinancialsDashboard = () => {
    // Mock Data for MVP
    const stats = [
        { label: 'Total Revenue', value: '$124,500', change: '+12%', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Total Expenses', value: '$45,200', change: '+5%', icon: CreditCard, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { label: 'Net Profit', value: '$79,300', change: '+18%', icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Pending Invoices', value: '12', change: '$14k', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    ];

    const transactions = [
        { id: 1, desc: 'Office Supplies', date: '2025-01-08', amount: -250.00, type: 'expense' },
        { id: 2, desc: 'Client Payment - TechCorp', date: '2025-01-08', amount: 4500.00, type: 'income' },
        { id: 3, desc: 'Server Hosting', date: '2025-01-07', amount: -120.00, type: 'expense' },
        { id: 4, desc: 'Consulting Fee - StartupInc', date: '2025-01-06', amount: 2100.00, type: 'income' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Financial Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area (Placeholder) */}
                <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white">Cash Flow</h2>
                        <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300 focus:outline-none">
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end gap-2 justify-between px-4 pb-4 border-b border-slate-700/50">
                        {/* CSS Bar Chart Simulation */}
                        {[40, 60, 45, 70, 55, 80, 65, 90, 75, 50, 85, 95].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t transition-all relative group" style={{ height: `${h}%` }}>
                                <div className="absolute inset-x-0 bottom-0 bg-indigo-500 opacity-60 h-[30%] rounded-t"></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${h}k
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2 px-2">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Recent Transactions</h2>
                    <div className="space-y-4">
                        {transactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {tx.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{tx.desc}</div>
                                        <div className="text-xs text-slate-500">{tx.date}</div>
                                    </div>
                                </div>
                                <div className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                    {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-colors">
                        View All transactions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinancialsDashboard;


