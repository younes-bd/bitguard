import React, { useState, useEffect } from 'react';
import client from '../../shared/core/services/client';
import { Shield, Bell, Key, Smartphone, Monitor, Clock, CheckCircle } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('security');
    const [loginActivity, setLoginActivity] = useState([]);
    const [devices, setDevices] = useState([]);
    const [qrCode, setQrCode] = useState(null);
    const [otpCode, setOtpCode] = useState('');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false); // Mocked until API returns this status
    const [loading, setLoading] = useState(false);

    // Fetch Login Activity & Devices on mount
    useEffect(() => {
        const fetchSecurityData = async () => {
            try {
                const logsRes = await client.get('accounts/security/logs/');
                const devicesRes = await client.get('accounts/security/devices/');
                setLoginActivity(logsRes.data);
                setDevices(devicesRes.data);
            } catch (err) {
                console.error("Error fetching security data:", err);
            }
        };
        if (activeTab === 'security') {
            fetchSecurityData();
        }
    }, [activeTab]);

    const handleEnable2FA = async () => {
        try {
            const res = await client.post('accounts/security/2fa/generate/');
            // Assuming res.data.qr_code_url or similar in a real app, 
            // but the view shows it returns a specific structure.
            // For this implementation based on the view I saw:
            console.log(res.data);
            alert(`Simulation: OTP sent to email. Mock Code: ${res.data.mock_code}`);
            setIs2FAEnabled(true); // Toggle UI state
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6 font-[Oswald] tracking-wide">Account Settings</h1>

            {/* Tab Navigation */}
            <div className="flex items-center gap-4 border-b border-slate-800 mb-6">
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'security' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                >
                    Security & Login
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'notifications' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                >
                    Notifications
                </button>
            </div>

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
                <div className="space-y-8">
                    {/* 2FA Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Shield size={18} className="text-emerald-500" /> Two-Factor Authentication
                                </h3>
                                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                                    Add an extra layer of security to your account by requiring a code when logging in.
                                </p>
                            </div>
                            <button
                                onClick={handleEnable2FA}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${is2FAEnabled ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                            >
                                {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                            </button>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                            <Key size={18} className="text-blue-500" /> Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                            <input type="password" placeholder="Current Password" className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                            <input type="password" placeholder="New Password" className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg px-4 py-2.5 transition-colors">
                                Update Password
                            </button>
                        </div>
                    </div>

                    {/* Login Activity */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Clock size={18} className="text-orange-500" /> Login Activity
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950 text-slate-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Device / IP</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {loginActivity.length > 0 ? loginActivity.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Monitor size={16} className="text-slate-400" />
                                                    <span className="text-slate-300 font-mono text-sm">{log.ip_address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">Unknown</td>
                                            <td className="px-6 py-4">
                                                {log.status === 'success' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle size={10} /> Success
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                        Failed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                                No recent activity logs found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Bell size={18} className="text-yellow-500" /> Email Preferences
                    </h3>
                    <div className="space-y-4">
                        {['Security Alerts', 'Product Updates', 'Project Notifications', 'Billing Alerts'].map((item) => (
                            <div key={item} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                                <div>
                                    <div className="text-white font-medium">{item}</div>
                                    <div className="text-xs text-slate-500">Receive emails about {item.toLowerCase()}</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
