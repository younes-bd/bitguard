import React, { useEffect, useState } from 'react';
import { crmService } from '../../../core/api/crmService';
import { UserCircle, Search, Phone, Mail, Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';
const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [clients, setClients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const [conData, cliData] = await Promise.all([
                    crmService.getContacts(),
                    crmService.getClients()
                ]);
                setContacts(Array.isArray(conData) ? conData : conData.results || []);
                setClients(Array.isArray(cliData) ? cliData : cliData.results || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedContact) {
                await crmService.updateContact(selectedContact.id, formData);
            } else {
                await crmService.createContact(formData);
            }
            setIsModalOpen(false);
            const data = await crmService.getContacts();
            setContacts(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            alert('Failed to save contact');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedContact) return;
        setActionLoading(true);
        try {
            await crmService.deleteContact(selectedContact.id);
            setIsDeleteModalOpen(false);
            const data = await crmService.getContacts();
            setContacts(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            alert('Failed to delete contact');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const CONTACT_FIELDS = [
        { name: 'first_name', label: 'First Name', required: true },
        { name: 'last_name', label: 'Last Name', required: true },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone' },
        { name: 'client', label: 'Client', type: 'select', options: clients.map(c => ({ value: c.id, label: c.name })) },
        { name: 'role', label: 'Role/Title' }
    ];

    const filtered = contacts.filter(c =>
        `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <UserCircle className="text-blue-400" size={32} />
                        Contacts
                    </h1>
                    <p className="text-slate-400">Manage all contact records across your clients.</p>
                </div>
                <button onClick={() => { setSelectedContact(null); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2">
                    <Plus size={18} /> Add Contact
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-sm mb-1 uppercase font-bold">Total Contacts</div>
                    <div className="text-3xl font-bold text-white">{contacts.length}</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-sm mb-1 uppercase font-bold">With Email</div>
                    <div className="text-3xl font-bold text-emerald-400">{contacts.filter(c => c.email).length}</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-sm mb-1 uppercase font-bold">With Phone</div>
                    <div className="text-3xl font-bold text-blue-400">{contacts.filter(c => c.phone).length}</div>
                </div>
            </div>

            {/* Contact Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Name', 'Email', 'Phone', 'Company', 'Role', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-slate-500">
                                <UserCircle size={32} className="mx-auto mb-2 opacity-20" />
                                No contacts found
                            </td></tr>
                        ) : filtered.map(c => (
                            <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                            {(c.first_name?.[0] || '').toUpperCase()}{(c.last_name?.[0] || '').toUpperCase()}
                                        </div>
                                        <span className="text-white font-medium">{c.first_name} {c.last_name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    {c.email ? (
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                            <Mail size={13} className="text-slate-600" /> {c.email}
                                        </span>
                                    ) : <span className="text-slate-600">—</span>}
                                </td>
                                <td className="px-5 py-4">
                                    {c.phone ? (
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                            <Phone size={13} className="text-slate-600" /> {c.phone}
                                        </span>
                                    ) : <span className="text-slate-600">—</span>}
                                </td>
                                <td className="px-5 py-4">
                                    {c.client_name ? (
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                            <Building2 size={13} className="text-slate-600" /> {c.client_name}
                                        </span>
                                    ) : <span className="text-slate-600">—</span>}
                                </td>
                                <td className="px-5 py-4 text-slate-400">{c.role || c.title || '—'}</td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedContact(c); setIsModalOpen(true); }}
                                            className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedContact(c); setIsDeleteModalOpen(true); }}
                                            className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Contact"
                fields={CONTACT_FIELDS}
                initialData={selectedContact}
                onSubmit={handleSave}
                loading={actionLoading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Contact"
                message={`Are you sure you want to delete ${selectedContact?.first_name} ${selectedContact?.last_name}?`}
                loading={actionLoading}
            />
        </div>
    );
};

export default ContactList;
