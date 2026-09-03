import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Search, Edit2, Trash2, X, Users, Key, ChevronRight, Loader2, UserPlus, CheckSquare, Square } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

const ROLE_DISPLAY = {
    SUPER_ADMIN:   { label: 'Super Admin',   color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    TENANT_ADMIN:  { label: 'Tenant Admin',  color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    MANAGER:       { label: 'Manager',       color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    HR_MANAGER:    { label: 'HR Manager',    color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    ACCOUNTANT:    { label: 'Accountant',    color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    SALES_MANAGER: { label: 'Sales Manager', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    SALESPERSON:   { label: 'Salesperson',   color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    WAREHOUSE_MANAGER: { label: 'Warehouse Mgr', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    EMPLOYEE:      { label: 'Employee',      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    CUSTOMER:      { label: 'Customer',      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    PORTAL_USER:   { label: 'Portal User',   color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
};

function extractList(res) {
    const d = res?.data;
    if (Array.isArray(d)) return d;
    if (d && Array.isArray(d.data)) return d.data;
    if (d && d.data && Array.isArray(d.data.roles)) return d.data.roles;
    if (d && Array.isArray(d.results)) return d.results;
    if (d && Array.isArray(d.roles)) return d.roles;
    return [];
}

const EMPTY_FORM = { name: '', description: '', parent: '' };

export default function UserGroups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [selected, setSelected] = useState(null);
    const [activeTab, setActiveTab] = useState('users');

    // Users and Assignment State
    const [roleUsers, setRoleUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState(new Set());
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await client.get('users/roles/');
            setGroups(extractList(res));
        } catch (err) {
            toast.error('Failed to load groups');
            setGroups([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGroups(); }, []);

    const fetchRoleUsers = async (roleId) => {
        setLoadingUsers(true);
        try {
            const res = await client.get(`users/roles/${roleId}/users/`);
            setRoleUsers(extractList(res));
        } catch (err) {
            setRoleUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (selected) {
            fetchRoleUsers(selected.id);
            setActiveTab('users');
        } else {
            setRoleUsers([]);
        }
    }, [selected]);

    const openCreate = () => { setEditingGroup(null); setForm(EMPTY_FORM); setIsModalOpen(true); };
    const openEdit = (g) => { setEditingGroup(g); setForm({ name: g.name, description: g.description || '', parent: g.parent || '' }); setIsModalOpen(true); };

    const handleSave = async () => {
        if (!form.name) return toast.error('Name is required');
        setSaving(true);
        try {
            const payload = { ...form, parent: form.parent || null };
            if (editingGroup?.id) {
                await client.patch(`users/roles/${editingGroup.id}/`, payload);
                toast.success('Group updated');
                if (selected?.id === editingGroup.id) {
                    setSelected(prev => ({ ...prev, ...payload }));
                }
            } else {
                await client.post('users/roles/', payload);
                toast.success('Group created');
            }
            setIsModalOpen(false);
            fetchGroups();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save group');
        } finally { setSaving(false); }
    };

    const handleDelete = async (group) => {
        if (!window.confirm(`Delete group "${group.name}"? Users in this group will lose associated permissions.`)) return;
        try {
            await client.delete(`users/roles/${group.id}/`);
            toast.success('Group deleted');
            if (selected?.id === group.id) setSelected(null);
            fetchGroups();
        } catch { toast.error('Failed to delete group'); }
    };

    const openAssignUsers = async () => {
        setIsAssignModalOpen(true);
        try {
            const res = await client.get('users/'); // Fetch all users
            const users = extractList(res);
            setAllUsers(users);
            // Pre-select users already in the role
            setSelectedUserIds(new Set(roleUsers.map(u => u.id)));
        } catch (err) {
            toast.error('Failed to load users');
        }
    };

    const handleAssignUsers = async () => {
        if (!selected) return;
        setSaving(true);
        try {
            await client.post(`users/roles/${selected.id}/assign_users/`, {
                user_ids: Array.from(selectedUserIds)
            });
            toast.success('Users assigned successfully');
            setIsAssignModalOpen(false);
            fetchRoleUsers(selected.id);
            fetchGroups(); // Refresh count
        } catch (err) {
            toast.error('Failed to assign users');
        } finally {
            setSaving(false);
        }
    };

    const toggleUserSelection = (id) => {
        setSelectedUserIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const safe = Array.isArray(groups) ? groups : [];
    const filtered = safe.filter(g => (g.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        || (g.description || '').toLowerCase().includes(searchTerm.toLowerCase()));

    const filteredAllUsers = allUsers.filter(u => 
        (u.first_name || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (u.last_name || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <ShieldCheck className="text-blue-400" /> User Groups
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage roles and access groups â€” {safe.length} group{safe.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                    <Plus size={16} /> New Group
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* List panel */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Search groups..." value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
                            <Loader2 size={20} className="animate-spin" /> Loading groupsâ€¦
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-16 text-center text-slate-500">
                            <ShieldCheck size={40} className="mx-auto mb-3 opacity-20" />
                            <p className="font-semibold">No groups found</p>
                            <p className="text-xs mt-1 text-slate-600">Create a group to manage user permissions.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800/60">
                            {filtered.map(group => {
                                const badge = ROLE_DISPLAY[group.name] || { label: group.name, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
                                const parentGroup = groups.find(g => g.id === group.parent);
                                
                                return (
                                    <div key={group.id}
                                        onClick={() => setSelected(selected?.id === group.id ? null : group)}
                                        className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors group ${selected?.id === group.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : 'hover:bg-slate-800/40'}`}>
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${badge.color}`}>
                                                <ShieldCheck size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-200 text-sm">{badge.label}</span>
                                                    {!ROLE_DISPLAY[group.name] && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border text-slate-300 bg-slate-700/50 border-slate-600`}>Custom</span>}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-xs text-slate-500 truncate">{group.description || 'No description'}</p>
                                                    {parentGroup && (
                                                        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 rounded-md border border-blue-500/20">
                                                            Inherits: {parentGroup.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Users size={11} /> <span>{group.user_count ?? 0} users</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={e => { e.stopPropagation(); openEdit(group); }}
                                                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors">
                                                    <Edit2 size={13} />
                                                </button>
                                                <button onClick={e => { e.stopPropagation(); handleDelete(group); }}
                                                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors">
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                            <ChevronRight size={14} className={`text-slate-600 transition-transform ${selected?.id === group.id ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Detail panel */}
                {selected ? (
                    <div className="w-full lg:w-96 shrink-0 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col self-start sticky top-4 max-h-[80vh]">
                        <div className="p-5 border-b border-slate-800 bg-slate-900">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-white text-lg">{ROLE_DISPLAY[selected.name]?.label || selected.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{selected.description || 'No description set'}</p>
                                </div>
                                <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-slate-400"><X size={20} /></button>
                            </div>
                            
                            <div className="flex gap-4 mt-6 border-b border-slate-800">
                                <button 
                                    onClick={() => setActiveTab('users')}
                                    className={`px-1 py-2 text-sm font-semibold border-b-2 ${activeTab === 'users' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                                >
                                    Users ({selected.user_count ?? roleUsers.length})
                                </button>
                                <button 
                                    onClick={() => setActiveTab('details')}
                                    className={`px-1 py-2 text-sm font-semibold border-b-2 ${activeTab === 'details' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-5 flex-1 overflow-y-auto min-h-[200px]">
                            {activeTab === 'users' && (
                                <div className="space-y-4">
                                    <button 
                                        onClick={openAssignUsers}
                                        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <UserPlus size={16} /> Assign Users
                                    </button>
                                    
                                    {loadingUsers ? (
                                        <div className="flex items-center justify-center py-10 text-slate-500">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        </div>
                                    ) : roleUsers.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500 text-sm">
                                            No users assigned to this group yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {roleUsers.map(user => (
                                                <div key={user.id} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0">
                                                        {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-slate-200 truncate">
                                                            {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
                                                        </p>
                                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {activeTab === 'details' && (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Group Key</p>
                                        <p className="text-slate-300 font-mono bg-slate-950 px-3 py-2 rounded-md border border-slate-800">{selected.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Inherits From</p>
                                        {selected.parent ? (
                                            <p className="text-slate-300">{groups.find(g => g.id === selected.parent)?.name || 'Unknown'}</p>
                                        ) : (
                                            <p className="text-slate-500 italic">None</p>
                                        )}
                                    </div>
                                    <button onClick={() => openEdit(selected)}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 mt-4 rounded-lg transition-colors">
                                        Edit Group Settings
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full lg:w-96 shrink-0 bg-slate-900/50 border border-slate-800 border-dashed rounded-xl flex items-center justify-center text-slate-500 min-h-[300px]">
                        Select a group to view details
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">{editingGroup ? 'Edit Group' : 'New Group'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Group Key (Unique Name)</label>
                                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value.toUpperCase().replace(/\s+/g, '_') }))}
                                    placeholder="e.g. MARKETING_MGR"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono" />
                                <p className="text-xs text-slate-500 mt-1">Stored as uppercase with underscores.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
                                    placeholder="Describe what this group can do..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Inherits Permissions From (Optional)</label>
                                <select value={form.parent} onChange={e => setForm(p => ({ ...p, parent: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                    <option value="">-- No Parent (Root Level) --</option>
                                    {groups.filter(g => g.id !== editingGroup?.id).map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                            <button onClick={handleSave} disabled={saving}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                                {saving ? 'Savingâ€¦' : 'Save Group'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Users Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold text-white">Assign Users</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Role: {selected?.name}</p>
                            </div>
                            <button onClick={() => setIsAssignModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="p-4 border-b border-slate-800 bg-slate-900">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="text" placeholder="Search by name or email..." value={userSearchTerm}
                                    onChange={e => setUserSearchTerm(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {filteredAllUsers.map(user => {
                                const isChecked = selectedUserIds.has(user.id);
                                return (
                                    <div key={user.id} 
                                        onClick={() => toggleUserSelection(user.id)}
                                        className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors">
                                        <div className="text-blue-500 shrink-0">
                                            {isChecked ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-600" />}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0">
                                            {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-200 truncate">
                                                {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredAllUsers.length === 0 && (
                                <div className="p-10 text-center text-slate-500">
                                    No users found matching "{userSearchTerm}"
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
                            <span className="text-sm text-slate-400">
                                <strong className="text-white">{selectedUserIds.size}</strong> selected
                            </span>
                            <div className="flex gap-3">
                                <button onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                                <button onClick={handleAssignUsers} disabled={saving}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                                    {saving ? 'Savingâ€¦' : 'Save Assignments'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
