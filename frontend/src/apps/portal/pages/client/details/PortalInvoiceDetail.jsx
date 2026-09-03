import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import { accountingService } from '../../../../accounting/api/accountingService';
import toast from 'react-hot-toast';

export default function PortalInvoiceDetail() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        accountingService.getInvoices().then(data => {
            const arr = Array.isArray(data) ? data : (data?.results ?? []);
            const found = arr.find(i => String(i.id) === String(id));
            if (found) setInvoice(found);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center text-slate-500 py-12">Loading invoice...</div>;
    if (!invoice) return <div className="text-center text-slate-500 py-12">Invoice not found</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Link to="/portal/invoices" className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Invoices
            </Link>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg">
                <div className="flex justify-between items-start border-b border-slate-800 pb-6 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Invoice #{invoice.invoice_number ?? invoice.id}</h1>
                        <div className="text-slate-400">Date: {invoice.issue_date ?? invoice.created_at?.split('T')[0]}</div>
                    </div>
                    <button className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <Download size={16} className="mr-2" /> Download PDF
                    </button>
                </div>
                
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-slate-200 mb-4">Amount Due</h2>
                    <div className="text-4xl font-bold text-white">${Number(invoice.total ?? invoice.amount ?? 0).toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}

