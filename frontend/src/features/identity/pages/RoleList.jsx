import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Shield, Trash2, Edit } from 'lucide-react';
import { iamService } from '../../../shared/core/services/iamService';
import RoleEditor from './RoleEditor';

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const data = await iamService.getRoles();
            setRoles(data);
        } catch (error) {
            console.error("Failed to load roles", error);
        } finally {
            setLoading(false);
        }
    };

    // State for Editor
    const [editingRole, setEditingRole] = useState(null); // null = hidden, {} = create, {id...} = edit

    const handleCreate = () => setEditingRole({});
    const handleEdit = (role) => setEditingRole(role);
    const handleClose = () => setEditingRole(null);
    const handleSave = () => {
        handleClose();
        loadRoles();
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search roles..."
                        className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                >
                    <Plus size={18} />
                    Create Role
                </button>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(role)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"><Edit size={16} /></button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Custom Role</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm text-slate-400 flex justify-between">
                                <span>Members</span>
                                <span className="text-white font-medium">0</span>
                            </div>
                            <div className="text-sm text-slate-400 flex justify-between">
                                <span>Permissions</span>
                                <span className="text-white font-medium">{role.permissions?.length || 0}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-xs text-slate-600">ID: {role.id}</span>
                            <button onClick={() => handleEdit(role)} className="text-sm text-blue-400 hover:text-blue-300 font-medium">Manage Access &rarr;</button>
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
