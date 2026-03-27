import React from 'react';
import { DollarSign, Calendar, Users, Calculator } from 'lucide-react';

const PayrollPage = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <DollarSign className="text-pink-400" size={28} />
                Payroll
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Process payroll, manage compensation, and track payments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { label: 'Employees', value: '0', icon: Users, color: 'text-blue-400' },
                { label: 'Monthly Payroll', value: '$0', icon: DollarSign, color: 'text-emerald-400' },
                { label: 'Next Run Date', value: '—', icon: Calendar, color: 'text-amber-400' },
                { label: 'YTD Total', value: '$0', icon: Calculator, color: 'text-purple-400' },
            ].map(kpi => (
                <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <kpi.icon size={20} className={`${kpi.color} mb-2`} />
                    <div className="text-2xl font-bold text-white">{kpi.value}</div>
                    <div className="text-slate-400 text-xs uppercase font-bold mt-1">{kpi.label}</div>
                </div>
            ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Calculator size={48} className="mx-auto mb-4 text-slate-700" />
            <h3 className="text-white font-semibold text-lg mb-2">Payroll Module</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Payroll processing requires employee salary data and tax configuration. Connect your payroll provider to get started.</p>
        </div>
    </div>
);

export default PayrollPage;
