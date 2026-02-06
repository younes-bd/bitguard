import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Check, X, Shield, Lock } from 'lucide-react';
import { iamService } from '../../../shared/core/services/iamService';

const RoleEditor = ({ role, onSave, onCancel }) => {
    const [name, setName] = useState(role ? role.name : '');
    const [allPermissions, setAllPermissions] = useState([]);
    const [selectedPerms, setSelectedPerms] = useState(new Set(role ? role.permissions : []));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPermissions();
    }, []);

    const loadPermissions = async () => {
        try {
            const perms = await iamService.getPermissions();
            setAllPermissions(perms);
        } catch (error) {
            console.error(error);
        }
    };

    const togglePermission = (permCode) => {
        const next = new Set(selectedPerms);
        if (next.has(permCode)) {
            next.delete(permCode);
        } else {
            next.add(permCode);
        }
        setSelectedPerms(next);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const roleData = { name, permissions: Array.from(selectedPerms) };
            if (role) {
                await iamService.updateRole(role.id, roleData);
            } else {
                await iamService.createRole(roleData);
            }
            onSave();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Group permissions by product/category
    const groupedPerms = allPermissions.reduce((acc, perm) => {
        const prod = perm.product || 'General';
        if (!acc[prod]) acc[prod] = [];
        acc[prod].push(perm);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield className="text-blue-500" size={24} />
                            {role ? 'Edit Role' : 'Create New Role'}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Define access levels and permissions.</p>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-white"><X size={24} /></button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Role Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Role Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. Sales Manager"
                        />
                    </div>

                    {/* Permissions Matrix */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                            <Lock size={16} /> Permissions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(groupedPerms).map(([category, perms]) => (
                                <div key={category} className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">{category}</h4>
                                    <div className="space-y-2">
                                        {perms.map(p => {
                                            const isSelected = selectedPerms.has(p.code);
                                            return (
                                                <label key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-colors group">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-600 bg-transparent group-hover:border-slate-500'}`}>
                                                        {isSelected && <Check size={12} strokeWidth={4} />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={isSelected}
                                                        onChange={() => togglePermission(p.code)}
                                                    />
                                                    <div>
                                                        <p className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-400'}`}>{p.name}</p>
                                                        <p className="text-xs text-slate-500">{p.description}</p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
                    <button onClick={onCancel} className="px-5 py-2 text-slate-400 hover:text-white font-medium transition-colors">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={loading || !name}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Saving...' : 'Save Role'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleEditor;
