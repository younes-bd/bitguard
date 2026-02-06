import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, Phone, MapPin, Globe } from 'lucide-react';

const ClientModal = ({ isOpen, onClose, onSave, client = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        client_type: 'company',
        status: 'lead',
        company_name: '',
        contact_email: '', // Note: Model field is contact_email? Check serializer. Usually 'email' on Contact, but maybe client has one.
        // Checking previous file... Client model has `website`, `phone`, `address`. `Contact` has `email`.
        // Let's assume there is a main contact email or we use the primary contact.
        // Correction: Client model typically doesn't have email in the snippet I saw earlier (it was in Contact).
        // Wait, let me check the snippet again. 
        // Ah, `Client` model has `name, client_type, company_name, status, sla_level, account_manager, website, phone, address`.
        // It does NOT have email. Email is on `Contact`.
        // BUT `ClientDetail.jsx` was displaying `client.contact_email`. 
        // The Serializer probably adds a `contact_email` field (likely from the primary contact).
        // To update it, we should properly update the PRIMARY CONTACT or add an email field to Client if that's what's intended.
        // For now, let's stick to the visible fields in the model + phone/website.
        website: '',
        phone: '',
        address: '' // Added address
    });

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                client_type: client.client_type || 'company',
                status: client.status || 'lead',
                company_name: client.company_name || '',
                website: client.website || '',
                phone: client.phone || '', // Using phone from model
                address: client.address || ''
            });
        } else {
            setFormData({
                name: '',
                client_type: 'company',
                status: 'lead',
                company_name: '',
                website: '',
                phone: '',
                address: ''
            });
        }
    }, [client, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-800/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="text-blue-500" size={24} />
                        {client ? 'Edit Client' : 'New Client'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Client Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Client Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.client_type}
                                onChange={(e) => setFormData({ ...formData, client_type: e.target.value })}
                            >
                                <option value="company">Company (B2B)</option>
                                <option value="individual">Individual (B2C)</option>
                            </select>
                        </div>
                    </div>

                    {/* Status & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="lead">Lead</option>
                                <option value="prospect">Prospect</option>
                                <option value="active">Active</option>
                                <option value="churned">Churned</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-3.5 text-slate-500" />
                                <input
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="+1..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Check if Company to show Company Name -- Optional, reusing Name as primary usually */}

                    {/* Website */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Website</label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-3.5 text-slate-500" />
                            <input
                                type="url"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://..."
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Address</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3.5 text-slate-500" />
                            <textarea
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                                placeholder="Billing Address..."
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-600/20"
                        >
                            {client ? 'Save Changes' : 'Create Client'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ClientModal;


