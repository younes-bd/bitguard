import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { signService } from '../../../../sign/api/signService';
import toast from 'react-hot-toast';

const PortalQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const response = await signService.getQuotes();
                const items = response?.data || response?.results || response || [];
                setQuotes(Array.isArray(items) ? items : []);
            } catch (error) {
                toast.error('Failed to load quotations');
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">Quotations</h1>
                    <p className="dark:text-slate-400 text-slate-500">Manage and review your quotations.</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="p-4 font-semibold">Quote ID</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Valid Until</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading quotations...
                                </td>
                            </tr>
                        ) : quotes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <FileText size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    No quotations found.
                                </td>
                            </tr>
                        ) : (
                            quotes.map(quote => (
                                <tr key={quote.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{quote.name || quote.reference || quote.id}</td>
                                    <td className="p-4 text-slate-500 text-sm">{quote.date || quote.created_at?.split('T')[0] || 'N/A'}</td>
                                    <td className="p-4 text-slate-500 text-sm">{quote.valid_until || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            quote.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 
                                            quote.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            quote.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {quote.status || 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm font-mono">${parseFloat(quote.total_amount || quote.total || 0).toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortalQuotes;

