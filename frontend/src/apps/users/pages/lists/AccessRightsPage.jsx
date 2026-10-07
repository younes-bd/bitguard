import React, { useState, useEffect, useMemo } from 'react';
import { Key, Search, Layers, Loader2, Plus, Trash2, ShieldCheck, X } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';
import { usersService } from '../../api/usersService';
import { useNavigate } from 'react-router-dom';

export default function AccessRightsPage() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [contentTypes, setContentTypes] = useState({});
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRoleId, setActiveRoleId] = useState(null);
    const [saving, setSaving] = useState({});
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalForm, setModalForm] = useState({ content_type: '', can_read: false, can_write: false, can_create: false, can_delete: false });

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [rolesRes, ctRes] = await Promise.all([
                    usersService.getRoles(),
                    usersService.getContentTypes()
                ]);
                
                let fetchedRoles = Array.isArray(rolesRes) ? rolesRes : [];
                let fetchedCT = ctRes && typeof ctRes === 'object' ? ctRes : {};

                setRoles(fetchedRoles);
                setContentTypes(fetchedCT);
                
                if (fetchedRoles.length > 0) {
                    setActiveRoleId(fetchedRoles[0].id);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load initial data');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (activeRoleId) {
            loadPermissions(activeRoleId);
        }
    }, [activeRoleId]);

    const loadPermissions = async (roleId) => {
        try {
            const res = await usersService.getRolePermissions({ role: roleId });
            setPermissions(Array.isArray(res) ? res : res.results || []);
        } catch (err) {
            toast.error('Failed to load role permissions');
        }
    };

    const handleToggle = async (permId, permType, currentVal) => {
        const newVal = !currentVal;
        
        // Optimistic update
        setPermissions(prev => prev.map(p => p.id === permId ? { ...p, [permType]: newVal } : p));
        setSaving(p => ({ ...p, [permId]: true }));
        
        try {
            await usersService.updateRolePermission(permId, { [permType]: newVal });
        } catch (err) {
            toast.error('Failed to update permission');
            // Revert
            setPermissions(prev => prev.map(p => p.id === permId ? { ...p, [permType]: currentVal } : p));
        } finally {
            setSaving(p => ({ ...p, [permId]: false }));
        }
    };

    const handleDelete = async (permId) => {
        if (!confirm('Are you sure you want to remove this permission?')) return;
        try {
            await client.delete(`users/role-permissions/${permId}/`);
            setPermissions(prev => prev.filter(p => p.id !== permId));
            toast.success('Permission removed');
        } catch (err) {
            toast.error('Failed to delete permission');
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!modalForm.content_type) return toast.error('Please select a model');
        
        try {
            const payload = {
                role: activeRoleId,
                ...modalForm
            };
            const res = await usersService.createRolePermission(payload);
            setPermissions([...permissions, res]);
            setIsModalOpen(false);
            setModalForm({ content_type: '', can_read: false, can_write: false, can_create: false, can_delete: false });
            toast.success('Permission added successfully');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to add permission');
        }
    };

    const flatModels = useMemo(() => {
        const arr = [];
        Object.entries(contentTypes).forEach(([app, models]) => {
            models.forEach(m => arr.push({ ...m, appLabel: app }));
        });
        return arr.sort((a, b) => (a.app_label || "").localeCompare(b.app_label || "") || (a.label || "").localeCompare(b.label || ""));
    }, [contentTypes]);

    const filteredPermissions = permissions.filter(p => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return (p.model_name && p.model_name.toLowerCase().includes(s)) || 
               (p.app_label && p.app_label.toLowerCase().includes(s));
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wide flex items-center gap-2">
                        <ShieldCheck className="text-blue-500" />
                        Access Rights
                    </h1>
                    <p className="text-slate-400 mt-1">Configure explicit Model Permissions for each User Group.</p>
                </div>
                {!loading && (
                    roles.length === 0 ? (
                        <button 
                            onClick={() => navigate('/admin/settings/groups')}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <Plus size={16} /> Create User Group
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <Plus size={16} /> Add Permission
                        </button>
                    )
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Loading access rights...</p>
                </div>
            ) : roles.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
                    <p>No roles found. Please configure user groups first.</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[500px]">
                    {/* Role Tabs */}
                    <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/50 hide-scrollbar">
                        {roles.map(role => (
                            <button
                                key={role.id}
                                onClick={() => setActiveRoleId(role.id)}
                                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                                    activeRoleId === role.id 
                                    ? 'border-blue-500 text-blue-400 bg-slate-900' 
                                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-900/50'
                                }`}
                            >
                                {role.name}
                            </button>
                        ))}
                    </div>

                    {/* Search & Actions */}
                    <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center gap-4">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                type="text"
                                placeholder="Search models or apps..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Permissions Grid */}
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="text-xs uppercase bg-slate-950/80 text-slate-500 sticky top-0 z-10 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-3 font-semibold border-b border-slate-800">Module / Object</th>
                                    <th className="px-4 py-3 font-semibold text-center border-b border-slate-800 w-24">Read</th>
                                    <th className="px-4 py-3 font-semibold text-center border-b border-slate-800 w-24">Write</th>
                                    <th className="px-4 py-3 font-semibold text-center border-b border-slate-800 w-24">Create</th>
                                    <th className="px-4 py-3 font-semibold text-center border-b border-slate-800 w-24">Delete</th>
                                    <th className="px-4 py-3 font-semibold text-right border-b border-slate-800 w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredPermissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            No explicit permissions added for this role yet. Click "Add Permission" to start.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPermissions.map(perm => (
                                        <tr key={perm.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-slate-300 flex items-center gap-2">
                                                <Layers size={14} className="text-blue-500" />
                                                <span className="uppercase text-xs font-bold text-slate-400 mr-2">{perm.app_label}</span>
                                                {perm.model_name}
                                            </td>
                                            {['can_read', 'can_write', 'can_create', 'can_delete'].map(permType => (
                                                <td key={permType} className="px-4 py-3 text-center">
                                                    <div className="flex justify-center items-center">
                                                        {saving[perm.id] ? (
                                                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                                        ) : (
                                                            <input
                                                                type="checkbox"
                                                                checked={perm[permType]}
                                                                onChange={() => handleToggle(perm.id, permType, perm[permType])}
                                                                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900 cursor-pointer"
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 text-right">
                                                <button 
                                                    onClick={() => handleDelete(perm.id)}
                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Permission Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                            <h3 className="text-lg font-semibold text-white">Add Explicit Permission</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Model (Object)</label>
                                <select 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
                                    value={modalForm.content_type}
                                    onChange={e => setModalForm({...modalForm, content_type: e.target.value})}
                                    required
                                >
                                    <option value="">-- Select a Model --</option>
                                    {flatModels.map(m => (
                                        <option key={m.id} value={m.id}>{m.app_label} | {m.label} ({m.model})</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {['read', 'write', 'create', 'delete'].map(p => (
                                    <label key={p} className="flex items-center gap-3 p-3 border border-slate-800 rounded-lg bg-slate-950/50 cursor-pointer hover:border-blue-500/50 transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={modalForm[`can_${p}`]}
                                            onChange={e => setModalForm({...modalForm, [`can_${p}`]: e.target.checked})}
                                            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900 cursor-pointer"
                                        />
                                        <span className="text-sm font-medium text-slate-300 capitalize">{p}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-800 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
                                    Save Permission
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
