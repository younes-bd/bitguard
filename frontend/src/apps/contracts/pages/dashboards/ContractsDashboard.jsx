import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import contractsService from '../../../../core/api/contractsService';
import { toast } from 'react-hot-toast';

export default function ContractsDashboard() {
    const [contracts, setContracts] = useState([]);
    const [breaches, setBreaches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [contractsData, breachesData] = await Promise.all([
                    contractsService.getContracts(),
                    contractsService.getSlaBreaches()
                ]);
                setContracts(Array.isArray(contractsData) ? contractsData : contractsData.results || []);
                setBreaches(Array.isArray(breachesData) ? breachesData : breachesData.results || []);
            } catch (error) {
                console.error("Failed to load contracts dashboard data", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const activeContracts = contracts.filter(c => c.status === 'active');
    const totalMRR = activeContracts.reduce((sum, c) => sum + parseFloat(c.value || 0), 0);
    // Simple mock logic for renewal rate based on active vs total
    const renewalRate = contracts.length > 0 ? Math.round((activeContracts.length / contracts.length) * 100) : 0;
    
    // Contracts expiring soon (naive 30 days check based on end_date)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringContracts = activeContracts.filter(c => {
        if (!c.end_date) return false;
        const endDate = new Date(c.end_date);
        return endDate <= thirtyDaysFromNow && endDate >= new Date();
    });

    if (loading) {
        return <div className="text-slate-400 p-8 flex justify-center items-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="text-amber-500" /> Contracts & SLAs
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Overview of managed service contracts, recurring revenue, and SLA performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                            <FileText size={24} />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm font-bold uppercase">Active Contracts</div>
                            <div className="text-2xl font-bold text-white mt-1">{activeContracts.length}</div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm font-bold uppercase">Contract MRR</div>
                            <div className="text-2xl font-bold text-emerald-400 mt-1">${(totalMRR / 1000).toFixed(1)}k</div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm font-bold uppercase">Renewal Rate</div>
                            <div className="text-2xl font-bold text-white mt-1">{renewalRate}%</div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm font-bold uppercase">SLA Breaches</div>
                            <div className="text-2xl font-bold text-rose-400 mt-1">{breaches.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Expiring Contracts (Next 30 Days)</h2>
                    <div className="space-y-4">
                        {expiringContracts.length === 0 ? (
                            <div className="text-slate-400 italic">No contracts expiring soon.</div>
                        ) : expiringContracts.map(contract => (
                            <div key={contract.id} className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-lg">
                                <div>
                                    <h3 className="font-bold text-white">{contract.client_name || contract.client} - {contract.contract_type}</h3>
                                    <p className="text-sm text-slate-400">Expires: {contract.end_date}</p>
                                </div>
                                <button className="px-3 py-1 bg-slate-800 text-amber-400 text-xs font-bold rounded-lg border border-slate-700">Needs Renewal</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Recent SLA Breaches</h2>
                    <div className="space-y-4">
                        {breaches.length === 0 ? (
                            <div className="text-slate-400 italic">No recent SLA breaches.</div>
                        ) : breaches.map(breach => (
                            <div key={breach.id} className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-lg">
                                <div className="flex gap-3">
                                    <ShieldCheck className="text-rose-500 mt-1" size={20} />
                                    <div>
                                        <h3 className="font-bold text-white">Ticket #{breach.ticket || 'Unknown'} - {breach.metric}</h3>
                                        <p className="text-sm text-slate-400">Breached: {breach.breach_time}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-500">{breach.acknowledged ? 'Acknowledged' : 'New'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
