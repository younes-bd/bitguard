import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Building2, Mail, Phone, ChevronRight } from 'lucide-react';
import hrmService from '../../../core/api/hrmService';

const statusBadge = (status) => {
    const map = { active: 'bg-emerald-500/10 text-emerald-400', inactive: 'bg-slate-700 text-slate-400', on_leave: 'bg-amber-500/10 text-amber-400' };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status?.replace('_', ' ') ?? 'Unknown'}</span>;
};

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        hrmService.getEmployees({ search }).then(d => {
            setEmployees(d?.results ?? d ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [search]);

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Employee Directory</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{employees.length} employees</p>
                </div>
                <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /><span>Add Employee</span>
                </button>
            </div>
            {/* Search */}
            <div className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email, department..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/40" />
            </div>
            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Employee', 'Department', 'Role', 'Email', 'Status', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="py-16 text-center text-slate-500">Loading employees...</td></tr>
                        ) : employees.length === 0 ? (
                            <tr><td colSpan={6} className="py-16 text-center text-slate-500">No employees found</td></tr>
                        ) : employees.map(emp => (
                            <tr key={emp.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-xs">
                                            {(emp.first_name?.[0] ?? emp.name?.[0] ?? '?').toUpperCase()}
                                        </div>
                                        <span className="text-white font-medium">{emp.first_name} {emp.last_name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-slate-300">{emp.department?.name ?? emp.department ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-400">{emp.job_title ?? emp.role ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-400">{emp.email ?? '—'}</td>
                                <td className="px-5 py-4">{statusBadge(emp.status)}</td>
                                <td className="px-5 py-4"><ChevronRight size={16} className="text-slate-600" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeList;
