import React, { useState, useEffect } from 'react';
import { Users, Loader2, Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import client from '../../../../core/api/client';

const ROLE_COLORS = {
    admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    manager: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    user: 'bg-slate-800 text-slate-300 border-slate-700',
};

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetchUsers = () => {
        setLoading(true);
        client.get('users/')
            .then(res => {
                let data = res.data.data;
                if (data && Array.isArray(data.results)) data = data.results;
                setUsers(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Failed to load users:", err);
                setUsers([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()));
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await client.delete(`users/${id}/`);
            fetchUsers();
        } catch (e) {
            alert('Failed to delete user');
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl text-white font-['Oswald'] uppercase flex items-center gap-2">
                        <Users className="text-blue-400" /> Identity Users
                    </h2>
                    <span className="text-slate-500 text-sm">{filteredUsers.length} Users</span>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search email..." 
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors">
                        <Plus size={16} /> Add User
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
                    Loading identities...
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="px-6 py-4 text-left font-semibold text-slate-400 uppercase tracking-wider text-xs">Email</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-400 uppercase tracking-wider text-xs">Role</th>
                                    <th className="px-6 py-4 text-left font-semibold text-slate-400 uppercase tracking-wider text-xs">Status</th>
                                    <th className="px-6 py-4 text-right font-semibold text-slate-400 uppercase tracking-wider text-xs">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {paginatedUsers.length > 0 ? paginatedUsers.map(u => {
                                    const roleStr = (u.role || 'user').toLowerCase();
                                    const roleStyle = ROLE_COLORS[roleStr] || ROLE_COLORS.user;
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-800/30 group transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${roleStyle}`}>
                                                    {roleStr}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">Active</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="Edit">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan="4" className="text-center py-8 text-slate-500">No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-1.5 rounded bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <button 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-1.5 rounded bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserList;
