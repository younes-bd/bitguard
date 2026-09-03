import React, { useState, useEffect } from 'react';
import { Palette, Save, Image as ImageIcon, Banknote, Globe } from 'lucide-react';
import { accountingService } from '../api/accountingService';
import toast from 'react-hot-toast';

const InvoiceBranding = () => {
    const [branding, setBranding] = useState({
        company_name: '', company_address: '', company_phone: '', company_email: '',
        company_website: '', tax_id: '', logo_url: '', primary_color: '#1a56db',
        invoice_footer: '', bank_name: '', bank_account_number: '', 
        bank_routing_number: '', bank_swift: '', default_currency: 'USD'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchBranding = async () => {
            try {
                const data = await accountingService.getInvoiceBrandings();
                if (data && data.length > 0) {
                    setBranding(data[0]);
                }
            } catch (err) {
                toast.error("Failed to load branding settings");
            } finally {
                setLoading(false);
            }
        };
        fetchBranding();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (branding.id) {
                await accountingService.updateInvoiceBranding(branding.id, branding);
            } else {
                const data = await accountingService.createInvoiceBranding(branding);
                setBranding(data);
            }
            toast.success("Branding settings saved successfully");
        } catch (err) {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400 p-6">Loading settings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Palette className="text-emerald-400" size={28} />
                        Invoice Branding & PDF Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Customize how your invoices look to your clients</p>
                </div>
                <button 
                    onClick={handleSave} disabled={saving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <h3 className="text-white font-semibold flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Globe size={18} className="text-emerald-400" /> Company Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-slate-400 text-xs mb-1">Company Name</label>
                            <input type="text" value={branding.company_name} onChange={e => setBranding({...branding, company_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-slate-400 text-xs mb-1">Company Address</label>
                            <textarea value={branding.company_address} onChange={e => setBranding({...branding, company_address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm h-20" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Email</label>
                            <input type="email" value={branding.company_email} onChange={e => setBranding({...branding, company_email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Phone</label>
                            <input type="text" value={branding.company_phone} onChange={e => setBranding({...branding, company_phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Website</label>
                            <input type="url" value={branding.company_website} onChange={e => setBranding({...branding, company_website: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Tax ID / VAT</label>
                            <input type="text" value={branding.tax_id} onChange={e => setBranding({...branding, tax_id: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <h3 className="text-white font-semibold flex items-center gap-2 border-b border-slate-800 pb-2">
                        <ImageIcon size={18} className="text-emerald-400" /> Visuals & PDF
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Logo URL</label>
                            <div className="flex gap-4 items-start">
                                <input type="url" value={branding.logo_url} onChange={e => setBranding({...branding, logo_url: e.target.value})} placeholder="https://..." className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                                {branding.logo_url && (
                                    <div className="w-16 h-16 bg-white rounded flex items-center justify-center overflow-hidden border border-slate-700">
                                        <img src={branding.logo_url} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Primary Color (Hex)</label>
                            <div className="flex gap-2">
                                <input type="color" value={branding.primary_color} onChange={e => setBranding({...branding, primary_color: e.target.value})} className="h-9 w-9 rounded cursor-pointer bg-transparent border-0 p-0" />
                                <input type="text" value={branding.primary_color} onChange={e => setBranding({...branding, primary_color: e.target.value})} className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Default Currency</label>
                            <input type="text" value={branding.default_currency} onChange={e => setBranding({...branding, default_currency: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 lg:col-span-2">
                    <h3 className="text-white font-semibold flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Banknote size={18} className="text-emerald-400" /> Banking & Footer
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Bank Name</label>
                            <input type="text" value={branding.bank_name} onChange={e => setBranding({...branding, bank_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Account Number</label>
                            <input type="text" value={branding.bank_account_number} onChange={e => setBranding({...branding, bank_account_number: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Routing Number</label>
                            <input type="text" value={branding.bank_routing_number} onChange={e => setBranding({...branding, bank_routing_number: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">SWIFT / BIC</label>
                            <input type="text" value={branding.bank_swift} onChange={e => setBranding({...branding, bank_swift: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div className="lg:col-span-4">
                            <label className="block text-slate-400 text-xs mb-1">Invoice Footer (Terms & Conditions)</label>
                            <textarea value={branding.invoice_footer} onChange={e => setBranding({...branding, invoice_footer: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm h-20" placeholder="e.g. Please send payment within 30 days of receiving this invoice. There will be a 1.5% interest charge per month on late invoices." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceBranding;
