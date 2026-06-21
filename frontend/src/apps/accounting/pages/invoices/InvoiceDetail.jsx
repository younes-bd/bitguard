import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { erpService } from '../../../../core/api/erpService';
import reportingService from '../../../../core/api/reportingService';
import {
    ArrowLeft, Printer, Download, Mail,
    CheckCircle, AlertCircle, Clock, FileCheck, RefreshCcw, Link, DollarSign, FileText, X
} from 'lucide-react';

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    const [templates, setTemplates] = useState([]);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);

    const fetchInvoice = async () => {
        try {
            const data = await erpService.getInvoice(id);
            setInvoice(data);
        } catch (error) {
            console.error("Failed to load invoice", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const handleConvertToInvoice = async () => {
        if (!window.confirm("Convert this Proforma to a Standard Invoice? This will generate accounting ledger entries.")) return;
        
        setActionLoading(true);
        try {
            await erpService.updateInvoice(id, { type: 'standard', status: 'sent' });
            await fetchInvoice();
        } catch (error) {
            console.error("Conversion failed", error);
            alert("Failed to convert document.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleGenerateReport = async (templateId) => {
        setGeneratingReport(true);
        try {
            const res = await reportingService.generateReport(templateId, 'accounting.Invoice', id);
            alert("Report generated successfully!");
            if (res.file) {
                window.open(res.file, '_blank');
            }
        } catch (error) {
            console.error("Report generation failed", error);
            alert("Failed to generate report.");
        } finally {
            setGeneratingReport(false);
            setShowTemplateModal(false);
        }
    };

    const loadTemplates = async () => {
        try {
            const res = await reportingService.getTemplates();
            setTemplates(res?.results || res || []);
            setShowTemplateModal(true);
        } catch (error) {
            console.error("Failed to load templates", error);
            alert("Failed to load templates.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!invoice) return (
        <div className="text-center py-12 text-slate-400">Invoice not found.</div>
    );

    const getStatusBadge = (status) => {
        const styles = {
            paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
            sent: "bg-blue-500/20 text-blue-400 border-blue-500/50",
            overdue: "bg-red-500/20 text-red-400 border-red-500/50",
            draft: "bg-slate-500/20 text-slate-400 border-slate-500/50",
            partially_paid: "bg-orange-500/20 text-orange-400 border-orange-500/50"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[status] || styles.draft}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        if (type === 'proforma') return (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-purple-500/20 text-purple-400 border-purple-500/50">
                Proforma
            </span>
        );
        if (type === 'credit_note') return (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-red-500/20 text-red-400 border-red-500/50">
                Credit Note
            </span>
        );
        return (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-blue-500/20 text-blue-400 border-blue-500/50">
                Standard Invoice
            </span>
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/accounting/invoices')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Registry</span>
                </button>
                <div className="flex flex-wrap gap-2">
                    {invoice.status !== 'paid' && invoice.status !== 'void' && invoice.type !== 'proforma' && (
                        <button 
                            onClick={() => {
                                alert("Open record payment modal/page");
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 font-medium"
                        >
                            <DollarSign size={18} />
                            <span>Record Payment</span>
                        </button>
                    )}
                    {invoice.type === 'proforma' && (
                        <button 
                            onClick={handleConvertToInvoice}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/10 font-medium"
                        >
                            {actionLoading ? <RefreshCcw size={18} className="animate-spin" /> : <FileCheck size={18} />}
                            <span>Convert to Invoice</span>
                        </button>
                    )}
                    <button 
                        onClick={loadTemplates}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium"
                    >
                        <FileText size={18} />
                        <span>Generate Report</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50">
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button 
                        onClick={async () => {
                            setActionLoading(true);
                            try {
                                await erpService.downloadInvoice(id);
                            } catch (e) {
                                alert("Failed to download PDF.");
                            } finally {
                                setActionLoading(false);
                            }
                        }}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-slate-300 rounded-xl transition-colors border border-slate-700/50"
                    >
                        <Download size={18} />
                        <span>PDF Export</span>
                    </button>
                    {invoice.payment_link_url && (
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(invoice.payment_link_url);
                                alert("Payment link copied to clipboard!");
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50"
                        >
                            <Link size={18} />
                            <span>Copy Link</span>
                        </button>
                    )}
                    <button 
                        onClick={async () => {
                            setActionLoading(true);
                            try {
                                await erpService.sendInvoiceToClient(id);
                                alert("Invoice dispatched successfully!");
                            } catch (e) {
                                alert("Failed to dispatch invoice.");
                            } finally {
                                setActionLoading(false);
                            }
                        }}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium"
                    >
                        <Mail size={18} />
                        <span>Dispatch to Client</span>
                    </button>
                </div>
            </div>

            {/* Document Paper */}
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                {/* Header Decoration */}
                <div className={`h-2 w-full ${invoice.type === 'proforma' ? 'bg-purple-500' : invoice.type === 'credit_note' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                
                {/* Brand & Type */}
                <div className="p-12 flex justify-between items-start border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">B</div>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">BITGUARD</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-1 uppercase tracking-tighter">
                            {invoice.type === 'credit_note' ? 'Credit Note' : invoice.type === 'proforma' ? 'Proforma Invoice' : 'Tax Invoice'}
                        </h1>
                        <div className="text-slate-400 font-mono text-lg">#{invoice.invoice_number}</div>
                    </div>
                    <div className="text-right space-y-1">
                        <div className="text-slate-500 text-sm uppercase font-bold tracking-widest">Legal Entity</div>
                        <div className="font-bold text-slate-900">BitGuard Enterprise Solutions</div>
                        <div className="text-slate-500 text-sm leading-relaxed">
                            123 Innovation Drive, Level 42<br />
                            Silicon Valley, CA 94025<br />
                            United States of America<br />
                            <span className="text-slate-400 mt-1 block">VAT: US994455221</span>
                        </div>
                    </div>
                </div>

                {/* Client & Metadata Grid */}
                <div className="p-12 grid grid-cols-2 lg:grid-cols-4 gap-12 bg-slate-50/50 border-b border-slate-100">
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">Bill To</div>
                        <div className="font-bold text-slate-900 text-lg">{invoice.client_name}</div>
                        <div className="text-slate-500 text-sm leading-relaxed mt-2">
                            Global Operations Center<br />
                            Tech Corridor, Building B<br />
                            {invoice.client_email}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">Timeline</div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CalendarIcon size={14} className="text-slate-300" />
                                <span className="text-sm text-slate-600">Issued: <span className="text-slate-900 font-bold">{invoice.issue_date}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon size={14} className="text-slate-300" />
                                <span className="text-sm text-slate-600">Due: <span className="text-slate-900 font-bold">{invoice.due_date}</span></span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">Document Details</div>
                        <div className="space-y-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-slate-400">STATUS</span>
                                {getStatusBadge(invoice.status)}
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                                <span className="text-[10px] text-slate-400">TYPE</span>
                                {getTypeBadge(invoice.type)}
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">Balance Due</div>
                            <div className="text-3xl font-black text-slate-900">${(invoice.balance_due || 0).toLocaleString()}</div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{invoice.reference || 'REF: NOCONTRACT'}</div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="p-12 pb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest">
                                <th className="pb-6 w-12">#</th>
                                <th className="pb-6 pl-4">Description of Services</th>
                                <th className="pb-6 text-right w-24">Quantity</th>
                                <th className="pb-6 text-right w-32">Unit Price</th>
                                <th className="pb-6 text-right w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {invoice.items && invoice.items.map((item, i) => (
                                <tr key={i} className="border-b border-slate-100 group">
                                    <td className="py-6 text-slate-400 font-mono text-xs">{i + 1}</td>
                                    <td className="py-6 pl-4">
                                        <div className="font-bold text-slate-900">{item.description}</div>
                                        <div className="text-[10px] text-slate-400 mt-1 uppercase">SERVICE OBLIGATION MET</div>
                                    </td>
                                    <td className="py-6 text-right font-mono text-sm">{item.quantity}</td>
                                    <td className="py-6 text-right font-mono text-sm">${(Number(item.unit_price) || 0).toLocaleString()}</td>
                                    <td className="py-6 text-right font-bold text-slate-900 font-mono text-sm">${(Number(item.total) || 0).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Payment History Panel */}
                {invoice.payments && invoice.payments.length > 0 && (
                    <div className="px-12 pb-8">
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-4 tracking-[0.2em]">Payment History</div>
                        <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100/50">
                                    <tr className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Reference</th>
                                        <th className="p-4">Method</th>
                                        <th className="p-4 text-right">Amount</th>
                                        <th className="p-4 text-right">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.payments.map((p, i) => (
                                        <tr key={i} className="border-t border-slate-100 text-sm">
                                            <td className="p-4 text-slate-600 font-mono">{p.date}</td>
                                            <td className="p-4 text-slate-900 font-medium">{p.reference || '-'}</td>
                                            <td className="p-4 text-slate-600">{p.method}</td>
                                            <td className="p-4 text-right font-bold text-emerald-600 font-mono">${(Number(p.amount) || 0).toLocaleString()}</td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={async () => {
                                                        try {
                                                            const { default: reportingService } = await import('../../../../core/api/reportingService');
                                                            const res = await reportingService.generateReport(null, 'accounting.Payment', p.id);
                                                            if (res && res.file) {
                                                                window.open(res.file, '_blank');
                                                            }
                                                        } catch (err) {
                                                            alert("Failed to download PDF");
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                                    title="Download Payment Receipt"
                                                >
                                                    <Download size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Summary Totals */}
                <div className="px-12 pb-12 flex justify-between items-start gap-12">
                    <div className="max-w-md">
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-4 tracking-[0.2em]">Notes & Terms</div>
                        <div className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            {invoice.notes || "Standard 30-day payment terms apply. For international transfers, please use the provided SWIFT/BIC codes. Proforma invoices do not constitute a legal tax document until converted."}
                        </div>
                    </div>
                    
                    <div className="w-80 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>Subtotal</span>
                            <span className="font-mono">${(Number(invoice.subtotal) || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>Tax Aggregate</span>
                            <span className="font-mono">${(Number(invoice.tax_total) || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400 pb-4 border-b border-white/10">
                            <span>Discounts</span>
                            <span className="font-mono text-red-400">-${(Number(invoice.discount_total) || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Total Amount Due</span>
                            <span className="text-3xl font-black font-mono leading-none">${(Number(invoice.total_amount) || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Secure Footer */}
                <div className="bg-slate-50 p-8 flex justify-between items-center border-t border-slate-100">
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                            <CheckCircle size={16} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Digitally Signed & Verified</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Document generated by BitGuard ERP OS
                    </div>
                </div>
            </div>

            {/* Template Selection Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 flex justify-between items-center border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><FileText size={18} className="text-blue-500" /> Select Template</h3>
                            <button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-6">
                            {templates.length === 0 ? (
                                <p className="text-slate-400 text-sm">No templates available. Create one in the Reporting Engine.</p>
                            ) : (
                                <div className="space-y-3">
                                    {templates.map(t => (
                                        <button 
                                            key={t.id}
                                            onClick={() => handleGenerateReport(t.id)}
                                            disabled={generatingReport}
                                            className="w-full text-left px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500 transition-colors flex justify-between items-center group"
                                        >
                                            <div>
                                                <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{t.name}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-1">{t.model}</div>
                                            </div>
                                            {generatingReport ? <RefreshCcw size={16} className="text-slate-500 animate-spin" /> : <FileCheck size={16} className="text-slate-500 group-hover:text-blue-400" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CalendarIcon = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const ClockIcon = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

export default InvoiceDetail;




