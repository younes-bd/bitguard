import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Save, ArrowLeft, Mail, Phone, MapPin, Hash, CreditCard, CheckCircle2 } from 'lucide-react';
import { purchaseService } from '../../api/purchaseService';
import { toast } from 'react-hot-toast';

const VendorCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
        vat_number: '',
        payment_terms: 'net_30',
        notes: '',
        is_active: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await purchaseService.createVendor(form);
            toast.success('Vendor created successfully');
            navigate('/admin/purchase/vendors');
        } catch (err) {
            console.error(err);
            toast.error('Failed to create vendor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        type="button"
                        onClick={() => navigate('/admin/purchase/vendors')}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Building2 className="text-emerald-500" />
                            New Vendor
                        </h1>
                        <p className="text-sm text-slate-400">Add a new supplier to the ERP registry.</p>
                    </div>
                </div>
                <button 
                    type="submit"
                    disabled={loading || !form.name}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 transition-all shadow-lg shadow-emerald-500/20"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <><Save size={18} /> Save Vendor</>
                    )}
                </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-bold text-white mb-6">Company Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Company Name *</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
                                        placeholder="Acme Corp"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">VAT / Tax ID</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            type="text" 
                                            name="vat_number"
                                            value={form.vat_number}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                                            placeholder="GB123456789"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Terms</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <select
                                            name="payment_terms"
                                            value={form.payment_terms}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-all appearance-none"
                                        >
                                            <option value="immediate">Immediate</option>
                                            <option value="net_7">Net 7</option>
                                            <option value="net_15">Net 15</option>
                                            <option value="net_30">Net 30</option>
                                            <option value="net_60">Net 60</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-bold text-white mb-6">Contact Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Contact Name</label>
                                <input 
                                    type="text" 
                                    name="contact_name"
                                    value={form.contact_name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                                            placeholder=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billing Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                                    <textarea 
                                        name="address"
                                        rows="3"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-all resize-none"
                                        placeholder="123 Supplier Street..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-bold text-white mb-6">Settings</h3>
                        
                        <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-emerald-500/50 transition-colors">
                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${form.is_active ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 bg-slate-800'}`}>
                                {form.is_active && <CheckCircle2 size={16} />}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Active Vendor</div>
                                <div className="text-xs text-slate-400">Can be selected for new Purchase Orders</div>
                            </div>
                            <input 
                                type="checkbox" 
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                                className="hidden" 
                            />
                        </label>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-bold text-white mb-4">Internal Notes</h3>
                        <textarea 
                            name="notes"
                            rows="5"
                            value={form.notes}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 focus:border-emerald-500 outline-none transition-all resize-none"
                            placeholder="Add private notes about this vendor..."
                        ></textarea>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default VendorCreate;
