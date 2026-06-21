import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { erpService } from '../../../../core/api/erpService';
import reportingService from '../../../../core/api/reportingService';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft, Mail, Phone, Globe, MapPin, 
    Briefcase, FileText, ShoppingCart, Activity,
    Edit3, Settings, ShieldCheck, DollarSign, Download
} from 'lucide-react';

const VendorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const data = await erpService.getVendor(id);
                setVendor(data);
            } catch (error) {
                console.error("Failed to load vendor", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVendor();
    }, [id]);

    const handleDownloadPdf = async () => {
        setGenerating(true);
        try {
            await reportingService.generateReport(null, 'purchase.Vendor', vendor.id);
            toast.success('Document downloaded successfully');
        } catch (error) {
            toast.error('Failed to generate document');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );

    if (!vendor) return (
        <div className="text-center py-12 text-slate-400">Vendor not found.</div>
    );

    const getStatusBadge = (status) => {
        const styles = {
            active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
            inactive: "bg-slate-500/20 text-slate-400 border-slate-500/50",
            blacklisted: "bg-red-500/20 text-red-400 border-red-500/50"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[status] || styles.inactive}`}>
                {status || 'Unknown'}
            </span>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/purchase/vendors')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Vendors</span>
                </button>
                <div className="flex gap-2">
                    <button 
                        onClick={handleDownloadPdf} 
                        disabled={generating}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50 disabled:opacity-50"
                    >
                        <Download size={16} />
                        <span>{generating ? 'Generating...' : 'Download PDF'}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50">
                        <Edit3 size={16} />
                        <span>Edit Vendor</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all shadow-lg shadow-orange-500/20 font-medium">
                        <ShoppingCart size={16} />
                        <span>Create PO</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile Card */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
                        <div className="h-24 bg-gradient-to-r from-orange-600/40 to-rose-600/40 relative"></div>
                        <div className="px-8 pb-8 -mt-12 relative">
                            <div className="w-24 h-24 bg-slate-800 border-4 border-slate-900 rounded-2xl flex items-center justify-center text-3xl font-black text-orange-500 mb-4 shadow-lg">
                                {vendor.name ? vendor.name.charAt(0).toUpperCase() : 'V'}
                            </div>
                            <div className="mb-2">
                                <h1 className="text-2xl font-bold text-white mb-1">{vendor.name}</h1>
                                {getStatusBadge(vendor.status || 'active')}
                            </div>
                            
                            <div className="mt-6 space-y-4">
                                {vendor.email && (
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Mail size={16} className="text-orange-400" />
                                        <span className="text-sm">{vendor.email}</span>
                                    </div>
                                )}
                                {vendor.phone && (
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Phone size={16} className="text-orange-400" />
                                        <span className="text-sm">{vendor.phone}</span>
                                    </div>
                                )}
                                {vendor.website && (
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Globe size={16} className="text-orange-400" />
                                        <span className="text-sm">{vendor.website}</span>
                                    </div>
                                )}
                                {vendor.address && (
                                    <div className="flex items-start gap-3 text-slate-400">
                                        <MapPin size={16} className="text-orange-400 mt-0.5" />
                                        <span className="text-sm leading-relaxed">{vendor.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Activity size={16} className="text-blue-400" />
                            Financial Summary
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <span className="text-sm text-slate-400">YTD Spend</span>
                                <span className="font-bold text-white font-mono">${(vendor.ytd_spend || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <span className="text-sm text-slate-400">Open PO Balance</span>
                                <span className="font-bold text-orange-400 font-mono">${(vendor.open_po_balance || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <span className="text-sm text-slate-400">Payment Terms</span>
                                <span className="font-medium text-slate-300 text-sm">{vendor.payment_terms || 'Net 30'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Related Data */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs / Headers (Static for now) */}
                    <div className="flex gap-4 border-b border-slate-700/50 pb-px">
                        <button className="px-4 py-2 border-b-2 border-orange-500 text-orange-400 font-bold text-sm">
                            Purchase Orders
                        </button>
                        <button className="px-4 py-2 border-b-2 border-transparent text-slate-400 hover:text-slate-300 font-medium text-sm transition-colors">
                            Bills & Expenses
                        </button>
                        <button className="px-4 py-2 border-b-2 border-transparent text-slate-400 hover:text-slate-300 font-medium text-sm transition-colors">
                            Contracts
                        </button>
                    </div>

                    {/* Purchase Orders List */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <ShoppingCart size={16} className="text-orange-400" />
                                Recent Purchase Orders
                            </h3>
                            <button className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-wider transition-colors">
                                View All
                            </button>
                        </div>
                        <div className="p-0">
                            {(!vendor.purchase_orders || vendor.purchase_orders.length === 0) ? (
                                <div className="p-8 text-center text-slate-500 text-sm">No recent purchase orders found.</div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-slate-800/50 border-b border-slate-700/50">
                                        <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                            <th className="p-4">PO Number</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendor.purchase_orders.map((po, i) => (
                                            <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => navigate(`/admin/purchase/orders/${po.id}`)}>
                                                <td className="p-4 font-mono text-sm text-blue-400">{po.po_number}</td>
                                                <td className="p-4 text-sm text-slate-300">{po.date}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                                                        ${po.status === 'received' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                        {po.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-mono text-sm text-slate-200 font-bold">${(Number(po.total_amount) || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-400" />
                                Compliance & Tax
                            </h3>
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Tax ID / VAT</span>
                                    <span className="text-sm font-mono text-slate-300 mt-1">{vendor.tax_id || 'Not provided'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">1099 Vendor</span>
                                    <span className="text-sm text-slate-300 mt-1">{vendor.is_1099 ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                <Briefcase size={16} className="text-purple-400" />
                                Internal Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Category</span>
                                    <span className="text-sm text-slate-300 mt-1">{vendor.category || 'Uncategorized'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Account Rep</span>
                                    <span className="text-sm text-slate-300 mt-1">{vendor.account_rep || 'Unassigned'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetail;
