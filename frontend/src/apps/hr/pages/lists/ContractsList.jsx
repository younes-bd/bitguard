import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Filter, FileText } from 'lucide-react';
import { hrmService } from '../../../../core/api/hrmService';

const ContractsList = () => {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                // Fetch contracts from hrmService
                const res = await hrmService.api.get('/contracts/');
                setContracts(res.data?.results || res.data || []);
            } catch (error) {
                console.error("Failed to fetch contracts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContracts();
    }, []);

    const getStatusBadge = (status) => {
        const styles = {
            draft: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
            open: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
            expired: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
            cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        };
        return (
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.draft}`}>
                {status || 'Draft'}
            </span>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/hrm')} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase">
                            Employee Contracts
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Manage employment agreements and wages</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-bold text-sm">
                    <Plus size={16} />
                    New Contract
                </button>
            </div>

            {/* List */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-700/50 flex flex-wrap gap-4 items-center justify-between bg-slate-800/30">
                    <div className="relative flex-1 min-w-[250px] max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search contracts..." 
                            className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50 text-sm font-medium">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/20">
                            <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                <th className="p-5 border-b border-slate-700/50">Employee</th>
                                <th className="p-5 border-b border-slate-700/50">Contract Type</th>
                                <th className="p-5 border-b border-slate-700/50">Start Date</th>
                                <th className="p-5 border-b border-slate-700/50 text-right">Wage</th>
                                <th className="p-5 border-b border-slate-700/50 text-center">Status</th>
                                <th className="p-5 border-b border-slate-700/50"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : contracts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        <FileText size={48} className="mx-auto text-slate-600 mb-4 opacity-50" />
                                        <p>No contracts found.</p>
                                    </td>
                                </tr>
                            ) : (
                                contracts.map((contract) => (
                                    <tr key={contract.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                                        <td className="p-5">
                                            <div className="font-bold text-white">{contract.employee_name || `Employee #${contract.employee}`}</div>
                                            <div className="text-xs text-slate-400">{contract.job_position_name || 'No Position'}</div>
                                        </td>
                                        <td className="p-5 text-sm text-slate-300 capitalize">{contract.contract_type?.replace('_', ' ')}</td>
                                        <td className="p-5 text-sm text-slate-400">{contract.start_date}</td>
                                        <td className="p-5 text-right font-mono text-slate-200">
                                            ${Number(contract.wage).toLocaleString()}
                                        </td>
                                        <td className="p-5 text-center">
                                            {getStatusBadge(contract.status)}
                                        </td>
                                        <td className="p-5 text-right">
                                            <button className="text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-wider transition-colors">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContractsList;
