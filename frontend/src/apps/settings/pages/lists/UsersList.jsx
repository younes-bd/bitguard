import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, MoreVertical, Plus, Shield, CheckCircle2, Lock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import client from '../../../../core/api/client';
import toast from 'react-hot-toast';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    // Modals state
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);

    // Forms state
    const [inviteForm, setInviteForm] = useState({ email: '', first_name: '', last_name: '', password: '', is_active: true, role: '' });
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', is_active: true, role: '' });

    useEffect(() => {
        fetchUsers('/iam/');
        fetchRoles();
    }, []);

    const fetchUsers = async (url) => {
        try {
            setLoading(true);
            const res = await client.get(url);
            const data = res.data;
            if (data?.results) {
                // DRF paginated response
                setUsers(data.results);
                setNextPageUrl(data.next);
                setPrevPageUrl(data.previous);
                setTotalCount(data.count);
            } else if (Array.isArray(data?.data)) {
                // standard_response with flat array: { success, message, data: [...] }
                setUsers(data.data);
            } else if (data?.users) {
                setUsers(data.users);
            } else if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await client.get('/iam/roles/');
            // standard_response returns { success, message, data: [...array...] }
            const d = res.data;
            let arr = [];
            if (Array.isArray(d)) arr = d;
            else if (d && Array.isArray(d.data)) arr = d.data;
            else if (d && Array.isArray(d.results)) arr = d.results;
            else if (d && Array.isArray(d.roles)) arr = d.roles;
            setRoles(arr);
        } catch (error) {

            console.error("Failed to fetch roles", error);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await client.post('/iam/', inviteForm);
            setIsInviteOpen(false);
            fetchUsers('/iam/');
            toast.success('User invited successfully!');
        } catch (error) {
            console.error('Invite failed', error);
            toast.error(error?.response?.data?.message || 'Failed to invite user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await client.patch(`/iam/${selectedUser.id}/`, editForm);
            setIsEditOpen(false);
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
        } catch (error) {
            console.error("Edit failed", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleLockToggle = async (user) => {
        try {
            const endpoint = user.is_locked ? `/iam/${user.id}/unlock/` : `/iam/${user.id}/lock/`;
            await client.post(endpoint);
            setUsers(users.map(u => u.id === user.id ? { ...u, is_locked: !user.is_locked } : u));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Lock toggle failed", error);
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Are you sure you want to delete user ${user.email}?`)) return;
        try {
            await client.delete(`/iam/${user.id}/`);
            setUsers(users.filter(u => u.id !== user.id));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const openEdit = (user) => {
        setSelectedUser(user);
        setEditForm({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            is_active: user.is_active,
            role: user.role || ''
        });
        setIsEditOpen(true);
        setOpenMenuId(null);
    };

    const safeUsers = Array.isArray(users) ? users : [];
    const filteredUsers = safeUsers.filter(user => 
        (user?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (user?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Users className="text-blue-500" size={32} />
                        Enterprise Users
                    </h1>
                    <p className="text-slate-400 mt-1">Manage global system access, identities, and roles across all tenants.</p>
                </div>
                <button 
                    onClick={() => {
                        setInviteForm({ email: '', first_name: '', last_name: '', password: '', is_active: true, role: roles[0]?.id || '' });
                        setIsInviteOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-colors font-bold shadow-lg shadow-blue-900/20"
                >
                    <Plus size={18} />
                    <span>Invite User</span>
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-visible">
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold border-b border-slate-800">User Identity</th>
                                <th className="p-4 font-bold border-b border-slate-800">Role</th>
                                <th className="p-4 font-bold border-b border-slate-800">Status</th>
                                <th className="p-4 font-bold border-b border-slate-800">Last Login</th>
                                <th className="p-4 font-bold border-b border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                                                    {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        {user.first_name} {user.last_name}
                                                        {user.is_superuser && <Shield size={12} className="text-amber-500" title="Superuser" />}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-700 shadow-sm">
                                                {user.role ? (roles.find(r => r.id === user.role)?.name || user.role) : (user.is_superuser ? 'Admin' : 'User')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {user.is_locked ? (
                                                <span className="flex items-center gap-1.5 text-rose-500 text-xs font-bold bg-rose-500/10 w-fit px-2.5 py-1 rounded-md border border-rose-500/20">
                                                    <Lock size={12} /> Locked
                                                </span>
                                            ) : user.is_active ? (
                                                <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold bg-emerald-500/10 w-fit px-2.5 py-1 rounded-md border border-emerald-500/20">
                                                    <CheckCircle2 size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-800 w-fit px-2.5 py-1 rounded-md border border-slate-700">
                                                    <XCircle size={12} /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">
                                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="p-4 text-right relative">
                                            <button 
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700 opacity-100"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {openMenuId === user.id && (
                                                <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 w-36 overflow-hidden flex flex-col text-left">
                                                    <button onClick={() => openEdit(user)} className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left">Edit</button>
                                                    <button onClick={() => handleLockToggle(user)} className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left">
                                                        {user.is_locked ? 'Unlock' : 'Lock'}
                                                    </button>
                                                    <button onClick={() => handleDelete(user)} className="px-4 py-2 text-sm text-red-400 hover:bg-slate-700 text-left border-t border-slate-700">Delete</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {(nextPageUrl || prevPageUrl) && (
                    <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Total {totalCount} users
                        </div>
                        <div className="flex gap-2">
                            <button 
                                disabled={!prevPageUrl}
                                onClick={() => fetchUsers(prevPageUrl)}
                                className="p-2 rounded-lg bg-slate-800 text-white disabled:opacity-50"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button 
                                disabled={!nextPageUrl}
                                onClick={() => fetchUsers(nextPageUrl)}
                                className="p-2 rounded-lg bg-slate-800 text-white disabled:opacity-50"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {isInviteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Invite User</h2>
                            <button onClick={() => setIsInviteOpen(false)} className="text-slate-500 hover:text-white"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email *</label>
                                <input required type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">First Name</label>
                                    <input type="text" value={inviteForm.first_name} onChange={e => setInviteForm({...inviteForm, first_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Last Name</label>
                                    <input type="text" value={inviteForm.last_name} onChange={e => setInviteForm({...inviteForm, last_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Temporary Password *</label>
                                <input required type="text" value={inviteForm.password} onChange={e => setInviteForm({...inviteForm, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Role</label>
                                <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none">
                                    <option value="">Select a role...</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsInviteOpen(false)} className="px-4 py-2 bg-slate-800 text-white rounded-lg">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Invite</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Slide-over (simulated as modal for simplicity, but could be slide-over) */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border-l border-slate-700 h-full w-full max-w-md shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Edit User</h2>
                            <button onClick={() => setIsEditOpen(false)} className="text-slate-500 hover:text-white"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleEdit} className="p-6 space-y-4 flex-1 overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">First Name</label>
                                <input type="text" value={editForm.first_name} onChange={e => setEditForm({...editForm, first_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Last Name</label>
                                <input type="text" value={editForm.last_name} onChange={e => setEditForm({...editForm, last_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Role</label>
                                <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none">
                                    <option value="">Select a role...</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <input type="checkbox" id="is_active" checked={editForm.is_active} onChange={e => setEditForm({...editForm, is_active: e.target.checked})} className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-950" />
                                <label htmlFor="is_active" className="text-sm font-medium text-slate-300">User is active</label>
                            </div>
                        </form>
                        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-slate-800 text-white rounded-lg">Cancel</button>
                            <button onClick={handleEdit} disabled={actionLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersList;
