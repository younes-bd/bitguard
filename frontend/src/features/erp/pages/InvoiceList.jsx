import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../shared/core/services/erpService';
import {
    Search, Filter, Plus, FileText,
    MoreHorizontal, Download, ArrowUpRight
} from 'lucide-react';

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const data = await erpService.getInvoices();
            setInvoices(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load invoices", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'draft': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalAmount = invoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);
    const overdueAmount = invoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + parseFloat(inv.total), 0);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Invoices</h1>
                    <p className="text-slate-400">Manage billing and payments</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-sm text-slate-400">Total Receivables</div>
                        <div className="text-xl font-bold text-white">${totalAmount.toLocaleString()}</div>
                    </div>
                    <div className="text-right hidden md:block border-l border-slate-700 pl-4">
                        <div className="text-sm text-slate-400">Overdue</div>
                        <div className="text-xl font-bold text-red-400">${overdueAmount.toLocaleString()}</div>
                    </div>
                    <button
                        onClick={() => navigate('/erp/invoices/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20 h-fit"
                    >
                        <Plus size={20} />
                        <span>New Invoice</span>
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search invoices or clients..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg focus:outline-none focus:border-blue-500/50"
                >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>

            {/* Invoice List */}
            <div className="space-y-3">
                {filteredInvoices.map((inv) => (
                    <div key={inv.id} className="glass-panel p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-slate-800/50 text-slate-400">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium flex items-center gap-2">
                                    {inv.invoice_number}
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(inv.status)}`}>
                                        {inv.status}
                                    </span>
                                </h3>
                                <div className="text-sm text-slate-400">
                                    {inv.client_name} • Due {inv.due_date}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 md:justify-end flex-1">
                            <div className="text-right">
                                <div className="text-xs text-slate-500 uppercase">Amount</div>
                                <div className="text-lg font-bold text-white">${parseFloat(inv.total).toLocaleString()}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                                    <Download size={18} />
                                </button>
                                <button
                                    onClick={() => navigate(`/erp/invoices/${inv.id}`)}
                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                    <ArrowUpRight size={18} />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}

                {filteredInvoices.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <FileText size={32} />
                        </div>
                        <p className="text-slate-400">No invoices found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceList;


