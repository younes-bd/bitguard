import React, { useState, useEffect } from 'react';
import { Users, Loader2, Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, ShieldCheck, Lock, Unlock, Key } from 'lucide-react';
import { iamService } from '../../../../core/api/iamService';
import { toast } from 'react-hot-toast';

const ROLE_COLORS = {
    super_admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    tenant_admin: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    user: 'bg-slate-800 text-slate-300 border-slate-700',
};

import UserEditor from './UserEditor';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await iamService.getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load users:", err);
            setUsers([]);
            toast.error("Security Fault: Failed to load principal archive");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleLock = async (user) => {
        try {
            if (user.is_locked) {
                await iamService.unlockUser(user.id);
                toast.success(`Account ${user.email} unlocked`);
            } else {
                await iamService.lockUser(user.id);
                toast.error(`Account ${user.email} locked`);
            }
            fetchUsers();
        } catch (e) {
            toast.error("Failed to update account lock status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently purge this principal from the system? This action is irreversible.")) return;
        try {
            await iamService.deleteUser(id);
            toast.success("Principal successfully purged");
            fetchUsers();
        } catch (e) {
            toast.error("Failed to purge user");
        }
    };

    const handleCreate = () => setEditingUser({});
    const handleEdit = (user) => setEditingUser(user);
    const handleClose = () => setEditingUser(null);
    const handleSave = () => {
        handleClose();
        fetchUsers();
    };

    const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()));
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in backdrop-blur-xl">
            <div className="p-8 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Identity Principals</h2>
                        <p className="text-slate-500 text-sm mt-0.5">{filteredUsers.length} active security objects</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by email or username..." 
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                    <button 
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} /> Add Principal
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-24 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                    <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Decrypting User Records...</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800/50 text-slate-500 bg-slate-900/30">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Security Principal</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Access Role</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-center">MFA Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-center">Lock Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {paginatedUsers.length > 0 ? paginatedUsers.map(u => {
                                    // Handle cases where roles might be objects or names
                                    const primaryRole = u.roles?.[0]?.name || 'User';
                                    const roleStr = primaryRole.toLowerCase().replace(' ', '_');
                                    const roleStyle = ROLE_COLORS[roleStr] || ROLE_COLORS.user;
                                    
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-800/20 group transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-blue-400">
                                                        {u.email[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-semibold text-sm">{u.email}</span>
                                                        <span className="text-slate-500 text-[11px] font-mono">{u.id.substring(0, 8)}...</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${roleStyle}`}>
                                                    {primaryRole}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                {u.mfa_enabled ? (
                                                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 bg-emerald-400/10 w-fit mx-auto px-2 py-1 rounded-lg border border-emerald-400/20">
                                                        <ShieldCheck size={12} />
                                                        <span className="text-[10px] font-black uppercase">Active</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-600 text-[10px] font-black uppercase">Disabled</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                {u.is_locked ? (
                                                    <div className="flex items-center justify-center gap-1.5 text-rose-400 bg-rose-400/10 w-fit mx-auto px-2 py-1 rounded-lg border border-rose-400/20 animate-pulse">
                                                        <Lock size={12} />
                                                        <span className="text-[10px] font-black uppercase">Locked</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 bg-emerald-400/10 w-fit mx-auto px-2 py-1 rounded-lg border border-emerald-400/20">
                                                        <Unlock size={12} />
                                                        <span className="text-[10px] font-black uppercase">Open</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <button 
                                                        onClick={() => handleLock(u)}
                                                        className={`p-2 rounded-xl transition-all ${u.is_locked ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500'} hover:text-white`} 
                                                        title={u.is_locked ? 'Unlock Account' : 'Lock Account'}
                                                    >
                                                        {u.is_locked ? <Unlock size={16} /> : <Lock size={16} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(u)}
                                                        className="p-2 bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all" 
                                                        title="Security Profile"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-2 bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all" 
                                                        title="Purge Principal"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan="5" className="text-center py-20 text-slate-500 font-sans">No matching security principals located.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-8 py-6 border-t border-slate-800 flex justify-between items-center bg-slate-900/30">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identity Page {page} of {totalPages}</span>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-xl bg-slate-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-600 transition-all border border-slate-700">
                                    <ChevronLeft size={18} />
                                </button>
                                <button 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-xl bg-slate-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-600 transition-all border border-slate-700">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Editor Modal */}
            {editingUser && (
                <UserEditor
                    user={editingUser.id ? editingUser : null}
                    onSave={handleSave}
                    onCancel={handleClose}
                />
            )}
        </div>
    );
};

export default UserList;
