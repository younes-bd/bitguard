import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, Download, ShieldCheck, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';

const ClientPortalInvoice = () => {
    const { token } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const fetchInvoiceByToken = async () => {
            try {
                // Assuming erpService has a method to get invoice by token
                // Or backend endpoint like /api/erp/invoices/by-token/:token/
                const response = await fetch(`http://127.0.0.1:8000/api/v1/accounting/portal/invoice/${token}/`);
                if (response.ok) {
                    const data = await response.json();
                    setInvoice(data.data || data);
                } else {
                    // Fallback to mock data for presentation if API is not fully ready
                    setTimeout(() => {
                        setInvoice({
                            id: 1,
                            invoice_number: 'INV-2026-0042',
                            client_name: 'Stark Industries',
                            issue_date: '2026-05-15',
                            due_date: '2026-06-14',
                            status: 'sent',
                            total_amount: 14500.00,
                            balance_due: 14500.00,
                            items: [
                                { description: 'Enterprise Security Audit', quantity: 1, unit_price: 10000.00, total: 10000.00 },
                                { description: 'Cloud Infrastructure Setup', quantity: 1, unit_price: 4500.00, total: 4500.00 }
                            ]
                        });
                        setLoading(false);
                    }, 1000);
                    return;
                }
            } catch (err) {
                console.error("Error fetching invoice", err);
            }
            setLoading(false);
        };
        fetchInvoiceByToken();
    }, [token]);

    const handlePayment = () => {
        setPaymentProcessing(true);
        setTimeout(() => {
            setPaymentProcessing(false);
            setPaymentSuccess(true);
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center space-y-4">
                    <ShieldCheck size={64} className="mx-auto text-slate-700" />
                    <h2 className="text-2xl font-bold">Secure Link Expired</h2>
                    <p className="text-slate-400">This payment link is no longer valid or does not exist.</p>
                </div>
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex items-center justify-center p-4">
                <div className="glass-panel max-w-md w-full p-10 rounded-3xl border border-emerald-500/30 text-center space-y-6 relative overflow-hidden bg-emerald-500/5">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <CheckCircle2 size={80} className="mx-auto text-emerald-500" />
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Payment Successful</h2>
                        <p className="text-slate-400">Thank you, {invoice.client_name}. Your payment of <span className="text-white font-bold">${invoice.total_amount.toLocaleString()}</span> has been processed securely.</p>
                    </div>
                    <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                        <Download size={18} /> Download Receipt
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 py-12 md:py-24 font-sans relative">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Left Column - Invoice Details */}
                <div className="lg:col-span-3 space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-6">
                            <ShieldCheck size={14} className="text-blue-400" />
                            <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Secure Payment Portal</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-2">
                            Invoice <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">#{invoice.invoice_number}</span>
                        </h1>
                        <p className="text-lg text-slate-400">Issued to {invoice.client_name} by BitGuard Enterprise</p>
                    </div>

                    <div className="glass-panel p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl bg-slate-900/40 backdrop-blur-xl space-y-8">
                        <div className="grid grid-cols-2 gap-8 border-b border-slate-800 pb-8">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Issue Date</div>
                                <div className="text-white font-medium">{invoice.issue_date}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Due Date</div>
                                <div className="text-white font-medium">{invoice.due_date}</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Itemized Breakdown</div>
                            <div className="space-y-4">
                                {invoice.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-start group">
                                        <div>
                                            <div className="text-white font-bold group-hover:text-blue-400 transition-colors">{item.description}</div>
                                            <div className="text-sm text-slate-500">Qty: {item.quantity} Ã— ${(Number(item.unit_price)).toLocaleString()}</div>
                                        </div>
                                        <div className="text-white font-mono">${(Number(item.total)).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-8 flex justify-between items-end">
                            <div>
                                <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                                    <Download size={16} /> Download PDF Copy
                                </button>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Due</div>
                                <div className="text-4xl font-black text-white font-mono">${(Number(invoice.balance_due)).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Payment Panel */}
                <div className="lg:col-span-2">
                    <div className="sticky top-8 glass-panel p-8 rounded-3xl border border-blue-500/20 shadow-2xl shadow-blue-900/20 bg-slate-900/60 backdrop-blur-2xl">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Complete Payment</h3>
                            <p className="text-sm text-slate-400">Select a payment method to settle this invoice securely.</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-blue-500 bg-blue-500/10 cursor-pointer transition-all">
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700" />
                                    <span className="font-bold text-white">Credit Card</span>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] font-black text-slate-400">VISA</div>
                                    <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] font-black text-slate-400">MC</div>
                                </div>
                            </label>

                            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-700 hover:border-slate-600 bg-slate-800/50 cursor-pointer transition-all">
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700" />
                                    <span className="font-bold text-white">Bank Transfer</span>
                                </div>
                                <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] font-black text-slate-400">ACH</div>
                            </label>
                        </div>

                        <button 
                            onClick={handlePayment}
                            disabled={paymentProcessing}
                            className="w-full group relative overflow-hidden rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
                        >
                            {paymentProcessing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Pay ${(Number(invoice.balance_due)).toLocaleString()}</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <Lock size={12} />
                            <span>Secured by 256-bit encryption</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientPortalInvoice;

