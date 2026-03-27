import React from 'react';
import { PieChart, Package, Truck, Activity } from 'lucide-react';

const ScmReportPage = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <PieChart className="text-orange-400" size={28} />
                Procurement Reports
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Supply chain performance and vendor metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { label: 'Total POs', value: '142', icon: Truck, color: 'text-blue-400' },
                { label: 'Spend (YTD)', value: '$84.5k', icon: PieChart, color: 'text-orange-400' },
                { label: 'Avg Fulfillment', value: '4 Days', icon: Activity, color: 'text-purple-400' },
                { label: 'Active Vendors', value: '28', icon: Package, color: 'text-emerald-400' },
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
            <p className="text-slate-500 text-sm max-w-md mx-auto">Full vendor scorecards and inventory velocity reports will be available here.</p>
        </div>
    </div>
);

export default ScmReportPage;
