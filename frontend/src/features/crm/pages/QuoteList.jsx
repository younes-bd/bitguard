import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { FileText, Plus, Search, Filter, Eye } from 'lucide-react';

const QuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const response = await client.get('crm/quotes/');
            setQuotes(response.data);
        } catch (error) {
            console.error("Error fetching quotes:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'sent': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'rejected': return 'bg-red-50 text-red-600 border-red-200';
            case 'converted': return 'bg-purple-50 text-purple-600 border-purple-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const filteredQuotes = quotes.filter(quote =>
        quote.quote_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FileText className="text-sky-400" size={32} />
                        Quotes
                    </h1>
                    <p className="text-slate-400">Manage sales quotes and proposals</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-sky-900/20">
                    <Plus size={18} />
                    <span>Create Quote</span>
                </button>
            </div>

            {/* Filters */}
            <div className="glass-panel p-4 rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search quotes..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 placeholder-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800">
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
            </div>

            {/* Content */}
            <div className="glass-panel rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-slate-700">Quote #</th>
                                <th className="p-4 border-b border-slate-700">Client</th>
                                <th className="p-4 border-b border-slate-700">Date</th>
                                <th className="p-4 border-b border-slate-700">Status</th>
                                <th className="p-4 border-b border-slate-700 text-right">Total</th>
                                <th className="p-4 border-b border-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 text-slate-300">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading quotes...</td></tr>
                            ) : filteredQuotes.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No quotes found.</td></tr>
                            ) : (
                                filteredQuotes.map((quote) => (
                                    <tr key={quote.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-mono text-sky-400">
                                            <div className="flex items-center gap-2">
                                                {quote.quote_number}
                                            </div>
                                        </td>
                                        <td className="p-4 text-white font-medium">{quote.client_name}</td>
                                        <td className="p-4 text-slate-400">{new Date(quote.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded text-xs font-bold border uppercase tracking-wide ${getStatusColor(quote.status)}`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono text-emerald-400 font-bold">
                                            ${parseFloat(quote.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => navigate(`/crm/quotes/${quote.id}`)}
                                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QuoteList;


