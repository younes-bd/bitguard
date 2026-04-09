import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';
import toast from 'react-hot-toast';

export default function StoreSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('store/settings/')
            .then(res => {
                const data = res.data.results?.[0] || res.data?.[0] || res.data;
                setSettings(data || { currency: 'USD', tax_rate: '0.00' });
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = () => {
        const payload = settings;
        const req = payload.id 
            ? client.put(`/store/settings/${payload.id}/`, payload)
            : client.post(`/store/settings/`, payload);

        req.then(res => {
            setSettings(res.data);
            toast.success('Store settings globally applied');
        }).catch(err => {
            console.error(err);
            toast.error('Failed to sync settings');
        });
    };

    if (loading) return (
        <div className="py-20 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
            Loading storefront configurations...
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings className="text-slate-400" /> Global Settings
                </h1>
                <button 
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm p-6">
                <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Financial Compliance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Base Currency</label>
                        <select 
                            value={settings?.currency || 'USD'} 
                            onChange={e => setSettings({...settings, currency: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                        >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Global Tax Margin (%)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={settings?.tax_rate || 0} 
                            onChange={e => setSettings({...settings, tax_rate: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500" 
                        />
                    </div>
                </div>

                <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2 mt-4">API Operations</h2>
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <p className="text-slate-400 text-sm mb-4">Enterprise APIs are linked across module borders securely. Configure downstream CRM and ERP tunneling here when necessary.</p>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded font-medium transition-colors border border-slate-700">Manage Gateway Tunnels</button>
                </div>
            </div>
        </div>
    );
}
