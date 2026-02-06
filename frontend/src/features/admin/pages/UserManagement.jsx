import React, { useState, useEffect } from 'react';
import {
    Users, Search, UserPlus, MoreVertical, Shield,
    CheckCircle, XCircle
} from 'lucide-react';

const UserManagement = () => {
    // Mock Data (Replace with client.get('/users'))
    const [users, setUsers] = useState([
        { id: 1, name: 'Admin User', email: 'admin@bitguard.com', role: 'Super Admin', status: 'Active', avatar: null },
        { id: 2, name: 'John Doe', email: 'john@store.com', role: 'Store Manager', status: 'Active', avatar: null },
        { id: 3, name: 'Jane Smith', email: 'jane@crm.com', role: 'Sales Agent', status: 'Inactive', avatar: null },
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-slate-400">Manage system access and roles across the platform.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                    <UserPlus size={18} />
                    <span>Add User</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500/50"
                    />
                </div>
                {/* Add Role/Status filters here later */}
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Role</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{user.name}</div>
                                            <div className="text-slate-500 text-sm">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="flex items-center gap-2 text-slate-300 bg-slate-800/80 px-2 py-1 rounded-md text-sm w-fit">
                                        <Shield size={14} className="text-blue-400" />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {user.status === 'Active' ? (
                                        <span className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                                            <CheckCircle size={14} /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                            <XCircle size={14} /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
