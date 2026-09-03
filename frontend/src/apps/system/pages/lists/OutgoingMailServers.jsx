import React, { useState, useEffect } from 'react';
import { Send, Plus, Search, Edit2, Trash2, X, CheckCircle2, ShieldAlert, TestTube } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', smtp_host: '', smtp_port: 587, smtp_user: '', smtp_password: '', smtp_encryption: 'starttls', is_active: true, sequence: 10 };

export default function OutgoingMailServers() {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServer, setEditingServer] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [testingId, setTestingId] = useState(null);

    const fetchServers = async () => {
        setLoading(true);
        try {
            const res = await client.get('system/mail-servers-outgoing/');
            const data = res.data?.results || res.data || [];
            setServers(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load outgoing mail servers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServers(); }, []);

    const openCreate = () => { setEditingServer(null); setForm(EMPTY_FORM); setIsModalOpen(true); };
    const openEdit = (s) => { setEditingServer(s); setForm({ ...s, smtp_password: '' }); setIsModalOpen(true); };

    const handleSave = async () => {
        if (!form.name || !form.smtp_host) return toast.error('Name and SMTP host are required.');
        setSaving(true);
        try {
            if (editingServer) {
                await client.patch(`system/mail-servers-outgoing/${editingServer.id}/`, form);
                toast.success('Server updated');
            } else {
                await client.post('system/mail-servers-outgoing/', form);
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
        if (!window.confirm('Delete this mail server?')) return;
        try {
            await client.delete(`system/mail-servers-outgoing/${id}/`);
            toast.success('Server deleted');
            fetchServers();
        } catch { toast.error('Failed to delete server'); }
    };

    const handleTest = async (id) => {
        setTestingId(id);
        try {
            const res = await client.post(`system/mail-servers-outgoing/${id}/test/`);
            toast.success(res.data?.message || 'Connection successful');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Connection failed');
        } finally { setTestingId(null); }
    };

    const safe = Array.isArray(servers) ? servers : [];
    const filtered = safe.filter(s => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.smtp_host || '').toLowerCase().includes(searchTerm.toLowerCase()));

    const encryptionLabel = { none: 'None', starttls: 'TLS (STARTTLS)', ssl: 'SSL/TLS' };

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Send className="text-slate-400" /> Outgoing Mail Servers
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure SMTP servers for sending emails</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                    <Plus size={16} /> New SMTP Server
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
                                <th className="px-6 py-4 font-semibold">Description</th>
                                <th className="px-6 py-4 font-semibold">SMTP Server</th>
                                <th className="px-4 py-4 font-semibold">Port</th>
                                <th className="px-4 py-4 font-semibold">Encryption</th>
                                <th className="px-4 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading servers...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    <Send size={32} className="mx-auto mb-3 opacity-30" />
                                    <p>No outgoing mail servers configured.</p>
                                    <p className="text-xs mt-1">Click "New SMTP Server" to add one.</p>
                                </td></tr>
                            ) : filtered.map(server => (
                                <tr key={server.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-slate-200">{server.name}</td>
                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{server.smtp_host}</td>
                                    <td className="px-4 py-4 text-slate-400">{server.smtp_port}</td>
                                    <td className="px-4 py-4">
                                        <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">{encryptionLabel[server.smtp_encryption] || server.smtp_encryption}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        {server.is_active ? (
                                            <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12} /> Active</span>
                                        ) : (
                                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1"><ShieldAlert size={12} /> Disabled</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleTest(server.id)} disabled={testingId === server.id}
                                                className="p-1.5 bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors" title="Test connection">
                                                <TestTube size={14} />
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
                            <h3 className="text-lg font-bold text-white">{editingServer ? 'Edit SMTP Server' : 'New SMTP Server'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[['Description / Label', 'name', 'text', 'e.g. SendGrid Production'], ['SMTP Server Host', 'smtp_host', 'text', 'e.g. smtp.sendgrid.net'], ['SMTP Port', 'smtp_port', 'number', '587'], ['Username / Login', 'smtp_user', 'text', 'apikey'], ['Password', 'smtp_password', 'password', 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'], ['Priority (sequence)', 'sequence', 'number', '10']].map(([label, key, type, ph]) => (
                                <div key={key}>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                                    <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={ph}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Encryption</label>
                                <select value={form.smtp_encryption} onChange={e => setForm(p => ({ ...p, smtp_encryption: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                    <option value="none">None</option>
                                    <option value="starttls">TLS (STARTTLS)</option>
                                    <option value="ssl">SSL/TLS</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                                <span className="text-sm text-slate-300">Active</span>
                            </label>
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
