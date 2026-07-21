import React, { useState, useEffect } from 'react';
import { FileBarChart, Download, Search, RefreshCw } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { toast } from 'react-hot-toast';

const AgedPayables = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchReport = async () => {
        setLoading(true);
        try {
            const data = await erpService.getAgedPayables();
            setReportData(data || []);
        } catch (error) {
            console.error("Failed to fetch Aged Payables:", error);
            toast.error("Failed to load report data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

    const filteredData = reportData.filter(row => 
        row.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totals = filteredData.reduce((acc, row) => ({
        current: acc.current + row.current,
        days_30: acc.days_30 + row.days_30,
        days_60: acc.days_60 + row.days_60,
        days_90: acc.days_90 + row.days_90,
        older: acc.older + row.older,
        total: acc.total + row.total
    }), { current: 0, days_30: 0, days_60: 0, days_90: 0, older: 0, total: 0 });

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileBarChart className="w-6 h-6 text-rose-500" />
                        Aged Payables
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Track outstanding vendor bills by age bucket.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchReport}
                        className="p-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search vendor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800/80 text-slate-300 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Vendor Name</th>
                                <th className="px-6 py-4 font-semibold text-right">Current</th>
                                <th className="px-6 py-4 font-semibold text-right">1 - 30 Days</th>
                                <th className="px-6 py-4 font-semibold text-right">31 - 60 Days</th>
                                <th className="px-6 py-4 font-semibold text-right text-orange-400">61 - 90 Days</th>
                                <th className="px-6 py-4 font-semibold text-right text-red-400">&gt; 90 Days</th>
                                <th className="px-6 py-4 font-semibold text-right">Total Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 opacity-50" />
                                        Generating report...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                        No outstanding payables found.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-200">{row.vendor_name}</td>
                                        <td className="px-6 py-4 text-right text-slate-300">{formatCurrency(row.current)}</td>
                                        <td className="px-6 py-4 text-right text-slate-300">{formatCurrency(row.days_30)}</td>
                                        <td className="px-6 py-4 text-right text-slate-300">{formatCurrency(row.days_60)}</td>
                                        <td className="px-6 py-4 text-right text-orange-400 font-medium">{formatCurrency(row.days_90)}</td>
                                        <td className="px-6 py-4 text-right text-red-400 font-medium">{formatCurrency(row.older)}</td>
                                        <td className="px-6 py-4 text-right text-rose-400 font-bold">{formatCurrency(row.total)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {!loading && filteredData.length > 0 && (
                            <tfoot className="bg-slate-800/80 border-t-2 border-slate-700">
                                <tr>
                                    <td className="px-6 py-4 font-bold text-slate-200 uppercase tracking-wider text-xs">Grand Total</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-200">{formatCurrency(totals.current)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-200">{formatCurrency(totals.days_30)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-200">{formatCurrency(totals.days_60)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-orange-400">{formatCurrency(totals.days_90)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-red-400">{formatCurrency(totals.older)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-rose-500">{formatCurrency(totals.total)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgedPayables;
