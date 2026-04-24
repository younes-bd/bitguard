import React from 'react';

const CommercialInvoiceTemplate = ({ data }) => {
    // Generate mock pricing for the invoice presentation since servicesData doesn't have prices
    const getMockPrice = (index) => ((index + 1) * 1500) + 500;
    
    const subtotal = data.services.reduce((acc, _, idx) => acc + getMockPrice(idx), 0);
    const tax = subtotal * 0.08; // 8% tax mock
    const total = subtotal + tax;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="p-12 relative h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div className="text-left">
                    <div className="text-3xl font-black tracking-tighter text-slate-900 border-b-2 border-slate-900 inline-block pb-1 pr-8 mb-2">BITGUARD</div>
                    <p className="text-sm text-slate-600 font-medium">100 Tech Center Drive, Suite 200</p>
                    <p className="text-sm text-slate-600 font-medium">Irvine, CA 92618</p>
                    <p className="text-sm text-slate-600 font-medium mt-1">billing@bitguard.com</p>
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Tax Invoice</h1>
                    <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        Net 30
                    </div>
                </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-12 mb-12 border-y border-slate-200 py-6">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bill To</p>
                    <h3 className="text-lg font-bold text-slate-900">{data.client.name}</h3>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.client.address}</p>
                    <p className="text-sm text-slate-600 mt-1">{data.client.email}</p>
                </div>
                <div className="text-right flex flex-col gap-2">
                    <div className="flex justify-between w-48 ml-auto border-b border-slate-100 pb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase">Invoice #</span>
                        <span className="text-sm font-semibold text-slate-900">INV-{data.meta.docNumber.split('-')[1]}</span>
                    </div>
                    <div className="flex justify-between w-48 ml-auto border-b border-slate-100 pb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase">Issue Date</span>
                        <span className="text-sm font-semibold text-slate-900">{data.meta.date}</span>
                    </div>
                    <div className="flex justify-between w-48 ml-auto border-b border-slate-100 pb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase">Due Date</span>
                        <span className="text-sm font-semibold text-slate-900">{(new Date(new Date(data.meta.date).getTime() + 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}</span>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="flex-1 mb-12">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">Item</th>
                            <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                            <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-24">Qty</th>
                            <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-32">Rate</th>
                            <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-32">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {data.services.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-slate-400 text-sm border-b border-slate-200">
                                    No services selected.
                                </td>
                            </tr>
                        ) : (
                            data.services.map((service, index) => (
                                <tr key={index} className="border-b border-slate-200 group">
                                    <td className="py-4 text-slate-500 align-top">{(index + 1).toString().padStart(2, '0')}</td>
                                    <td className="py-4 align-top pr-4">
                                        <div className="font-bold text-slate-900">{service.title}</div>
                                        <div className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{service.description}</div>
                                    </td>
                                    <td className="py-4 text-right text-slate-700 align-top">1</td>
                                    <td className="py-4 text-right text-slate-700 align-top">{formatCurrency(getMockPrice(index))}</td>
                                    <td className="py-4 text-right font-semibold text-slate-900 align-top">{formatCurrency(getMockPrice(index))}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-start break-inside-avoid">
                <div className="w-1/2 pr-8">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">Payment Details</h4>
                        <p className="text-xs text-slate-600 font-medium">To pay via credit card, please click the secure link in your email.</p>
                        <hr className="my-2 border-slate-200" />
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">Wire Instructions</h4>
                        <p className="text-xs text-slate-600 font-medium">Bank: Enterprise Tech Bank</p>
                        <p className="text-xs text-slate-600 font-medium">Routing: 122000496</p>
                        <p className="text-xs text-slate-600 font-medium">Account: 9982736411</p>
                    </div>
                </div>
                
                <div className="w-1/2">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600 font-medium">Subtotal</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600 font-medium">Tax Area (8.0%)</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between text-lg border-t-2 border-slate-900 pt-3 mt-3">
                            <span className="font-bold text-slate-900">Total Due</span>
                            <span className="font-black text-slate-900">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 text-center mt-12">
                <p className="text-xs text-slate-500 font-medium">A 1.5% monthly late fee applies to invoices unpaid past 30 days.</p>
            </div>
        </div>
    );
};

export default CommercialInvoiceTemplate;
