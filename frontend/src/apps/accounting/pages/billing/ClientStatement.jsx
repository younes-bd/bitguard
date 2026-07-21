import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, ArrowLeft, Download, Building2, Calendar, DollarSign, Activity } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { crmService } from '../../../../core/api/crmService';

const ClientStatement = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [statement, setStatement] = useState(null);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app we might fetch client details separately or they come with the statement
                const stmtData = await erpService.getClientStatement(clientId);
                setStatement(stmtData);
                // Fake client details for display if not fully populated in statement
                setClient({ id: clientId, name: stmtData?.client_name || 'Client', company: stmtData?.client_name || 'Company' });
            } catch (err) {
                console.error("Failed to load client statement", err);
            } finally {
                setLoading(false);
            }
        };
        if (clientId) fetchData();
    }, [clientId]);

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;
    if (!statement) return <div className="p-12 text-center text-slate-400">Statement not found.</div>;

    const { total_invoiced, total_paid, balance_due, history } = statement;

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <FileText className="text-blue-500" />
                            Client Statement
                        </h1>
                        <p className="text-sm text-slate-400">Financial history and outstanding balance.</p>
                    </div>
                </div>
                <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
                >
                    <Download size={18} />
                    <span>Export PDF</span>
                </button>
            </div>

            {/* Statement Head */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between gap-8 bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl font-bold text-blue-400">
                        {client?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{client?.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                            <Building2 size={14} />
                            {client?.company}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 max-w-2xl">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Invoiced</div>
                        <div className="text-2xl font-black text-white">${parseFloat(total_invoiced).toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Total Paid</div>
                        <div className="text-2xl font-black text-emerald-400">${parseFloat(total_paid).toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Balance Due</div>
                        <div className="text-2xl font-black text-red-400">${parseFloat(balance_due).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden mt-8">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
                    <Activity size={18} className="text-slate-400" />
                    <h3 className="text-lg font-bold text-white">Transaction History</h3>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-800">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Reference</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-right">Running Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                        {history?.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-slate-400">{row.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                                        row.type === 'invoice' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                                    }`}>
                                        {row.type.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-white">{row.reference}</td>
                                <td className={`px-6 py-4 text-right font-bold ${row.type === 'invoice' ? 'text-white' : 'text-emerald-400'}`}>
                                    {row.type === 'invoice' ? '' : '-'}${parseFloat(row.amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-white">
                                    ${parseFloat(row.running_balance).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {(!history || history.length === 0) && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                    No transaction history available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientStatement;
