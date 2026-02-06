import React, { useEffect, useState } from 'react';
import { erpService } from '../../../shared/core/services/erpService';
import {
    Search, Filter, Mail, Phone, MapPin,
    Briefcase, MoreHorizontal, User, Shield
} from 'lucide-react';

const EmployeeDirectory = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const data = await erpService.getEmployees();
            setEmployees(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load workforce", error);
        } finally {
            setLoading(false);
        }
    };

    const departments = ['all', ...new Set(employees.map(e => e.department).filter(Boolean))];

    const filteredEmployees = employees.filter(e => {
        const matchesSearch = e.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = deptFilter === 'all' || e.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    // Stats
    const totalStaff = employees.length;
    const activeStaff = employees.filter(e => e.is_available).length;
    const engineeringCount = employees.filter(e => e.department === 'engineering').length;

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Workforce</h1>
                    <p className="text-slate-400">Manage your team properties and availability</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="text-2xl font-bold text-white">{totalStaff}</div>
                        <div className="text-xs text-slate-400 uppercase">Total Count</div>
                    </div>
                    <div className="text-right px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="text-2xl font-bold text-emerald-400">{activeStaff}</div>
                        <div className="text-xs text-slate-400 uppercase">Available</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or title..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {departments.map(dept => (
                        <button
                            key={dept}
                            onClick={() => setDeptFilter(dept)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${deptFilter === dept
                                    ? 'bg-blue-600 text-white border-blue-500'
                                    : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50'
                                }`}
                        >
                            {dept.charAt(0).toUpperCase() + dept.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="glass-panel p-6 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all group relative overflow-hidden">

                        {/* Status Dot */}
                        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${employee.is_available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'
                            }`}></div>

                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-4 text-3xl font-bold text-slate-500">
                                {employee.username.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {employee.username}
                            </h3>
                            <p className="text-sm text-slate-400 mb-2">{employee.job_title}</p>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-700 bg-slate-800/50 text-slate-300">
                                {employee.department}
                            </span>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Mail size={16} className="text-slate-500" />
                                <span className="truncate">{employee.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <MapPin size={16} className="text-slate-500" />
                                <span>{employee.location || 'Remote'}</span>
                            </div>

                            <div className="pt-2">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Workload</span>
                                    <span className={employee.current_load > 80 ? 'text-red-400' : 'text-emerald-400'}>
                                        {employee.current_load}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${employee.current_load > 80 ? 'bg-red-500' :
                                                employee.current_load > 50 ? 'bg-yellow-500' : 'bg-emerald-500'
                                            }`}
                                        style={{ width: `${employee.current_load}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-white transition-colors">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-400">No employees found matching your filters.</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeDirectory;


