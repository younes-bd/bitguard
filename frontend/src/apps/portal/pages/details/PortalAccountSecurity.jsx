import React from 'react';
import { Shield, Key, Smartphone } from 'lucide-react';

const PortalAccountSecurity = () => {
    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Account Security</h1>
                    <p className="text-slate-400 mt-1">Manage your password and authentication methods</p>
                </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2 mb-6">
                    <Key size={18} className="text-blue-500" /> Change Password
                </h3>
                
                <form className="space-y-4 max-w-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="pt-2">
                        <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2 mb-2">
                            <Smartphone size={18} className="text-emerald-500" /> Two-Factor Authentication (2FA)
                        </h3>
                        <p className="text-sm text-slate-400 max-w-xl">
                            Add an extra layer of security to your account by enabling two-factor authentication. 
                            You will need an authenticator app (like Google Authenticator or Authy) to generate access codes.
                        </p>
                    </div>
                    <button type="button" className="px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 font-medium rounded-lg border border-emerald-500/20 transition-colors">
                        Enable 2FA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortalAccountSecurity;
