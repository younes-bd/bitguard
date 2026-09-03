import React, { useState } from 'react';
import { useAuth } from '@/core/hooks/useAuth';
import { User, Mail, Phone, Building, Hash, MapPin, Loader2, Shield, Key, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import client from '@/core/api/client';

const PortalAccountDetails = () => {
    const { user, refetchUser } = useAuth();
    const [activeTab, setActiveTab] = useState('details');
    
    // Details State
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Security State
    const [securityLoading, setSecurityLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            await client.patch('users/me/', data);
            toast.success('Profile updated successfully');
            if (refetchUser) {
                refetchUser();
            }
        } catch (error) {
            toast.error('Failed to update profile');
            if (error.response?.data) {
                setErrors(error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSecuritySubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setSecurityLoading(true);
        try {
            await client.post('users/change-password/', {
                current_password: currentPassword,
                new_password: newPassword
            });
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setSecurityLoading(false);
        }
    };
    
    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Account</h1>
                    <p className="text-slate-400 mt-1">Manage your personal information and security</p>
                </div>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-800">
                <button 
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-2"><User size={16} /> My Details</div>
                </button>
                <button 
                    onClick={() => setActiveTab('security')}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-2"><Shield size={16} /> Security</div>
                </button>
            </div>
            
            {activeTab === 'details' && (
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 animate-in slide-in-from-bottom-2 duration-300">
                    <form className="space-y-6" onSubmit={handleDetailsSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <User size={16} className="text-slate-500" />
                                    First Name
                                </label>
                                <input type="text" name="first_name" defaultValue={user?.first_name || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <User size={16} className="text-slate-500" />
                                    Last Name
                                </label>
                                <input type="text" name="last_name" defaultValue={user?.last_name || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Mail size={16} className="text-slate-500" />
                                    Email Address
                                </label>
                                <input type="email" defaultValue={user?.email || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-500 focus:ring-0 outline-none cursor-not-allowed" readOnly />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Phone size={16} className="text-slate-500" />
                                    Phone
                                </label>
                                <input type="tel" name="phone" defaultValue={user?.phone || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                {errors.phone && <p className="text-red-500 text-xs">{errors.phone[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Building size={16} className="text-slate-500" />
                                    Company Name
                                </label>
                                <input type="text" name="company_name" defaultValue={user?.tenant_name || user?.company_name || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                {errors.company_name && <p className="text-red-500 text-xs">{errors.company_name[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Hash size={16} className="text-slate-500" />
                                    VAT Number
                                </label>
                                <input type="text" name="vat_number" defaultValue={user?.vat_number || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                {errors.vat_number && <p className="text-red-500 text-xs">{errors.vat_number[0]}</p>}
                            </div>
                        </div>
                        
                        <hr className="border-slate-800" />
                        
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                                <MapPin size={18} className="text-blue-500" /> Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Street</label>
                                    <input type="text" name="street" defaultValue={user?.street || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.street && <p className="text-red-500 text-xs">{errors.street[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">City</label>
                                    <input type="text" name="city" defaultValue={user?.city || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.city && <p className="text-red-500 text-xs">{errors.city[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Zip/Postal Code</label>
                                    <input type="text" name="zip" defaultValue={user?.zip || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.zip && <p className="text-red-500 text-xs">{errors.zip[0]}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Country</label>
                                    <input type="text" name="country" defaultValue={user?.country || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.country && <p className="text-red-500 text-xs">{errors.country[0]}</p>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end">
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                        <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2 mb-6">
                            <Key size={18} className="text-blue-500" /> Change Password
                        </h3>
                        
                        <form className="space-y-4 max-w-lg" onSubmit={handleSecuritySubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Current Password</label>
                                <input 
                                    type="password" 
                                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">New Password</label>
                                <input 
                                    type="password" 
                                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={securityLoading}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    {securityLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
            )}
        </div>
    );
};

export default PortalAccountDetails;

