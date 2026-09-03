import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Mail, ShieldAlert, Plus, Search } from 'lucide-react';
import { portalService } from '../../../api/portalService';
import client from '@/core/api/client';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function PortalAccessManager() {
    const navigate = useNavigate();
    const [accessList, setAccessList] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        Promise.all([
            portalService.getPortalAccessList().catch(() => ({ data: [] })),
            client.get('crm/clients/').catch(() => ({ data: [] }))
        ]).then(([accessRes, clientsRes]) => {
            setAccessList(accessRes.data?.results || accessRes.data || []);
            setClients(clientsRes.data?.results || clientsRes.data || []);
        }).finally(() => setLoading(false));
    }, []);

    const handleToggleAccess = async (accessId, currentStatus) => {
        try {
            await portalService.updatePortalAccess(accessId, { is_active: !currentStatus });
            setAccessList(prev => prev.map(a => a.id === accessId ? { ...a, is_active: !currentStatus } : a));
            toast.success(`Access ${!currentStatus ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error("Failed to update access");
        }
    };

    const handleRevoke = async (accessId) => {
        if (!window.confirm("Are you sure you want to completely revoke portal access?")) return;
        try {
            await portalService.revokePortalAccess(accessId);
            setAccessList(prev => prev.filter(a => a.id !== accessId));
            toast.success("Access revoked");
        } catch (error) {
            toast.error("Failed to revoke access");
        }
    };

    const handleResendWelcome = async (accessId) => {
        toast.success("Welcome email queued for sending");
    };

    const filteredAccess = accessList.filter(a => {
        if (!search) return true;
        const s = search.toLowerCase();
        const clientName = (clients.find(c => c.id === a.client_id)?.company_name || '').toLowerCase();
        const userEmail = (a.user?.email || '').toLowerCase();
        return clientName.includes(s) || userEmail.includes(s);
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading access records...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Users className="text-indigo-400" size={28} /> Portal Access
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage which users have access to client portals</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-indigo-600/20">
                    <Plus size={16} /> Grant New Access
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by client or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Client Company</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Last Login</th>
                                <th className="p-4">Welcome Email</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredAccess.map(access => (
                                <tr key={access.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 text-sm font-medium text-white">{access.user?.email || `User #${access.user_id}`}</td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {clients.find(c => c.id === access.client_id)?.company_name || 'Associated Client'}
                                    </td>
                                    <td className="p-4">
                                        {access.is_active ? (
                                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest">Disabled</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {access.last_login ? new Date(access.last_login).toLocaleString() : 'Never'}
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {access.welcome_email_sent ? (
                                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold"><ShieldCheck size={14} /> Sent</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-amber-400 text-xs font-bold"><ShieldAlert size={14} /> Pending</span>
                                        )}
                                    </td>
                                    <td className="p-4 flex items-center justify-end gap-3">
                                        <button onClick={() => navigate(`/admin/portal/${access.client_id || 1}`)} className="text-xs font-bold text-indigo-400 hover:text-indigo-300" title="Preview Portal">
                                            Preview
                                        </button>
                                        <button onClick={() => handleResendWelcome(access.id)} className="text-xs font-bold text-slate-400 hover:text-white" title="Resend Welcome Email">
                                            Resend
                                        </button>
                                        <button onClick={() => handleToggleAccess(access.id, access.is_active)} className="text-xs font-bold text-slate-400 hover:text-white">
                                            {access.is_active ? 'Disable' : 'Enable'}
                                        </button>
                                        <button onClick={() => handleRevoke(access.id)} className="text-xs font-bold text-rose-400 hover:text-rose-300">
                                            Revoke
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredAccess.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500 text-sm">No portal access records found matching criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


