import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Check, X, Shield, Lock, ChevronRight, Info, Layers, Loader2 } from 'lucide-react';
import { iamService } from '../../../../core/api/iamService';
import { toast } from 'react-hot-toast';

const RoleEditor = ({ role, onSave, onCancel }) => {
    const [name, setName] = useState(role ? role.name : '');
    const [description, setDescription] = useState(role ? role.description : '');
    const [parentId, setParentId] = useState(role ? role.parent : '');
    const [allPermissions, setAllPermissions] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedPerms, setSelectedPerms] = useState(new Set(role ? role.permissions : []));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [perms, rolesData] = await Promise.all([
                iamService.getPermissions(),
                iamService.getRoles()
            ]);
            setAllPermissions(perms);
            
            // Extract roles list correctly from standardized response
            const rolesList = rolesData.roles || rolesData || [];
            setAvailableRoles(rolesList.filter(r => r.id !== (role?.id)));
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dependency data");
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
        if (!name.trim()) {
            toast.error("Role name is required");
            return;
        }
        setLoading(true);
        try {
            const roleData = { 
                name, 
                description,
                parent: parentId || null,
                permissions: Array.from(selectedPerms) 
            };
            if (role) {
                await iamService.updateRole(role.id, roleData);
                toast.success("Security Role Synchronized");
            } else {
                await iamService.createRole(roleData);
                toast.success("New Principal Class Established");
            }
            onSave();
        } catch (error) {
            console.error(error);
            toast.error("Protocol Error: Failed to commit role changes");
        } finally {
            setLoading(false);
        }
    };

    const groupedPerms = allPermissions.reduce((acc, perm) => {
        const prod = perm.product || 'General';
        if (!acc[prod]) acc[prod] = [];
        acc[prod].push(perm);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-t-purple-500/20">
                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-purple-500/10 text-purple-400 rounded-3xl">
                            <Shield size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                {role ? 'Modify Principal Authority' : 'Define Security Class'}
                            </h2>
                            <p className="text-slate-500 text-sm mt-0.5 font-mono uppercase tracking-widest text-[10px]">RBAC Configuration Module v2.0</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-10 py-8 space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Role Designation</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all font-bold placeholder:text-slate-800"
                                    placeholder="e.g. SYSTEM_AUDITOR"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Authority Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-sm placeholder:text-slate-800 resize-none"
                                    placeholder="Describe the scope of this role's access..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Layers size={12} className="text-purple-400" /> Inheritance Root
                                </label>
                                <select
                                    value={parentId}
                                    onChange={(e) => setParentId(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-sm appearance-none cursor-pointer"
                                >
                                    <option value="">No Inheritance (Root Role)</option>
                                    {availableRoles.map(r => (
                                        <option key={r.id} value={r.id}>Inherit from {r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-slate-950/50 border border-slate-800 rounded-[2rem] p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Info size={16} className="text-purple-400" />
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Policy Guidance</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Roles should follow the <span className="text-purple-400">Principle of Least Privilege (PoLP)</span>. 
                                Only assign permissions strictly necessary for the intended job function. 
                                Inheritance allows this role to automatically acquire all permissions from its parent.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-widest">
                            <Lock size={18} className="text-purple-500" /> Capability Matrix
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Object.entries(groupedPerms).map(([category, perms]) => (
                                <div key={category} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-4">
                                    <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2">{category} Vectors</h4>
                                    <div className="space-y-1">
                                        {perms.map(p => {
                                            const isSelected = selectedPerms.has(p.code);
                                            return (
                                                <label key={p.id} className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${isSelected ? 'bg-purple-500/10 border-purple-500/30' : 'hover:bg-slate-800/50 border-transparent'} group`}>
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-800 bg-slate-950 group-hover:border-slate-700'}`}>
                                                        {isSelected && <Check size={14} strokeWidth={4} />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={isSelected}
                                                        onChange={() => togglePermission(p.code)}
                                                    />
                                                    <div className="flex-1">
                                                        <p className={`text-xs font-bold transition-colors uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-500'}`}>{p.name}</p>
                                                        <p className="text-[10px] text-slate-600 mt-0.5 line-clamp-1">{p.description}</p>
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
                <div className="px-10 py-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-5">
                    <button onClick={onCancel} className="px-8 py-3 text-slate-400 hover:text-white font-bold text-sm transition-all">Discard Changes</button>
                    <button
                        onClick={handleSave}
                        disabled={loading || !name}
                        className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-purple-900/20 disabled:opacity-50 transition-all flex items-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Shield size={18} />}
                        Commit Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleEditor;

