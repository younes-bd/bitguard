import React, { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { accountingService } from '../../api/accountingService';
import { toast } from 'react-hot-toast';

export default function VATReport() {
    const [periodStart, setPeriodStart] = useState('');
    const [periodEnd, setPeriodEnd] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
            // We use the tenant id or something, but the backend uses request.user.tenant.
            // We can just call a specialized endpoint if we added one, or use generateReport.
            // Wait, we added VATReportView at /api/accounting/reports/vat-report/?format=pdf
            // We can use the core api client to fetch it.
            const { default: api } = await import('@/core/api/client');
            const res = await api.get(`/accounting/reports/vat-report/`, {
                params: {
                    format: 'pdf',
                    period_start: periodStart,
                    period_end: periodEnd
                }
            });
            if (res.url) {
                const response = await fetch(res.url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = res.filename || 'vat_report.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            console.error('Failed to download VAT Report', err);
            toast.error('Failed to generate report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="text-blue-500" />
                VAT Report
            </h1>
            
            <div className="glass-panel p-6 rounded-xl border border-slate-800">
                <h2 className="text-lg font-bold text-slate-200 mb-4">Generate VAT Declaration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Period Start</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="date"
                                value={periodStart}
                                onChange={(e) => setPeriodStart(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-slate-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Period End</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="date"
                                value={periodEnd}
                                onChange={(e) => setPeriodEnd(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-slate-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleDownload}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                    <Download size={18} />
                    {loading ? 'Generating...' : 'Export PDF'}
                </button>
            </div>
        </div>
    );
}
