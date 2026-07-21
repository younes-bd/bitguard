import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import client from '../../../../core/api/client';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', code: '', prefix: '', padding: 5, next_number: 1 };

export default function Sequences() {
    const [sequences, setSequences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSeq, setEditingSeq] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchSequences = async () => {
        setLoading(true);
        try {
            const res = await client.get('core/sequences/');
            const data = res.data?.results || res.data?.data || res.data || [];
            setSequences(Array.isArray(data) ? data : []);
        } catch {
            setSequences([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSequences(); }, []);

    const openCreate = () => { setEditingSeq(null); setForm(EMPTY_FORM); setIsModalOpen(true); };
    const openEdit = (s) => { setEditingSeq(s); setForm(s); setIsModalOpen(true); };

    const handleSave = async () => {
        if (!form.name || !form.code) return toast.error('Name and code are required.');
        setSaving(true);
        try {
            const payload = { ...form };
            if (editingSeq?.id) {
                await client.patch(`core/sequences/${editingSeq.id}/`, payload);
                toast.success('Sequence updated');
            } else {
                await client.post('core/sequences/', payload);
                toast.success('Sequence created');
            }
            setIsModalOpen(false);
            fetchSequences();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save sequence');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (s) => {
        if (!window.confirm(`Delete sequence "${s.name}"?`)) return;
        try {
            await client.delete(`core/sequences/${s.id}/`);
            toast.success('Sequence deleted');
            fetchSequences();
        } catch { toast.error('Failed to delete sequence'); }
    };

    const safe = Array.isArray(sequences) ? sequences : [];
    const filtered = safe.filter(s => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.code || '').toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Layers className="text-blue-400" /> Sequences
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage document numbering sequences (e.g., INV/2026/0001)</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                    <Plus size={16} /> New Sequence
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search sequences..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs uppercase bg-slate-950/80 text-slate-500 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Sequence Code</th>
                                <th className="px-6 py-4 font-semibold">Prefix</th>
                                <th className="px-4 py-4 font-semibold text-center">Padding</th>
                                <th className="px-4 py-4 font-semibold text-center">Next Number</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500"><Loader2 className="animate-spin mx-auto w-6 h-6 mb-2"/> Loading sequences...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-16 text-center text-slate-500">
                                    <Layers size={40} className="mx-auto mb-3 opacity-20" />
                                    <p className="font-semibold text-slate-400">No sequences found</p>
                                    <p className="text-xs mt-1">Create a sequence to auto-number documents.</p>
                                </td></tr>
                            ) : filtered.map((seq, i) => (
                                <tr key={seq.id || i} className="hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-slate-200">{seq.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded text-xs font-mono">
                                            {seq.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {seq.prefix ? (
                                            <span className="px-2 py-1 bg-blue-900/20 border border-blue-800/50 text-blue-400 rounded text-xs font-mono">
                                                {seq.prefix}
                                            </span>
                                        ) : (
                                            <span className="text-slate-600 italic">None</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full text-xs">{seq.padding}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md text-xs">
                                            {String(seq.next_number).padStart(seq.padding, '0')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(seq)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(seq)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"><Trash2 size={14} /></button>
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
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">{editingSeq ? 'Edit Sequence' : 'New Sequence'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[['Name', 'name', 'text', 'e.g. Sales Order'], ['Sequence Code', 'code', 'text', 'e.g. sale.order'], ['Prefix', 'prefix', 'text', 'e.g. SO/%(year)s/'], ['Padding Size', 'padding', 'number', '5'], ['Next Number', 'next_number', 'number', '1']].map(([label, key, type, ph]) => (
                                <div key={key}>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                                    <input type={type} value={form[key] ?? ''} onChange={e => setForm(p => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={ph}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Sequence'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
