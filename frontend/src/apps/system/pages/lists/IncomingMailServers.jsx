import React, { useState, useEffect } from 'react';
import { Mail, Plus, Search, Edit2, Trash2, X, CheckCircle2, RefreshCw } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', server_type: 'imap', server: '', port: 993, is_ssl: true, user: '', password: '', is_active: true };

export default function IncomingMailServers() {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServer, setEditingServer] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [fetchingId, setFetchingId] = useState(null);

    const fetchServers = async () => {
        setLoading(true);
        try {
            const res = await client.get('system/mail-servers-incoming/');
            const data = res.data?.results || res.data || [];
            setServers(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load incoming mail servers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServers(); }, []);

    const openCreate = () => { setEditingServer(null); setForm(EMPTY_FORM); setIsModalOpen(true); };
    const openEdit = (s) => { setEditingServer(s); setForm({ ...s, password: '' }); setIsModalOpen(true); };

    const handleSave = async () => {
        if (!form.name || !form.server) return toast.error('Name and server address are required.');
        setSaving(true);
        try {
            if (editingServer) {
                await client.patch(`system/mail-servers-incoming/${editingServer.id}/`, form);
                toast.success('Server updated');
            } else {
                await client.post('system/mail-servers-incoming/', form);
                toast.success('Server created');
            }
            setIsModalOpen(false);
            fetchServers();
        } catch {
            toast.error('Failed to save server');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this incoming mail server?')) return;
        try {
            await client.delete(`system/mail-servers-incoming/${id}/`);
            toast.success('Server deleted');
            fetchServers();
        } catch { toast.error('Failed to delete server'); }
    };

    const handleFetchNow = async (id, name) => {
        setFetchingId(id);
        try {
            await client.post(`system/mail-servers-incoming/${id}/fetch_now/`);
            toast.success(`Fetch triggered for ${name}`);
            fetchServers();
        } catch { toast.error('Failed to trigger fetch'); } finally { setFetchingId(null); }
    };

    const safe = Array.isArray(servers) ? servers : [];
    const filtered = safe.filter(s => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.server || '').toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Mail className="text-slate-400" /> Incoming Mail Servers
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure IMAP/POP3 servers for fetching emails</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                    <Plus size={16} /> New Server
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search servers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs uppercase bg-slate-950/50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-4 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Server</th>
                                <th className="px-4 py-4 font-semibold">Port</th>
                                <th className="px-4 py-4 font-semibold">Last Fetch</th>
                                <th className="px-4 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">Loading servers...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                    <Mail size={32} className="mx-auto mb-3 opacity-30" />
                                    <p>No incoming mail servers configured.</p>
                                    <p className="text-xs mt-1">Click "New Server" to add one.</p>
                                </td></tr>
                            ) : filtered.map(server => (
                                <tr key={server.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-slate-200">{server.name}</td>
                                    <td className="px-4 py-4">
                                        <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-bold uppercase">{server.server_type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{server.server}</td>
                                    <td className="px-4 py-4 text-slate-400">{server.port}</td>
                                    <td className="px-4 py-4 text-slate-500 text-xs">{server.last_fetch ? new Date(server.last_fetch).toLocaleString() : 'â€”'}</td>
                                    <td className="px-4 py-4">
                                        {server.is_active ? (
                                            <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12} /> Active</span>
                                        ) : (
                                            <span className="text-slate-500 text-xs font-bold uppercase">Disabled</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleFetchNow(server.id, server.name)} disabled={fetchingId === server.id}
                                                className="p-1.5 bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-colors" title="Fetch now">
                                                <RefreshCw size={14} className={fetchingId === server.id ? 'animate-spin' : ''} />
                                            </button>
                                            <button onClick={() => openEdit(server)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(server.id)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">{editingServer ? 'Edit Incoming Server' : 'New Incoming Server'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Server Type</label>
                                <select value={form.server_type} onChange={e => setForm(p => ({ ...p, server_type: e.target.value, port: e.target.value === 'imap' ? 993 : 995 }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                    <option value="imap">IMAP</option>
                                    <option value="pop3">POP3</option>
                                </select>
                            </div>
                            {[['Name / Label', 'name', 'text', 'e.g. Support Inbox'], ['Server Address', 'server', 'text', 'e.g. imap.gmail.com'], ['Port', 'port', 'number', '993'], ['Username', 'user', 'text', 'support@company.com'], ['Password', 'password', 'password', 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢']].map(([label, key, type, ph]) => (
                                <div key={key}>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                                    <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={ph}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                                </div>
                            ))}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={form.is_ssl} onChange={e => setForm(p => ({ ...p, is_ssl: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                                    <span className="text-sm text-slate-300">Use SSL</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                                    <span className="text-sm text-slate-300">Active</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Server'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
