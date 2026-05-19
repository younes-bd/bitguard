import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Shield, Trash2, Edit, Loader2, Key, Layers, ChevronRight } from 'lucide-react';
import { iamService } from '../../../../core/api/iamService';
import RoleEditor from './RoleEditor';
import { toast } from 'react-hot-toast';

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const data = await iamService.getRoles();
            // Handle both array and {roles: []} response
            setRoles(data.roles || data || []);
        } catch (error) {
            console.error("Failed to load roles", error);
            toast.error("Security Fault: Failed to load privilege registry");
        } finally {
            setLoading(false);
        }
    };

    const [editingRole, setEditingRole] = useState(null);

    const handleCreate = () => setEditingRole({});
    const handleEdit = (role) => setEditingRole(role);
    const handleClose = () => setEditingRole(null);
    const handleSave = () => {
        handleClose();
        loadRoles();
    };

    const filteredRoles = roles.filter(r => r.name?.toLowerCase().includes(search.toLowerCase()));

    if (loading) {
        return (
            <div className="py-24 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Synchronizing Permission Matrix...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Key size={32} className="text-purple-500" />
                        Privilege Registry
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Define and manage role-based access control (RBAC) across the platform.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search security classes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20"
                    >
                        <Plus size={20} />
                        Define Class
                    </button>
                </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredRoles.map(role => (
                    <div key={role.id} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 hover:border-purple-500/30 transition-all group relative overflow-hidden backdrop-blur-xl">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            <button 
                                onClick={() => handleEdit(role)} 
                                className="p-3 text-slate-400 hover:text-white bg-slate-800 rounded-2xl border border-slate-700 hover:border-purple-500/50 shadow-xl"
                            >
                                <Edit size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-500">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{role.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Layers size={10} className="text-slate-600" />
                                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
                                            {role.parent ? 'Derived Class' : 'Root Class'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Capability Matrix</span>
                                    <span className="text-sm font-bold text-white font-mono">{role.permissions?.length || 0} Vectors</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000" 
                                        style={{ width: `${Math.min(100, (role.permissions?.length || 0) * 10)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] font-mono text-slate-700 uppercase tracking-tighter">ID: {role.id.substring(0, 8)}</span>
                                <button 
                                    onClick={() => handleEdit(role)} 
                                    className="flex items-center gap-2 text-xs font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-all group/btn"
                                >
                                    Modify Access
                                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Editor Modal */}
            {editingRole && (
                <RoleEditor
                    role={editingRole.id ? editingRole : null}
                    onSave={handleSave}
                    onCancel={handleClose}
                />
            )}
        </div>
    );
};

export default RoleList;

