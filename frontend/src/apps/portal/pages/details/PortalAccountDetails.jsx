import React from 'react';
import { useAuth } from '../../../../core/hooks/useAuth';
import { User, Mail, Phone, Building, Hash, MapPin } from 'lucide-react';

const PortalAccountDetails = () => {
    const { user } = useAuth();
    
    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">My Details</h1>
                    <p className="text-slate-400 mt-1">Manage your account information</p>
                </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <User size={16} className="text-slate-500" />
                                Full Name
                            </label>
                            <input type="text" defaultValue={user?.first_name ? `${user.first_name} ${user.last_name || ''}` : ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Mail size={16} className="text-slate-500" />
                                Email Address
                            </label>
                            <input type="email" defaultValue={user?.email || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Phone size={16} className="text-slate-500" />
                                Phone
                            </label>
                            <input type="tel" defaultValue={user?.phone || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Building size={16} className="text-slate-500" />
                                Company Name
                            </label>
                            <input type="text" defaultValue={user?.tenant_name || ''} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Hash size={16} className="text-slate-500" />
                                VAT Number
                            </label>
                            <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
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
                                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">City</label>
                                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Zip/Postal Code</label>
                                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-300">Country</label>
                                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                        <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PortalAccountDetails;
