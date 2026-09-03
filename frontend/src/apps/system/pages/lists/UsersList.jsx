import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, MoreVertical, Plus, Shield, CheckCircle2, Lock, XCircle, ChevronLeft, ChevronRight, LayoutGrid, List as ListIcon } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [viewMode, setViewMode] = useState('list');
    const [userTypeFilter, setUserTypeFilter] = useState('internal');
    const [roleFilter, setRoleFilter] = useState('');
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    
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
    const [inviteForm, setInviteForm] = useState({ email: '', first_name: '', last_name: '', role: '' });
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', is_active: true, role: '' });

    useEffect(() => {
        fetchUsers(getFetchUrl());
        fetchRoles();
    }, [userTypeFilter, roleFilter]);

    const getFetchUrl = () => {
        let params = [];
        let base = 'users/';
        if (userTypeFilter === 'archived') {
            params.push('is_active=false');
        } else if (userTypeFilter === 'pending') {
            base = 'users/invitations/';
        } else {
            params.push(`user_type=${userTypeFilter}`);
        }
        if (roleFilter) params.push(`role_id=${roleFilter}`);
        return params.length > 0 ? `${base}?${params.join('&')}` : base;
    };

    const fetchUsers = async (url) => {
        try {
            setLoading(true);
            const res = await client.get(url);
            const data = res.data;
            if (data?.results) {
                setUsers(data.results);
                setNextPageUrl(data.next);
                setPrevPageUrl(data.previous);
                setTotalCount(data.count);
            } else if (Array.isArray(data?.data)) {
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
            const res = await client.get('users/roles/');
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
            await client.post('users/invite/', inviteForm);
            setIsInviteOpen(false);
            fetchUsers(getFetchUrl());
            toast.success('User invited successfully! Email sent.');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to invite user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await client.patch(`users/${selectedUser.id}/`, editForm);
            setIsEditOpen(false);
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
            toast.success('User updated');
        } catch (error) {
            toast.error('Edit failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleLockToggle = async (user) => {
        try {
            const endpoint = user.is_locked ? `users/${user.id}/unlock/` : `users/${user.id}/lock/`;
            await client.post(endpoint);
            setUsers(users.map(u => u.id === user.id ? { ...u, is_locked: !user.is_locked } : u));
            setOpenMenuId(null);
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Are you sure you want to delete user ${user.email}?`)) return;
        try {
            if (userTypeFilter === 'pending') {
                await client.delete(`users/invitations/${user.id}/`);
            } else {
                await client.delete(`users/${user.id}/`);
            }
            setUsers(users.filter(u => u.id !== user.id));
            setOpenMenuId(null);
            toast.success(userTypeFilter === 'pending' ? 'Invitation revoked' : 'User deleted');
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleArchive = async (user) => {
        try {
            await client.patch(`users/${user.id}/`, { is_active: false });
            setUsers(users.map(u => u.id === user.id ? { ...u, is_active: false } : u));
            setOpenMenuId(null);
            toast.success('User archived');
        } catch (error) {
            toast.error('Archive failed');
        }
    };

    const handleSendResetPassword = async (user) => {
        try {
            if (userTypeFilter === 'pending') {
                await client.post(`users/invitations/${user.id}/resend/`);
                toast.success('Invitation resent');
            } else {
                await client.post(`users/${user.id}/reset_password/`);
                toast.success('Reset password email sent');
            }
            setOpenMenuId(null);
        } catch (error) {
            toast.error(userTypeFilter === 'pending' ? 'Failed to resend invitation' : 'Failed to send reset email');
        }
    };

    const handleBulkAction = async (e) => {
        const action = e.target.value;
        if (!action || selectedUsers.size === 0) return;
        
        try {
            const userIds = Array.from(selectedUsers);
            for (const id of userIds) {
                if (action === 'activate') await client.patch(`users/${id}/`, { is_active: true });
                if (action === 'deactivate' || action === 'archive') await client.patch(`users/${id}/`, { is_active: false });
                if (action === 'reset_password') {
                    if (userTypeFilter === 'pending') {
                        await client.post(`users/invitations/${id}/resend/`);
                    } else {
                        await client.post(`users/${id}/reset_password/`);
                    }
                }
            }
            fetchUsers(getFetchUrl());
            setSelectedUsers(new Set());
            toast.success('Bulk action completed');
        } catch (error) {
            toast.error('Bulk action encountered errors');
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

    const toggleSelectUser = (id) => {
        const newSet = new Set(selectedUsers);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedUsers(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedUsers.size === filteredUsers.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
        }
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
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                            <ListIcon size={18} />
                        </button>
                        <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                    <button 
                        onClick={() => {
                            setInviteForm({ email: '', first_name: '', last_name: '', role: roles[0]?.id || '' });
                            setIsInviteOpen(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-colors font-bold shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={18} />
                        <span>Invite User</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
                {['internal', 'portal', 'public', 'pending', 'archived'].map(type => (
                    <button
                        key={type}
                        onClick={() => setUserTypeFilter(type)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-colors whitespace-nowrap ${userTypeFilter === type ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
                    >
                        {type === 'pending' ? 'Pending Invitations' : `${type} Users`}
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-visible">
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96 flex items-center gap-2">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search users by name or email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
                            />
                        </div>
                        <select
                            className="bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    
                    {selectedUsers.size > 0 && (
                        <select onChange={handleBulkAction} value="" className="bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 text-sm">
                            <option value="">Bulk Actions ({selectedUsers.size})</option>
                            <option value="activate">Activate</option>
                            <option value="deactivate">Deactivate</option>
                            <option value="archive">Archive</option>
                            <option value="reset_password">{userTypeFilter === 'pending' ? 'Resend Invitations' : 'Send Reset Password Email'}</option>
                        </select>
                    )}
                </div>

                {viewMode === 'list' ? (
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 w-12 border-b border-slate-800">
                                        <input type="checkbox" onChange={toggleSelectAll} checked={filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length} className="w-4 h-4 rounded border-slate-700 bg-slate-900" />
                                    </th>
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
                                        <td colSpan="6" className="p-8 text-center text-slate-500">Loading users...</td>
                                    </tr>
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                                            <td className="p-4">
                                                <input type="checkbox" checked={selectedUsers.has(user.id)} onChange={() => toggleSelectUser(user.id)} className="w-4 h-4 rounded border-slate-700 bg-slate-900" />
                                            </td>
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
                                                    <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 w-48 overflow-hidden flex flex-col text-left">
                                                        <button onClick={() => openEdit(user)} className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left">Edit</button>
                                                        <button onClick={() => handleLockToggle(user)} className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left">
                                                            {user.is_locked ? 'Unlock' : 'Lock'}
                                                        </button>
                                                        <button onClick={() => handleSendResetPassword(user)} className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left">{userTypeFilter === 'pending' ? 'Resend Invitation' : 'Reset Password Email'}</button>
                                                        <button onClick={() => handleArchive(user)} className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left border-t border-slate-700">Archive (Set Inactive)</button>
                                                        <button onClick={() => handleDelete(user)} className="px-4 py-2 text-sm text-red-400 hover:bg-slate-700 text-left border-t border-slate-700">Hard Delete</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-0">
                                            {(() => {
                                                let message = "No users found.";
                                                let submessage = "Try adjusting your search or filters.";
                                                if (userTypeFilter === 'internal') {
                                                    message = "No internal users found.";
                                                    submessage = "Internal users have access to the backend systems.";
                                                } else if (userTypeFilter === 'portal') {
                                                    message = "No portal users found.";
                                                    submessage = "Portal users are customers or vendors with limited access.";
                                                } else if (userTypeFilter === 'public') {
                                                    message = "No public users found.";
                                                    submessage = "Public users are website visitors or guests.";
                                                } else if (userTypeFilter === 'archived') {
                                                    message = "No archived users.";
                                                    submessage = "Deactivated or archived users will appear here.";
                                                } else if (userTypeFilter === 'pending') {
                                                    message = "No pending invitations sent yet.";
                                                    submessage = "Invite new users to join your organization.";
                                                }
                                                return (
                                                    <div className="flex flex-col items-center justify-center p-16 text-center">
                                                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
                                                            <Users className="text-slate-400" size={32} />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-white mb-2">{message}</h3>
                                                        <p className="text-slate-400 mb-6 text-sm">{submessage}</p>
                                                        <button 
                                                            onClick={() => {
                                                                setInviteForm({ email: '', first_name: '', last_name: '', role: roles[0]?.id || '' });
                                                                setIsInviteOpen(true);
                                                            }}
                                                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl transition-colors font-bold border border-slate-700 hover:border-slate-600"
                                                        >
                                                            <Plus size={18} />
                                                            <span>Invite User</span>
                                                        </button>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[300px]">
                        {loading ? (
                            <div className="col-span-full p-8 text-center text-slate-500">Loading users...</div>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <div key={user.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center relative hover:border-slate-700 transition-colors">
                                    <div className="absolute top-4 left-4">
                                        <input type="checkbox" checked={selectedUsers.has(user.id)} onChange={() => toggleSelectUser(user.id)} className="w-4 h-4 rounded border-slate-700 bg-slate-900" />
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-slate-800">
                                            <MoreVertical size={16} />
                                        </button>
                                        {openMenuId === user.id && (
                                            <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 w-48 overflow-hidden flex flex-col text-left">
                                                <button onClick={() => openEdit(user)} className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left">Edit</button>
                                                <button onClick={() => handleSendResetPassword(user)} className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left">{userTypeFilter === 'pending' ? 'Resend Invitation' : 'Reset Password Email'}</button>
                                                <button onClick={() => handleArchive(user)} className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left">Archive</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
                                        {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1 justify-center">
                                        {user.first_name} {user.last_name}
                                        {user.is_superuser && <Shield size={12} className="text-amber-500" />}
                                    </h3>
                                    <p className="text-xs text-slate-500 mb-3 truncate w-full" title={user.email}>{user.email}</p>
                                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-700 mb-4 inline-block">
                                        {user.role ? (roles.find(r => r.id === user.role)?.name || user.role) : (user.is_superuser ? 'Admin' : 'User')}
                                    </span>
                                    <div className="mt-auto w-full pt-4 border-t border-slate-800/50 flex justify-between items-center text-xs">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            {user.is_active ? <CheckCircle2 size={12} className="text-emerald-500"/> : <XCircle size={12} className="text-slate-500" />}
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                        <span className="text-slate-500">
                                            Login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : '-'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full">
                                {(() => {
                                    let message = "No users found.";
                                    let submessage = "Try adjusting your search or filters.";
                                    if (userTypeFilter === 'internal') {
                                        message = "No internal users found.";
                                        submessage = "Internal users have access to the backend systems.";
                                    } else if (userTypeFilter === 'portal') {
                                        message = "No portal users found.";
                                        submessage = "Portal users are customers or vendors with limited access.";
                                    } else if (userTypeFilter === 'public') {
                                        message = "No public users found.";
                                        submessage = "Public users are website visitors or guests.";
                                    } else if (userTypeFilter === 'archived') {
                                        message = "No archived users.";
                                        submessage = "Deactivated or archived users will appear here.";
                                    } else if (userTypeFilter === 'pending') {
                                        message = "No pending invitations sent yet.";
                                        submessage = "Invite new users to join your organization.";
                                    }
                                    return (
                                        <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-800/60 rounded-2xl bg-slate-900/20">
                                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
                                                <Users className="text-slate-400" size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2">{message}</h3>
                                            <p className="text-slate-400 mb-6 text-sm max-w-sm">{submessage}</p>
                                            <button 
                                                onClick={() => {
                                                    setInviteForm({ email: '', first_name: '', last_name: '', role: roles[0]?.id || '' });
                                                    setIsInviteOpen(true);
                                                }}
                                                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl transition-colors font-bold border border-slate-700 hover:border-slate-600 shadow-xl shadow-black/20"
                                            >
                                                <Plus size={18} />
                                                <span>Invite User</span>
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}
                
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
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Role</label>
                                <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none">
                                    <option value="">Select a role...</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsInviteOpen(false)} className="px-4 py-2 bg-slate-800 text-white rounded-lg">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Send Invite</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Slide-over */}
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
