import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmService } from '../../../shared/core/services/crmService';
import {
    Users, Briefcase, MapPin, Mail, Phone, Globe, Save, X
} from 'lucide-react';

const ClientCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        address: '',
        contact_email: '',
        phone_number: '',
        website: '',
        status: 'active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await crmService.createClient(formData);
            navigate('/crm/clients');
        } catch (error) {
            console.error("Failed to create client", error);
            alert("Failed to create client. Please check your data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="text-blue-400" size={32} />
                        Add New Client
                    </h1>
                    <p className="text-slate-400">Onboard a new client to the system.</p>
                </div>
                <button
                    onClick={() => navigate('/crm/clients')}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-xl border border-slate-700/50 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-1">Company Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Acme Corp"
                                className="w-full bg-slate-800 border-none rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-1">Industry</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    placeholder="e.g. Technology"
                                    className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-1">Contact Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    name="contact_email"
                                    required
                                    value={formData.contact_email}
                                    onChange={handleChange}
                                    placeholder="contact@company.com"
                                    className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="col-span-full">
                        <label className="block text-sm font-bold text-slate-400 mb-1">Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 text-slate-500" size={18} />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123 Business Blvd, Suite 100"
                                className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label className="block text-sm font-bold text-slate-400 mb-1">Website</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-2.5 text-slate-500" size={18} />
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://www.example.com"
                                className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-700/50">
                    <button
                        type="button"
                        onClick={() => navigate('/crm/clients')}
                        className="px-6 py-2 text-slate-400 hover:text-white font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Save size={18} />
                                Create Client
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientCreate;


