import React, { useState } from 'react';
import { Download, FileText, Calendar, Database, Check } from 'lucide-react';

const EXPORT_TYPES = [
    { key: 'revenue', label: 'Revenue Report', description: 'Monthly recurring revenue, churn, and growth metrics', format: 'CSV' },
    { key: 'crm', label: 'CRM Data', description: 'Clients, contacts, leads, and deal pipeline', format: 'CSV' },
    { key: 'support', label: 'Support Tickets', description: 'Ticket history, SLA compliance, and resolution times', format: 'CSV' },
    { key: 'security', label: 'Security Audit', description: 'Security events, alerts, and incident logs', format: 'PDF' },
    { key: 'hrm', label: 'Employee Records', description: 'Employee directory, certifications, and time entries', format: 'CSV' },
    { key: 'invoices', label: 'Invoices & Billing', description: 'Invoice history, payments, and outstanding balances', format: 'CSV' },
];

const ExportPage = () => {
    const [selected, setSelected] = useState([]);
    const toggle = (key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Download className="text-violet-400" size={28} />
                        Data Export
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Export platform data in CSV or PDF format</p>
                </div>
                <button disabled={selected.length === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                        selected.length > 0 ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}>
                    <Download size={14} /> Export Selected ({selected.length})
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EXPORT_TYPES.map(exp => (
                    <div key={exp.key}
                        onClick={() => toggle(exp.key)}
                        className={`bg-slate-900 border rounded-xl p-5 cursor-pointer transition-all ${
                            selected.includes(exp.key) ? 'border-violet-500/50 ring-1 ring-violet-500/20 bg-violet-500/5' : 'border-slate-800 hover:border-slate-700'
                        }`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected.includes(exp.key) ? 'bg-violet-500/20' : 'bg-slate-800'}`}>
                                    <FileText size={18} className={selected.includes(exp.key) ? 'text-violet-400' : 'text-slate-400'} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{exp.label}</h3>
                                    <p className="text-slate-500 text-sm mt-0.5">{exp.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-mono uppercase">{exp.format}</span>
                                {selected.includes(exp.key) && <Check size={16} className="text-violet-400" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExportPage;
