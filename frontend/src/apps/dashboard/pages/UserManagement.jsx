import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon, Search, UserPlus, MoreVertical, Shield,
    CheckCircle, XCircle, Loader2, AlertCircle
} from 'lucide-react';
import client from '../../../core/api/client';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await client.get('users/');
                const data = response.data.data.results ? response.data.data.results : (response.data.data.users ? response.data.data.users : response.data.data);
                const mappedUsers = data.map(u => ({
                    id: u.id,
                    name: (u.first_name || u.last_name) ? `${u.first_name} ${u.last_name}`.trim() : (u.email ? u.email.split('@')[0] : 'Unknown'),
                    email: u.email,
                    role: u.is_staff ? 'Super Admin' : (u.role || 'User'),
                    status: u.is_active ? 'Active' : 'Inactive',
                    avatar: u.avatar || null
                }));
                setUsers(mappedUsers);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setError("Failed to load users from the server.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500/50"
                    />
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 mb-6">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-500 font-medium">{error}</p>
                </div>
            )}

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
                        {loading && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                    Loading users...
                                </td>
                            </tr>
                        )}
                        {!loading && filteredUsers.length === 0 && !error && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                        {!loading && filteredUsers.map(user => (
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
