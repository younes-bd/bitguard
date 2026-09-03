import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountingService } from '../../api/accountingService';
import {
    Search, Filter, Plus, FileText,
    MoreVertical, Download, ArrowUpRight,
    CheckSquare, Square, XCircle, Send, CheckCircle, ChevronUp, ChevronDown, RefreshCw, Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    
    // Sort & Pagination
    const [sortField, setSortField] = useState('issue_date');
    const [sortDesc, setSortDesc] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    
    // Selection
    const [selectedIds, setSelectedIds] = useState([]);

    const [processing, setProcessing] = useState(null); // id of row being processed

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const data = await accountingService.getInvoices();
            setInvoices(Array.isArray(data) ? data : data.results || []);
            setSelectedIds([]);
        } catch (error) {
            console.error("Failed to load invoices", error);
            toast.error("Failed to load invoices");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            await accountingService.downloadInvoice(id);
            toast.success("Download started");
        } catch (error) {
            toast.error("Download failed. PDF endpoint might not be ready.");
        }
    };

    const handleStatusChange = async (id, newStatus, method) => {
        setProcessing(id);
        try {
            await method(id);
            toast.success(`Invoice updated successfully`);
            await loadInvoices();
        } catch (error) {
            toast.error("Action failed.");
        } finally {
            setProcessing(null);
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedIds.length === 0) return;
        setLoading(true);
        let successCount = 0;
        for (const id of selectedIds) {
            try {
                if (action === 'paid') await accountingService.markInvoicePaid(id);
                if (action === 'sent') await accountingService.sendInvoiceToClient(id);
                if (action === 'void') await accountingService.voidInvoice(id);
                successCount++;
            } catch (e) {
                console.error(`Failed to apply ${action} to ${id}`, e);
            }
        }
        if (successCount > 0) {
            toast.success(`Successfully updated ${successCount} invoices.`);
            setSelectedIds([]);
            await loadInvoices();
        } else {
            toast.error("Bulk action failed for all selected items.");
            setLoading(false); // only reset loading if all failed, else loadInvoices resets it
        }
    };

    const exportCsv = () => {
        const headers = ["Invoice Number", "Client", "Type", "Issue Date", "Due Date", "Amount", "Status"];
        const rows = processedData.map(inv => [
            inv.invoice_number, 
            inv.client_name || inv.client?.name || '', 
            inv.type, 
            inv.issue_date, 
            inv.due_date, 
            inv.total_amount, 
            inv.status
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `invoices_export_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'draft': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
            case 'void': return 'bg-slate-800 text-slate-500 border-slate-700';
            case 'partially_paid': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    // Filter
    let processedData = invoices.filter(inv => {
        const matchesSearch = inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        const matchesType = typeFilter === 'all' || inv.type === typeFilter;
        const matchesDateFrom = !dateFrom || new Date(inv.issue_date) >= new Date(dateFrom);
        const matchesDateTo = !dateTo || new Date(inv.issue_date) <= new Date(dateTo);
        return matchesSearch && matchesStatus && matchesType && matchesDateFrom && matchesDateTo;
    });

    // Stats based on ALL invoices (not just filtered) to match typical ERP pattern
    const totalAmount = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
    const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
    const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
    const outstandingAmount = invoices.filter(i => ['sent', 'partially_paid', 'draft', 'overdue'].includes(i.status)).reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);

    // Sort
    processedData.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortField === 'total_amount') {
            valA = parseFloat(valA || 0);
            valB = parseFloat(valB || 0);
        }
        if (valA < valB) return sortDesc ? 1 : -1;
        if (valA > valB) return sortDesc ? -1 : 1;
        return 0;
    });

    const totalPages = Math.ceil(processedData.length / perPage);
    const paginatedData = processedData.slice((page - 1) * perPage, page * perPage);

    const toggleSort = (field) => {
        if (sortField === field) setSortDesc(!sortDesc);
        else { setSortField(field); setSortDesc(true); }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDesc ? <ChevronDown size={14} className="inline ml-1" /> : <ChevronUp size={14} className="inline ml-1" />;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Invoices</h1>
                    <p className="text-slate-400">Invoice Registry</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportCsv} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700">
                        <Download size={18} /> Export CSV
                    </button>
                    <button
                        onClick={() => navigate('/admin/accounting/invoices/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={18} /> New Invoice
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-slate-700/50 bg-slate-900/50">
                    <div className="text-sm text-slate-400 font-medium">Total Issued</div>
                    <div className="text-xl font-black text-white mt-1">${totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">{invoices.length} invoices</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-900/10">
                    <div className="text-sm text-emerald-400 font-medium">Paid</div>
                    <div className="text-xl font-black text-white mt-1">${paidAmount.toLocaleString()}</div>
                    <div className="text-xs text-emerald-500/70 mt-1">{invoices.filter(i=>i.status==='paid').length} invoices</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-blue-500/20 bg-blue-900/10">
                    <div className="text-sm text-blue-400 font-medium">Outstanding</div>
                    <div className="text-xl font-black text-white mt-1">${outstandingAmount.toLocaleString()}</div>
                    <div className="text-xs text-blue-500/70 mt-1">{invoices.filter(i=>['sent','draft','partially_paid','overdue'].includes(i.status)).length} invoices</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-red-500/20 bg-red-900/10">
                    <div className="text-sm text-red-400 font-medium">Overdue</div>
                    <div className="text-xl font-black text-white mt-1">${overdueAmount.toLocaleString()}</div>
                    <div className="text-xs text-red-500/70 mt-1">{invoices.filter(i=>i.status==='overdue').length} invoices</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel p-4 rounded-xl border border-slate-700/50 bg-slate-900/80 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search number, client, ref..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-blue-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 min-w-[140px]">
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="void">Void</option>
                </select>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 min-w-[140px]">
                    <option value="all">All Types</option>
                    <option value="standard">Standard</option>
                    <option value="proforma">Proforma</option>
                    <option value="credit_note">Credit Note</option>
                </select>
                <div className="flex items-center gap-2">
                    <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300" />
                    <span className="text-slate-500">-</span>
                    <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300" />
                </div>
                <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setTypeFilter('all'); setDateFrom(''); setDateTo(''); }} className="text-sm text-blue-400 hover:text-blue-300 ml-auto font-medium">Clear Filters</button>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-3 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <span className="text-blue-400 font-bold ml-2">{selectedIds.length} selected</span>
                    <div className="h-6 w-px bg-blue-500/30"></div>
                    <button onClick={() => handleBulkAction('paid')} className="text-sm text-slate-300 hover:text-emerald-400 flex items-center gap-1"><CheckCircle size={16}/> Mark Paid</button>
                    <button onClick={() => handleBulkAction('sent')} className="text-sm text-slate-300 hover:text-blue-400 flex items-center gap-1"><Send size={16}/> Send</button>
                    <button onClick={() => handleBulkAction('void')} className="text-sm text-slate-300 hover:text-red-400 flex items-center gap-1"><XCircle size={16}/> Void</button>
                    <button onClick={exportCsv} className="text-sm text-slate-300 hover:text-white flex items-center gap-1"><Download size={16}/> Export</button>
                </div>
            )}

            {/* Data Table */}
            <div className="glass-panel rounded-xl border border-slate-700/50 bg-slate-900/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/50 border-b border-slate-700/50">
                            <tr>
                                <th className="p-4 w-12">
                                    <button onClick={() => setSelectedIds(selectedIds.length === paginatedData.length ? [] : paginatedData.map(i=>i.id))} className="text-slate-400 hover:text-white">
                                        {selectedIds.length === paginatedData.length && paginatedData.length > 0 ? <CheckSquare size={18} className="text-blue-500"/> : <Square size={18}/>}
                                    </button>
                                </th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase cursor-pointer hover:text-white" onClick={() => toggleSort('invoice_number')}>Invoice # <SortIcon field="invoice_number"/></th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase cursor-pointer hover:text-white" onClick={() => toggleSort('client_name')}>Client <SortIcon field="client_name"/></th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase cursor-pointer hover:text-white" onClick={() => toggleSort('type')}>Type <SortIcon field="type"/></th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase cursor-pointer hover:text-white" onClick={() => toggleSort('issue_date')}>Issue Date <SortIcon field="issue_date"/></th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase cursor-pointer hover:text-white" onClick={() => toggleSort('due_date')}>Due Date <SortIcon field="due_date"/></th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right cursor-pointer hover:text-white" onClick={() => toggleSort('total_amount')}>Amount <SortIcon field="total_amount"/></th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase cursor-pointer hover:text-white" onClick={() => toggleSort('status')}>Status <SortIcon field="status"/></th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {loading ? (
                                <tr><td colSpan="9" className="p-8 text-center"><RefreshCw size={24} className="animate-spin text-blue-500 mx-auto"/></td></tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <FileText size={48} className="text-slate-600" />
                                            <div className="text-lg font-bold text-white">No invoices found</div>
                                            <p className="text-slate-400 text-sm">Adjust your filters or create a new invoice.</p>
                                            <button onClick={() => navigate('/admin/accounting/invoices/create')} className="px-4 py-2 mt-2 bg-blue-600 text-white rounded font-bold text-sm">Create First Invoice</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((inv) => (
                                    <tr key={inv.id} className={`hover:bg-slate-800/30 transition-colors ${selectedIds.includes(inv.id) ? 'bg-blue-900/10' : ''}`}>
                                        <td className="p-4">
                                            <button onClick={() => setSelectedIds(prev => prev.includes(inv.id) ? prev.filter(id=>id!==inv.id) : [...prev, inv.id])} className="text-slate-400 hover:text-white mt-1">
                                                {selectedIds.includes(inv.id) ? <CheckSquare size={18} className="text-blue-500"/> : <Square size={18}/>}
                                            </button>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-white"><span className="cursor-pointer hover:text-blue-400" onClick={()=>navigate(`/admin/accounting/invoices/${inv.id}`)}>{inv.invoice_number}</span></td>
                                        <td className="p-4 font-medium text-slate-300">{inv.client_name || inv.client?.name}</td>
                                        <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">{inv.type || 'Standard'}</span></td>
                                        <td className="p-4 text-slate-400">{inv.issue_date}</td>
                                        <td className="p-4 text-slate-400">{inv.due_date}</td>
                                        <td className="p-4 text-right font-black text-white">${parseFloat(inv.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(inv.status)}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2 relative group">
                                                <button onClick={() => navigate(`/admin/accounting/invoices/${inv.id}`)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded" title="View"><Eye size={16} className="lucide lucide-eye" /></button>
                                                <button onClick={() => handleDownload(inv.id)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded" title="Download PDF"><Download size={16}/></button>
                                                
                                                <div className="relative">
                                                    <button className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded" title="More Actions">
                                                        <MoreVertical size={16}/>
                                                    </button>
                                                    {/* Custom simple dropdown on hover for "More" */}
                                                    <div className="absolute right-0 top-full mt-1 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                                        {inv.status === 'draft' && <button onClick={() => navigate(`/admin/accounting/invoices/${inv.id}/edit`)} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Edit</button>}
                                                        <button onClick={() => handleStatusChange(inv.id, 'sent', accountingService.sendInvoiceToClient)} className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-slate-700">Mark Sent</button>
                                                        <button onClick={() => handleStatusChange(inv.id, 'paid', accountingService.markInvoicePaid)} className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-slate-700">Mark Paid</button>
                                                        <button onClick={() => handleStatusChange(inv.id, 'void', accountingService.voidInvoice)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Void</button>
                                                        <button onClick={async () => {
                                                            const res = await accountingService.duplicateInvoice(inv.id);
                                                            if(res) { toast.success("Duplicated"); navigate(`/admin/accounting/invoices/${res.id}/edit`); }
                                                        }} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Duplicate</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer */}
                {processedData.length > 0 && (
                    <div className="p-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-slate-400">
                        <div>Showing {(page - 1) * perPage + 1} – {Math.min(page * perPage, processedData.length)} of {processedData.length} invoices</div>
                        <div className="flex gap-2 items-center">
                            <span className="mr-2">Rows per page: </span>
                            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300">
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded ml-4">Prev</button>
                            <span className="px-2 text-white font-bold">{page} / {totalPages}</span>
                            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceList;
