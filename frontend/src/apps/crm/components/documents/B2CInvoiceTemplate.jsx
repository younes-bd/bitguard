import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const B2CInvoiceTemplate = ({ data }) => {
    // Generate mock retail pricing
    const getMockPrice = (index) => ((index + 1) * 200) + 99;
    
    const subtotal = data.services.reduce((acc, _, idx) => acc + getMockPrice(idx), 0);
    const tax = subtotal * 0.08; // 8% sales tax mock
    const total = subtotal + tax;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="p-12 relative h-full flex flex-col font-sans">
            {/* Soft, Retail-Friendly Header */}
            <div className="flex justify-between items-center mb-12 pb-8 border-b-2 border-emerald-500">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                        <span className="font-black text-3xl tracking-tighter">B</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">BITGUARD</h1>
                        <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider">Retail Receipt</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 font-medium text-sm">BitGuard Solutions Store</p>
                    <p className="text-slate-500 font-medium text-sm">100 Tech Center Drive</p>
                    <p className="text-slate-500 font-medium text-sm">support@bitguard.com</p>
                </div>
            </div>

            {/* Receipt Info */}
            <div className="flex justify-between items-end mb-10 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Purchased By</p>
                    <h3 className="text-xl font-bold text-slate-900">{data.client.name}</h3>
                    <p className="text-sm text-slate-600 font-medium mt-1">{data.client.email}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order Summary</p>
                    <p className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-1">Receipt: <span className="font-mono text-emerald-600 ml-2">RT-{data.meta.docNumber.split('-')[1]}</span></p>
                    <p className="text-sm font-semibold text-slate-900">Date: <span className="font-mono ml-2">{data.meta.date}</span></p>
                </div>
            </div>

            {/* Line Items - Clean & Modern */}
            <div className="flex-1 mb-12">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b-2 border-slate-100">Item</th>
                            <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right border-b-2 border-slate-100 w-32">Price</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {data.services.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="py-8 text-center text-slate-400 text-sm border-b border-slate-100">
                                    No items selected.
                                </td>
                            </tr>
                        ) : (
                            data.services.map((service, index) => (
                                <tr key={index} className="border-b border-slate-100 group">
                                    <td className="py-5 align-top pr-4">
                                        <div className="font-bold text-slate-900 text-base">{service.title}</div>
                                        <div className="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2 pr-12">{service.description}</div>
                                    </td>
                                    <td className="py-5 text-right font-semibold text-slate-900 text-base align-top">{formatCurrency(getMockPrice(index))}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Totals Box */}
            <div className="ml-auto w-72 mb-12 break-inside-avoid">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium tracking-wide">Subtotal</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium tracking-wide">Sales Tax (8%)</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-2xl border-t-2 border-slate-900 pt-3 mt-3">
                        <span className="font-black text-slate-900">Total</span>
                        <span className="font-black text-emerald-600">{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Paid Stamp */}
                <div className="mt-8 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-3 rounded-xl border border-emerald-200">
                    <CheckCircle2 size={20} />
                    <span className="font-bold uppercase tracking-wider text-sm">Paid in Full</span>
                </div>
            </div>

            {/* Retail Footer */}
            <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center break-inside-avoid">
                <p className="text-xs text-slate-400 font-medium max-w-md">Need help with your purchase? Visit support.bitguard.com or reply to the email containing this receipt.</p>
                <p className="text-xs font-bold text-slate-300 tracking-widest uppercase">Thank You</p>
            </div>
        </div>
    );
};

export default B2CInvoiceTemplate;
