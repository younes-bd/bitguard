import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { crmService } from '../../../../crm/api/crmService';
import toast from 'react-hot-toast';

const PortalLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await crmService.getLeads();
                const items = response.data?.data || response.data?.results || response.data || [];
                setLeads(Array.isArray(items) ? items : []);
            } catch (error) {
                toast.error('Failed to load opportunities');
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                    <Target className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">Opportunities</h1>
                    <p className="dark:text-slate-400 text-slate-500">Track your open leads and opportunities.</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="p-4 font-semibold">Lead Name</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Expected Revenue</th>
                            <th className="p-4 font-semibold">Probability</th>
                            <th className="p-4 font-semibold">Salesperson</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading opportunities...
                                </td>
                            </tr>
                        ) : leads.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <Target size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    No opportunities found.
                                </td>
                            </tr>
                        ) : (
                            leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{lead.name || lead.contact_name}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            lead.status === 'won' ? 'bg-emerald-100 text-emerald-700' : 
                                            lead.status === 'lost' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {lead.status || 'New'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm font-mono">${parseFloat(lead.expected_revenue || 0).toFixed(2)}</td>
                                    <td className="p-4 text-slate-500 text-sm">{lead.probability || 0}%</td>
                                    <td className="p-4 text-slate-500 text-sm">{lead.salesperson_name || lead.salesperson?.name || 'N/A'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortalLeads;

