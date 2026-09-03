import React, { useState, useEffect } from 'react';
import client from '@/core/api/client';
import { Mail, Plus, Pencil, Trash2, Loader2, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EmailTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', subject: '', body_html: '', model: 'Global', is_active: true });
    const [testEmail, setTestEmail] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const data = await client.get('system/email-templates/');
            setTemplates(data.data?.results || data.data || []);
        } catch (error) {
            toast.error("Failed to fetch email templates");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleAdd = () => {
        setForm({ name: '', subject: '', body_html: '', model: 'Global', is_active: true });
        setIsModalOpen(true);
    };

    const handleEdit = (t) => {
        setForm(t);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await client.patch(`system/email-templates/${form.id}/`, form);
                toast.success('Template updated');
            } else {
                await client.post('system/email-templates/', form);
                toast.success('Template created');
            }
            setIsModalOpen(false);
            fetchTemplates();
        } catch {
            toast.error('Failed to save template');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this template?")) return;
        try {
            await client.delete(`system/email-templates/${id}/`);
            toast.success("Template deleted successfully");
            fetchTemplates();
        } catch (error) {
            toast.error("Failed to delete template");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                        <Mail className="text-purple-500" />
                        Email Templates
                    </h1>
                    <p className="text-slate-400">Manage transactional email templates (Jinja2 compatible)</p>
                </div>
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors">
                    <Plus className="w-4 h-4" />
                    New Template
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-950/50 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-300">Template Name</th>
                                <th className="px-6 py-3 font-semibold text-slate-300">Subject</th>
                                <th className="px-6 py-3 font-semibold text-slate-300">Target Model</th>
                                <th className="px-6 py-3 font-semibold text-slate-300">Status</th>
                                <th className="px-6 py-3 font-semibold text-slate-300 w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {templates.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-slate-500">
                                        No email templates configured
                                    </td>
                                </tr>
                            ) : (
                                templates.map((template) => (
                                    <tr key={template.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-200">{template.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{template.subject}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                                                {template.model || 'Global'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${template.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {template.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => openTestModal(template.id)} className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                    <Send className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEdit(template)} className="p-1 text-slate-500 hover:text-purple-600 rounded transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 text-slate-500 hover:text-rose-600 rounded transition-colors" onClick={() => handleDelete(template.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold text-white mb-4">{form.id ? 'Edit' : 'New'} Template</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Name</label>
                                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Subject</label>
                                <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Model</label>
                                <select value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
                                    <option value="Global">Global</option>
                                    <option value="crm.Lead">crm.Lead</option>
                                    <option value="sale.Order">sale.Order</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Body HTML</label>
                                <textarea value={form.body_html} onChange={e => setForm({...form, body_html: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white h-32" required />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-slate-300">
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded bg-slate-950 border-slate-800" />
                                    Active
                                </label>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-400">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-purple-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isTestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold text-white mb-4">Send Test Email</h2>
                        <form onSubmit={handleSendTest} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Recipient Email</label>
                                <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" required />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsTestModalOpen(false)} className="px-4 py-2 text-sm text-slate-400">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailTemplates;
