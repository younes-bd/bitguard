import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../shared/core/services/client';
import { Shield, Key, Smartphone, Monitor, CheckCircle, ChevronRight } from 'lucide-react';

const Security = () => {
    const navigate = useNavigate();
    const [loginActivity, setLoginActivity] = useState([]);
    const [devices, setDevices] = useState([]);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [lastPasswordChange, setLastPasswordChange] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const logsRes = await client.get('accounts/security/logs/');
                const devicesRes = await client.get('accounts/security/devices/');
                const profileRes = await client.get('accounts/profile/me/');

                setLoginActivity(logsRes.data);
                setDevices(devicesRes.data);
                setIs2FAEnabled(profileRes.data.two_factor_auth);
                setLastPasswordChange(profileRes.data.password_last_changed);
            } catch (err) {
                console.error("Error fetching security data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEnable2FA = async () => {
        try {
            const newStatus = !is2FAEnabled;
            // Optimistic update
            setIs2FAEnabled(newStatus);

            await client.patch('accounts/profile/me/', {
                two_factor_auth: newStatus
            });
        } catch (err) {
            console.error("Failed", err);
            setIs2FAEnabled(!is2FAEnabled); // Revert
            alert("Failed to update 2FA.");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading security details...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white text-center md:text-left">Security</h1>
            <p className="text-slate-400 text-center md:text-left">Settings and recommendations to help keep your account secure.</p>

            {/* Recent Security Activity */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white">Recent security activity</h2>
                    <p className="text-sm text-slate-400 mt-1">Review security events from the last 28 days.</p>
                </div>
                <div className="divide-y divide-slate-800">
                    {loginActivity.slice(0, 3).map((log, i) => ( // Show only top 3
                        <button key={i} className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-slate-800/50 transition-colors text-left group">
                            <div className="flex items-start gap-4">
                                <Monitor className="mt-1 text-slate-500" size={20} />
                                <div>
                                    <div className="text-slate-200 font-medium">{log.status === 'success' ? 'Successful sign-in' : 'Failed sign-in attempt'}</div>
                                    <div className="text-sm text-slate-500">{new Date(log.timestamp).toLocaleString()} • {log.ip_address}</div>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                        </button>
                    ))}
                    <div className="p-4 text-center">
                        <button onClick={() => navigate('/account/security/activity')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">See all activity</button>
                    </div>
                </div>
            </div>

            {/* How you sign in */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white">How you sign in to BitGuard</h2>
                    <p className="text-sm text-slate-400 mt-1">Make sure you can always access your Google Account.</p>
                </div>
                <div className="divide-y divide-slate-800">
                    <button onClick={handleEnable2FA} className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-slate-800/50 transition-colors text-left group">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="text-slate-200 font-medium">2-Step Verification</div>
                                {is2FAEnabled && <CheckCircle size={14} className="text-emerald-500" />}
                            </div>
                            <div className="text-sm text-slate-500">{is2FAEnabled ? 'On' : 'Off'}</div>
                        </div>
                        <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                    </button>
                    <button onClick={() => navigate('/account/security/password')} className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-slate-800/50 transition-colors text-left group">
                        <div className="flex-1">
                            <div className="text-slate-200 font-medium">Password</div>
                            <div className="text-sm text-slate-500">Last changed: {lastPasswordChange ? new Date(lastPasswordChange).toLocaleDateString() : 'Never'}</div>
                        </div>
                        <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Your Devices */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white">Your devices</h2>
                    <p className="text-sm text-slate-400 mt-1">Where you’re signed in.</p>
                </div>
                <div className="divide-y divide-slate-800">
                    {devices.length > 0 ? devices.map((device, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-slate-800/50 transition-colors text-left group">
                            <div className="flex items-start gap-4">
                                <Smartphone className="mt-1 text-slate-500" size={20} />
                                <div>
                                    <div className="text-slate-200 font-medium">{device.name || 'Unknown Device'}</div>
                                    <div className="text-sm text-slate-500 green-500 flex items-center gap-1">
                                        <CheckCircle size={10} className={Date.now() - new Date(device.last_login).getTime() < 300000 ? "text-emerald-500" : "text-slate-500"} />
                                        {Date.now() - new Date(device.last_login).getTime() < 300000 ? "Active now" : `Last seen: ${new Date(device.last_login).toLocaleString()}`}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                        </button>
                    )) : (
                        <div className="p-6 text-slate-500 text-sm italic">No devices detected.</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Security;
