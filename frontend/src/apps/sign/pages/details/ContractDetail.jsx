import React, { useState, useEffect } from 'react';
import { FileText, Calendar, DollarSign, Building2, Download, Printer, CheckCircle, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import signService from '../../api/signService';
import { toast } from 'react-hot-toast';

export default function ContractDetail() {
    const { id } = useParams();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const data = await signService.getContract(id);
                setContract(data);
            } catch (error) {
                console.error("Failed to load contract", error);
                toast.error("Failed to load contract details");
            } finally {
                setLoading(false);
            }
        };
        fetchContract();
    }, [id]);

    if (loading) return <div className="p-8 text-slate-400 text-center">Loading contract details...</div>;
    if (!contract) return <div className="p-8 text-slate-400 text-center">Contract not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <FileText className="text-amber-500" /> Contract #{contract.id}
                        </h1>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase rounded border border-emerald-500/20">
                            {contract.status}
                        </span>
                    </div>
                    <p className="text-xl text-slate-300 font-bold">{contract.contract_type?.replace('_', ' ').toUpperCase() || 'Managed Services'}</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                        <Printer size={18} /> Print
                    </button>
                    <button 
                        onClick={async () => {
                            try {
                                const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
                                await reportingService.generateReport(null, 'contracts.ServiceContract', id);
                                toast.success('Document downloaded');
                            } catch (e) {
                                toast.error('Failed to download document');
                            }
                        }}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                    >
                        <Download size={18} /> Download PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Contract Details</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client</label>
                                <div className="text-white font-bold mt-1 flex items-center gap-2">
                                    <Building2 size={16} className="text-slate-400"/> {contract.client_name || contract.client}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SLA Tier</label>
                                <div className="text-white font-bold mt-1">{contract.sla_tier_name || contract.sla_tier || 'Standard'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                                <div className="text-white font-bold mt-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400"/> {contract.start_date || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                                <div className="text-white font-bold mt-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400"/> {contract.end_date || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Terms & Conditions</h2>
                        <div className="text-slate-300 text-sm whitespace-pre-line">
                            {contract.terms || "No special terms defined for this contract."}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Financials</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contract Value</label>
                                <div className="text-3xl font-black text-emerald-400 mt-1 flex items-center gap-1">
                                    <DollarSign size={24}/> {parseFloat(contract.value || 0).toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Billing Frequency</label>
                                <div className="text-white font-bold mt-1 flex items-center gap-2">
                                    <Clock size={16} className="text-slate-400"/> {contract.billing_cycle || 'Monthly'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

