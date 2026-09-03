import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import client from '../../../api/client';
import toast from 'react-hot-toast';
import { SlidersHorizontal, Globe, Bell, Moon, Layout, Lock, Loader2, Mail, Smartphone, X } from 'lucide-react';

const Toggle = ({ value, onChange, disabled = false }) => (
    <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => !disabled && onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
            value ? 'bg-blue-600' : 'bg-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            value ? 'translate-x-5' : 'translate-x-0'
        }`} />
    </button>
);

const PreferencesModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [prefs, setPrefs] = useState({
        language: 'en',
        timezone: 'UTC',
        notification_email: true,
        notification_in_app: true,
        notification_security: true,
        notification_digest: false,
        compact_mode: false
    });

    useEffect(() => {
        if (isOpen && user) {
            setPrefs({
                language: user.language || 'en',
                timezone: user.timezone || 'UTC',
                notification_email: user.notification_email ?? true,
                notification_in_app: user.notification_in_app ?? true,
                notification_security: user.notification_security ?? true,
                notification_digest: user.notification_digest ?? false,
                compact_mode: localStorage.getItem('bitguard_compact_mode') === 'true'
            });
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setSaving(true);
        try {
            await client.patch(`users/${user.id}/`, {
                language: prefs.language,
                timezone: prefs.timezone,
                notification_email: prefs.notification_email,
                notification_in_app: prefs.notification_in_app,
                notification_security: prefs.notification_security,
                notification_digest: prefs.notification_digest
            });
            localStorage.setItem('bitguard_compact_mode', prefs.compact_mode);
            toast.success('Preferences saved');
            onClose();
        } catch {
            toast.error('Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-slate-950 border border-blue-500/20 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <SlidersHorizontal size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Preferences</h2>
                            <p className="text-xs text-slate-400">Customize your platform experience</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-800/50">
                            <Globe size={16} className="text-blue-500" />
                            Localization
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Language</label>
                                <select 
                                    value={prefs.language} 
                                    onChange={e => setPrefs({...prefs, language: e.target.value})} 
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
                                >
                                    <option value="en">English</option>
                                    <option value="fr">French</option>
                                    <option value="ar">Arabic</option>
                                    <option value="es">Spanish</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Timezone</label>
                                <select 
                                    value={prefs.timezone} 
                                    onChange={e => setPrefs({...prefs, timezone: e.target.value})} 
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="Europe/London">Europe/London</option>
                                    <option value="Europe/Paris">Europe/Paris</option>
                                    <option value="Europe/Berlin">Europe/Berlin</option>
                                    <option value="America/New_York">America/New_York</option>
                                    <option value="Asia/Dubai">Asia/Dubai</option>
                                    <option value="Australia/Sydney">Australia/Sydney</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-800/50">
                            <Bell size={16} className="text-blue-500" />
                            Notifications
                        </h2>
                        
                        <div className="space-y-1">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-slate-500" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">Email Notifications</p>
                                        <p className="text-xs text-slate-500">Receive important updates via email</p>
                                    </div>
                                </div>
                                <Toggle value={prefs.notification_email} onChange={val => setPrefs({...prefs, notification_email: val})} />
                            </div>
                            
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Smartphone size={16} className="text-slate-500" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">In-App Notifications</p>
                                        <p className="text-xs text-slate-500">Show alerts and messages in the platform</p>
                                    </div>
                                </div>
                                <Toggle value={prefs.notification_in_app} onChange={val => setPrefs({...prefs, notification_in_app: val})} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-800/50">
                            <Moon size={16} className="text-blue-500" />
                            Appearance
                        </h2>
                        
                        <div className="space-y-1">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Layout size={16} className="text-slate-500" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">Compact Sidebar</p>
                                        <p className="text-xs text-slate-500">Reduce sidebar item spacing for more screen space</p>
                                    </div>
                                </div>
                                <Toggle value={prefs.compact_mode} onChange={val => setPrefs({...prefs, compact_mode: val})} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 flex-shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreferencesModal;
