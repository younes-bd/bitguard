import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Check, Loader2, Save, Key, Phone, Lock, Unlock } from 'lucide-react';
import { usersService } from '../../api/usersService';
import { toast } from 'react-hot-toast';

const UserEditor = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        email: user ? user.email : '',
        username: user ? user.username : '',
        first_name: user ? user.first_name : '',
        last_name: user ? user.last_name : '',
        phone_number: user ? user.phone_number : '',
        role_ids: user ? user.roles.map(r => r.id) : [],
        tenant_id: user?.tenant || '',
        contact_id: user?.contact_id || '',
        is_active: user ? user.is_active : true,
        password: '', // Only for new users
    });
    
    const [roles, setRoles] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingRoles, setFetchingRoles] = useState(true);

    useEffect(() => {
        loadRoles();
        loadTenants();
        loadContacts();
    }, []);

    const loadTenants = async () => {
        try {
            const data = await usersService.getTenants();
            setTenants(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load SaaS tenants");
        }
    };

    const loadContacts = async () => {
        try {
            const { crmService } = await import('../../../crm/api/crmService');
            const data = await crmService.getContacts();
            setContacts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load CRM contacts", error);
        }
    };

    const loadRoles = async () => {
        try {
            const data = await usersService.getRoles();
            setRoles(data.roles || data || []);
        } catch (error) {
            toast.error("Failed to load security roles");
        } finally {
            setFetchingRoles(false);
        }
    };

    const handleSave = async () => {
        if (!formData.email || !formData.username) {
            toast.error("Email and Username are mandatory");
            return;
        }

        if (!user && !formData.password) {
            toast.error("Password is required for new principals");
            return;
        }

        setLoading(true);
        try {
            if (user) {
                await usersService.updateUser(user.id, formData);
                toast.success("Security Principal Updated");
            } else {
                await usersService.createUser(formData);
                toast.success("New Principal Provisioned");
            }
            onSave();
        } catch (error) {
            console.error(error);
            toast.error("Protocol Error: Failed to commit changes");
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = (roleId) => {
        const nextRoles = formData.role_ids.includes(roleId)
            ? formData.role_ids.filter(id => id !== roleId)
            : [...formData.role_ids, roleId];
        setFormData({ ...formData, role_ids: nextRoles });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-t-blue-500/20">
                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-blue-500/10 text-blue-400 rounded-3xl">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                {user ? 'Modify Security Principal' : 'Provision New Identity'}
                            </h2>
                            <p className="text-slate-500 text-sm mt-0.5 font-mono uppercase tracking-widest text-[10px]">Identity Management Module v4.0</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-10 py-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-widest">
                                <Shield size={18} className="text-blue-500" /> Core Attributes
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">First Name</label>
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <Mail size={12} className="text-blue-400" /> Email Identity
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-bold"
                                        placeholder="principal@bitguard.net"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <User size={12} className="text-blue-400" /> Username
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <Phone size={12} className="text-blue-400" /> Phone Registry
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-bold font-mono"
                                        placeholder="+1 000 000 0000"
                                    />
                                </div>

                                {!user && (
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                            <Key size={12} className="text-rose-400" /> Initial Password
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all text-sm font-bold"
                                            placeholder="••••••••••••••••"
                                        />
                                    </div>
                                )}
                                
                                <div className="pt-4 border-t border-slate-800/50">
                                    <h4 className="text-xs font-bold text-white mb-4">Enterprise Assignment (Optional)</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Scenario A: SaaS Tenant (Workspace)</label>
                                            <select
                                                value={formData.tenant_id}
                                                onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-bold"
                                            >
                                                <option value="">-- No Tenant (Global Master) --</option>
                                                {tenants.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name} ({t.domain})</option>
                                                ))}
                                            </select>
                                            <p className="text-[10px] text-slate-500 mt-1">Assigns this user to a rented software workspace.</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Scenario B: Client Portal (CRM Link)</label>
                                            <select
                                                value={formData.contact_id}
                                                onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-bold"
                                            >
                                                <option value="">-- Not a Portal Client --</option>
                                                {contacts.map(c => (
                                                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.email})</option>
                                                ))}
                                            </select>
                                            <p className="text-[10px] text-slate-500 mt-1">Links this identity to a CRM Contact for portal access.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-widest">
                                <Lock size={18} className="text-blue-500" /> Access Privileges
                            </h3>
                            
                            <div className="bg-slate-950/50 border border-slate-800 rounded-[2rem] p-6 max-h-[400px] overflow-y-auto space-y-3">
                                {fetchingRoles ? (
                                    <div className="py-10 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                        <p className="text-slate-600 text-[10px] uppercase font-black">Loading Registry...</p>
                                    </div>
                                ) : roles.length > 0 ? roles.map(role => {
                                    const isSelected = formData.role_ids.includes(role.id);
                                    return (
                                        <div 
                                            key={role.id}
                                            onClick={() => toggleRole(role.id)}
                                            className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${isSelected ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-widest">{role.name}</span>
                                                <span className="text-[10px] text-slate-600 mt-0.5">{role.description || 'Generic access class'}</span>
                                            </div>
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-800 bg-slate-950'}`}>
                                                {isSelected && <Check size={14} strokeWidth={4} />}
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <p className="text-center py-10 text-slate-700 text-xs italic">No security roles found in registry.</p>
                                )}
                            </div>

                            <div className="bg-slate-950/50 border border-slate-800 rounded-[2rem] p-6 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Unlock size={14} className="text-emerald-500" /> Account Status
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">Active Enrollment</p>
                                        <p className="text-[10px] text-slate-600">Toggle if this principal can authenticate.</p>
                                    </div>
                                    <div 
                                        onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                        className={`relative inline-flex items-center h-6 w-12 rounded-full cursor-pointer transition-all ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-800'}`}
                                    >
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-all ${formData.is_active ? 'translate-x-7' : 'translate-x-1'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-10 py-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-5">
                    <button onClick={onCancel} className="px-8 py-3 text-slate-400 hover:text-white font-bold text-sm transition-all">Discard</button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 disabled:opacity-50 transition-all flex items-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        {user ? 'Update Principal' : 'Provision Identity'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserEditor;
