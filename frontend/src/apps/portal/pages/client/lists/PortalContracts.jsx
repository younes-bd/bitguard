import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { signService } from '../../../../sign/api/signService';
import toast from 'react-hot-toast';

export default function PortalContracts() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await signService.getContracts();
                const items = response?.data || response?.results || response || [];
                setContracts(Array.isArray(items) ? items : []);
            } catch (error) {
                toast.error('Failed to load contracts');
            } finally {
                setLoading(false);
            }
        };
        fetchContracts();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">Service Contracts</h1>
                    <p className="dark:text-slate-400 text-slate-500">Review your active agreements and SLAs.</p>
                </div>
            </div>

            <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="p-4 font-semibold">Contract Reference</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Start Date</th>
                            <th className="p-4 font-semibold">End Date</th>
                            <th className="p-4 font-semibold">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading contracts...
                                </td>
                            </tr>
                        ) : contracts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <ShieldCheck size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    No active contracts found.
                                </td>
                            </tr>
                        ) : (
                            contracts.map(contract => (
                                <tr key={contract.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{contract.name || contract.reference || contract.id}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            contract.status === 'active' || contract.status === 'running' ? 'bg-emerald-100 text-emerald-700' : 
                                            contract.status === 'expired' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {contract.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">{contract.start_date || 'N/A'}</td>
                                    <td className="p-4 text-slate-500 text-sm">{contract.end_date || 'N/A'}</td>
                                    <td className="p-4 text-slate-500 text-sm font-mono">${parseFloat(contract.total_value || contract.value || 0).toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

