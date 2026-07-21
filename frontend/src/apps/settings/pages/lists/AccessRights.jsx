import React, { useState, useEffect, useMemo } from 'react';
import { Key, Search, Layers, Loader2 } from 'lucide-react';
import client from '../../../../core/api/client';
import toast from 'react-hot-toast';

export default function AccessRights() {
    const [roles, setRoles] = useState([]);
    const [contentTypes, setContentTypes] = useState({});
    const [matrix, setMatrix] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRoleId, setActiveRoleId] = useState(null);
    const [saving, setSaving] = useState({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [rolesRes, ctRes, matrixRes] = await Promise.all([
                    client.get('iam/roles/'),
                    client.get('iam/content-types/'),
                    client.get('iam/role-permissions/matrix/')
                ]);
                
                let fetchedRoles = [];
                if (Array.isArray(rolesRes.data)) fetchedRoles = rolesRes.data;
                else if (rolesRes.data && Array.isArray(rolesRes.data.data)) fetchedRoles = rolesRes.data.data;
                else if (rolesRes.data && rolesRes.data.data && Array.isArray(rolesRes.data.data.roles)) fetchedRoles = rolesRes.data.data.roles;
                else if (rolesRes.data && Array.isArray(rolesRes.data.results)) fetchedRoles = rolesRes.data.results;

                let fetchedCT = {};
                if (ctRes.data && ctRes.data.data) fetchedCT = ctRes.data.data;
                else if (ctRes.data && typeof ctRes.data === 'object') fetchedCT = ctRes.data;

                let fetchedMatrix = {};
                if (matrixRes.data && matrixRes.data.data) fetchedMatrix = matrixRes.data.data;

                setRoles(fetchedRoles);
                setContentTypes(fetchedCT);
                setMatrix(fetchedMatrix);
                
                if (fetchedRoles.length > 0) {
                    setActiveRoleId(fetchedRoles[0].id);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load access rights data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const togglePermission = async (roleId, ctId, permType, currentVal) => {
        const newVal = !currentVal;
        const cellKey = `${roleId}-${ctId}-${permType}`;
        
        // Optimistic update
        setMatrix(prev => {
            const roleData = prev[roleId] || { permissions: {} };
            const ctData = roleData.permissions[ctId] || { can_read: false, can_write: false, can_create: false, can_delete: false };
            return {
                ...prev,
                [roleId]: {
                    ...roleData,
                    permissions: {
                        ...roleData.permissions,
                        [ctId]: { ...ctData, [permType]: newVal }
                    }
                }
            };
        });
        
        setSaving(p => ({ ...p, [cellKey]: true }));
        try {
            // we should actually find the role-permission ID, but if it doesn't exist we create it.
            // Let's do a post/patch to a custom endpoint or we handle it via the matrix if it was a simpler API.
            // For now, we will assume we have an endpoint that accepts a role, content_type and the flags.
            // Since we need to manage the RolePermission model, let's POST to /iam/role-permissions/ 
            // The backend should handle update-or-create logic. 
            // Wait, standard DRF doesn't do update-or-create on POST unless we wrote it that way.
            // Let's just fetch all role-permissions, but wait, the matrix returns only data, not IDs.
            // If the matrix endpoint returns permissions without the `id` of the RolePermission record, we might need a generic update endpoint or we'll assume the backend handles POST as an upsert.
            // Let's use a standard list fetch to get IDs or assume the backend is smart.
            
            // Actually, we can fetch `GET /iam/role-permissions/?role=X&content_type=Y`
            const existingRes = await client.get(`iam/role-permissions/?role=${roleId}&content_type=${ctId}`);
            let existing = null;
            if (existingRes.data && Array.isArray(existingRes.data.data) && existingRes.data.data.length > 0) {
                existing = existingRes.data.data[0];
            } else if (Array.isArray(existingRes.data) && existingRes.data.length > 0) {
                existing = existingRes.data[0];
            }
            
            const payload = {
                role: roleId,
                content_type: ctId,
                can_read: permType === 'can_read' ? newVal : (matrix[String(roleId)]?.permissions[ctId]?.can_read || false),
                can_write: permType === 'can_write' ? newVal : (matrix[String(roleId)]?.permissions[ctId]?.can_write || false),
                can_create: permType === 'can_create' ? newVal : (matrix[String(roleId)]?.permissions[ctId]?.can_create || false),
                can_delete: permType === 'can_delete' ? newVal : (matrix[String(roleId)]?.permissions[ctId]?.can_delete || false)
            };

            if (existing) {
                await client.patch(`iam/role-permissions/${existing.id}/`, payload);
            } else {
                await client.post(`iam/role-permissions/`, payload);
            }
        } catch (err) {
            toast.error('Failed to update permission');
            // Revert optimistic update
            setMatrix(prev => {
                const roleData = prev[roleId] || { permissions: {} };
                const ctData = roleData.permissions[ctId] || { can_read: false, can_write: false, can_create: false, can_delete: false };
                return {
                    ...prev,
                    [roleId]: {
                        ...roleData,
                        permissions: {
                            ...roleData.permissions,
                            [ctId]: { ...ctData, [permType]: currentVal }
                        }
                    }
                };
            });
        } finally {
            setSaving(p => ({ ...p, [cellKey]: false }));
        }
    };

    const activeRole = roles.find(r => r.id === activeRoleId);

    // Filter content types based on search
    const filteredGroups = useMemo(() => {
        if (!searchTerm) return contentTypes;
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = {};
        for (const [app, models] of Object.entries(contentTypes)) {
            const matches = models.filter(m => m.label.toLowerCase().includes(lowerSearch) || app.toLowerCase().includes(lowerSearch));
            if (matches.length > 0) {
                filtered[app] = matches;
            }
        }
        return filtered;
    }, [contentTypes, searchTerm]);

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <Key className="text-slate-400" /> Access Rights Matrix
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Manage row-level and object-level permissions across all modules</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Loading permission matrix...</p>
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
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search models or apps..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500" 
                            />
                        </div>
                        <div className="text-sm text-slate-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                            Auto-saves changes
                        </div>
                    </div>

                    {/* Matrix Grid */}
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="text-xs uppercase bg-slate-950/80 text-slate-500 sticky top-0 z-10 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-3 font-semibold border-b border-slate-800">Module / Object</th>
                                    <th className="px-4 py-3 font-semibold text-center border-b border-slate-800 w-24">Read</th>
                                    <th className="px-4 py-3 font-semibold text-center border-b border-slate-800 w-24">Write</th>
                                    <th className="px-4 py-3 font-semibold text-center border-b border-slate-800 w-24">Create</th>
                                    <th className="px-4 py-3 font-semibold text-center border-b border-slate-800 w-24">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {Object.entries(filteredGroups).length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            No matching models found.
                                        </td>
                                    </tr>
                                ) : (
                                    Object.entries(filteredGroups).map(([appLabel, models]) => (
                                        <React.Fragment key={appLabel}>
                                            <tr className="bg-slate-800/30">
                                                <td colSpan="5" className="px-6 py-2 text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                                    <Layers size={14} className="text-blue-500" />
                                                    {appLabel}
                                                </td>
                                            </tr>
                                            {models.map(model => {
                                                const rolePerms = matrix[String(activeRoleId)]?.permissions?.[model.id] || {};
                                                return (
                                                    <tr key={model.id} className="hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-6 py-3 font-medium text-slate-300 pl-10">
                                                            {model.label}
                                                            <span className="text-xs text-slate-500 ml-2 font-mono hidden sm:inline-block">({model.model})</span>
                                                        </td>
                                                        {['can_read', 'can_write', 'can_create', 'can_delete'].map(perm => {
                                                            const isChecked = rolePerms[perm] || false;
                                                            const isSaving = saving[`${activeRoleId}-${model.id}-${perm}`];
                                                            return (
                                                                <td key={perm} className="px-4 py-3 text-center">
                                                                    <div className="flex justify-center items-center">
                                                                        {isSaving ? (
                                                                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                                                        ) : (
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isChecked}
                                                                                onChange={() => togglePermission(activeRoleId, model.id, perm, isChecked)}
                                                                                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900 cursor-pointer"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
