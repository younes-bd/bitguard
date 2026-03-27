import React from 'react';
import { PieChart, TrendingDown, DollarSign, Briefcase } from 'lucide-react';

const ErpReportPage = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <PieChart className="text-emerald-400" size={28} />
                Financial Reports
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Finance and operations analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { label: 'Total Revenue', value: '$245k', icon: DollarSign, color: 'text-emerald-400' },
                { label: 'Total Expenses', value: '$84k', icon: TrendingDown, color: 'text-red-400' },
                { label: 'Net Margin', value: '42%', icon: PieChart, color: 'text-purple-400' },
                { label: 'Project Health', value: '94%', icon: Briefcase, color: 'text-blue-400' },
            ].map(kpi => (
                <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <kpi.icon size={20} className={`${kpi.color} mb-2`} />
                    <div className="text-2xl font-bold text-white">{kpi.value}</div>
                    <div className="text-slate-400 text-xs uppercase font-bold mt-1">{kpi.label}</div>
                </div>
            ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <PieChart size={48} className="mx-auto mb-4 text-slate-700" />
            <h3 className="text-white font-semibold text-lg mb-2">Detailed Reports Coming Soon</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Full P&L statements, cashflow forecasting, and granular project cost reports will be available here.</p>
        </div>
    </div>
);

export default ErpReportPage;
