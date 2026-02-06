import React, { useState, useEffect } from 'react';
import { Save, Store, CreditCard, Bell, Globe } from 'lucide-react';
import { storeService } from '../../../shared/core/services/storeService';

const StoreSettings = () => {
    const [settings, setSettings] = useState({
        store_name: 'BitGuard Official Store',
        currency: 'USD',
        email_notifications: true,
        auto_process_orders: false,
        tax_rate: 5.0
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await storeService.getSettings();
            if (data) {
                // Ensure we respect backend naming if it returns snake_case
                setSettings({
                    store_name: data.store_name || data.storeName || 'BitGuard Official Store',
                    currency: data.currency || 'USD',
                    email_notifications: data.email_notifications ?? data.emailNotifications ?? true,
                    auto_process_orders: data.auto_process_orders ?? data.autoProcessOrders ?? false,
                    tax_rate: data.tax_rate || data.taxRate || 5.0
                });
            }
        } catch (error) {
            console.error("Failed to load settings", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            // Backend expects snake_case, which our state now uses directly
            await storeService.updateSettings(settings);
            alert("Settings saved successfully to backend!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Failed to save settings. Check console.");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Store Settings</h1>
                    <p className="text-slate-400">Configure your store preferences and operations.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all"
                >
                    <Save size={18} />
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Store size={20} className="text-indigo-400" /> General
                    </h3>
                    <div className="grid gap-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Store Name</label>
                            <input
                                type="text"
                                name="store_name"
                                value={settings.store_name}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Currency</label>
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="DZD">DZD (DA)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Automation & Notifications */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Bell size={20} className="text-amber-400" /> Notifications & Automation
                    </h3>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="email_notifications"
                                    checked={settings.email_notifications}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-6 bg-slate-800 rounded-full peer-checked:bg-emerald-500 peer-focus:ring-2 peer-focus:ring-emerald-500/50 transition-all"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
                            </div>
                            <span className="text-slate-300 group-hover:text-white transition-colors">Receive email notifications for new orders</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="auto_process_orders"
                                    checked={settings.auto_process_orders}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-6 bg-slate-800 rounded-full peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-500/50 transition-all"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
                            </div>
                            <span className="text-slate-300 group-hover:text-white transition-colors">Auto-process digital subscriptions</span>
                        </label>
                    </div>
                </div>

                {/* Financials */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CreditCard size={20} className="text-emerald-400" /> Financials
                    </h3>
                    <div className="grid gap-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Default Tax Rate (%)</label>
                            <input
                                type="number"
                                name="tax_rate"
                                value={settings.tax_rate}
                                onChange={handleChange}
                                step="0.1"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreSettings;
