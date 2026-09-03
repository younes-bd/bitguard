import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, FileText, CheckCircle, XCircle, ArrowUpRight, DollarSign } from 'lucide-react';
import { accountingService } from '../../api/accountingService';
import { toast } from 'react-hot-toast';

const VendorBillsList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const data = await accountingService.getVendorBills();
            setBills(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to fetch vendor bills:", error);
            toast.error("Failed to load vendor bills");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await accountingService.updateVendorBill(id, { status: 'approved' });
                toast.success('Bill Approved');
            } else if (action === 'pay') {
                await accountingService.payVendorBill(id);
                toast.success('Bill Paid');
            } else if (action === 'cancel') {
                await accountingService.updateVendorBill(id, { status: 'cancelled' });
                toast.success('Bill Cancelled');
            }
            fetchBills();
        } catch (error) {
            toast.error(`Action ${action} failed`);
        }
    };

    const filteredBills = bills.filter(bill => {
        const matchesSearch = (bill.bill_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             bill.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'draft': return <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">Draft</span>;
            case 'approved': return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs border border-blue-500/30">Approved</span>;
            case 'paid': return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs border border-emerald-500/30">Paid</span>;
            case 'cancelled': return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs border border-red-500/30">Cancelled</span>;
            default: return <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">{status}</span>;
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-6 h-6 text-indigo-500" />
                        Vendor Bills
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage accounts payable and vendor invoices.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-medium transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>New Bill</span>
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by bill number or vendor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg py-2 pl-3 pr-8 focus:border-indigo-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="draft">Draft</option>
                            <option value="approved">Approved</option>
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800/80 text-slate-300 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Bill No</th>
                                <th className="px-6 py-4 font-semibold">Vendor</th>
                                <th className="px-6 py-4 font-semibold">Bill Date</th>
                                <th className="px-6 py-4 font-semibold">Due Date</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">Loading vendor bills...</td>
                                </tr>
                            ) : filteredBills.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">No vendor bills found.</td>
                                </tr>
                            ) : (
                                filteredBills.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-indigo-400">
                                            {bill.bill_number || `BILL-${bill.id.substring(0, 8)}`}
                                        </td>
                                        <td className="px-6 py-4 text-slate-200">
                                            {bill.vendor?.name || 'Unknown Vendor'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {bill.bill_date ? new Date(bill.bill_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {bill.due_date ? new Date(bill.due_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-200">
                                            {formatCurrency(bill.total_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(bill.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {bill.status === 'draft' && (
                                                    <button onClick={() => handleAction(bill.id, 'approve')} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded" title="Approve">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {bill.status === 'approved' && (
                                                    <button onClick={() => handleAction(bill.id, 'pay')} className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded" title="Register Payment">
                                                        <DollarSign className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {(bill.status === 'draft' || bill.status === 'approved') && (
                                                    <button onClick={() => handleAction(bill.id, 'cancel')} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded" title="Cancel">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
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

export default VendorBillsList;
