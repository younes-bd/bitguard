import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Building2, Mail, Phone, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import hrmService from '../../../core/api/hrmService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';

const statusBadge = (status) => {
    const map = { active: 'bg-emerald-500/10 text-emerald-400', inactive: 'bg-slate-700 text-slate-400', on_leave: 'bg-amber-500/10 text-amber-400' };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status?.replace('_', ' ') ?? 'Unknown'}</span>;
};

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [empData, deptData] = await Promise.all([
                    hrmService.getEmployees({ search }),
                    hrmService.getDepartments ? hrmService.getDepartments().catch(() => []) : Promise.resolve([])
                ]);
                setEmployees(empData?.results ?? empData ?? []);
                setDepartments(deptData?.results ?? deptData ?? []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [search]);

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedEmployee) {
                await hrmService.updateEmployee(selectedEmployee.id, formData);
            } else {
                await hrmService.createEmployee(formData);
            }
            setIsModalOpen(false);
            const data = await hrmService.getEmployees();
            setEmployees(data?.results ?? data ?? []);
        } catch (error) {
            alert('Failed to save employee');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedEmployee) return;
        setActionLoading(true);
        try {
            await hrmService.deleteEmployee(selectedEmployee.id);
            setIsDeleteModalOpen(false);
            const data = await hrmService.getEmployees();
            setEmployees(data?.results ?? data ?? []);
        } catch (error) {
            alert('Failed to delete employee');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const EMPLOYEE_FIELDS = [
        { name: 'first_name', label: 'First Name', required: true },
        { name: 'last_name', label: 'Last Name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'department', label: 'Department', type: 'select', options: Array.isArray(departments) ? departments.map(d => ({ value: d.id, label: d.name })) : [] },
        { name: 'job_title', label: 'Job Title' },
        { name: 'salary', label: 'Salary', type: 'number', step: '1000' },
        { name: 'hire_date', label: 'Hire Date', type: 'date' },
        { name: 'status', label: 'Status', type: 'select', options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'on_leave', label: 'On Leave' }
        ], default: 'active' }
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Employee Directory</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{employees.length} employees</p>
                </div>
                <button onClick={() => { setSelectedEmployee(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
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
                            <tr key={emp.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group">
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
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); setIsModalOpen(true); }}
                                            className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); setIsDeleteModalOpen(true); }}
                                            className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <ChevronRight size={16} className="text-slate-600 ml-2" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Employee"
                fields={EMPLOYEE_FIELDS}
                initialData={selectedEmployee}
                onSubmit={handleSave}
                loading={actionLoading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Employee"
                message={`Are you sure you want to delete ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}?`}
                loading={actionLoading}
            />
        </div>
    );
};

export default EmployeeList;
