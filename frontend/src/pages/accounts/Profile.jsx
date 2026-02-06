import React, { useState, useEffect } from 'react';
import client from '../../shared/core/services/client';
import { User, Mail, Calendar, Shield, ExternalLink, Activity, Package, Briefcase, CreditCard } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, profileRes] = await Promise.all([
                    client.get('accounts/me/'),
                    client.get('accounts/profile/')
                ]);
                setUser(userRes.data);
                // Profile viewset returns a list because of standard ModelViewSet/permissions logic often, 
                // but if it returns a single object logic applies. 
                // Based on standard simple router it likely returns a list. Checking length.
                if (Array.isArray(profileRes.data)) {
                    setProfile(profileRes.data[0]);
                } else {
                    setProfile(profileRes.data);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6 font-[Oswald] tracking-wide">My Profile</h1>

            {/* Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                        {profile?.photo ? (
                            <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} className="text-slate-500" />
                        )}
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400 text-sm">
                        <span className="flex items-center gap-1"><Mail size={14} /> {user?.email}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(user?.date_joined).toLocaleDateString()}</span>
                    </div>
                    <div className="pt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {profile?.account_type === 'registered' ? 'Premium Member' : 'Free Trial'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User size={18} className="text-blue-500" /> Personal Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Full Name</label>
                            <div className="text-slate-300 mt-1">{user?.first_name} {user?.last_name || 'Not set'}</div>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Bio</label>
                            <div className="text-slate-300 mt-1">{profile?.bio || 'No bio available.'}</div>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Social Link</label>
                            <div className="text-slate-300 mt-1">
                                {profile?.social_link ? (
                                    <a href={profile.social_link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                        {profile.social_link} <ExternalLink size={12} />
                                    </a>
                                ) : 'Not set'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* App Integrations (Mocked UI based on real capabilities) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-purple-500" /> App Integrations
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded text-blue-400"><Briefcase size={16} /></div>
                                <div>
                                    <div className="text-sm font-medium text-white">ERP Module</div>
                                    <div className="text-xs text-slate-500">Project Management</div>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded text-orange-400"><CreditCard size={16} /></div>
                                <div>
                                    <div className="text-sm font-medium text-white">Store & Billing</div>
                                    <div className="text-xs text-slate-500">Active Subscription</div>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-slate-600"></div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded text-emerald-400"><Package size={16} /></div>
                                <div>
                                    <div className="text-sm font-medium text-white">CRM Access</div>
                                    <div className="text-xs text-slate-500">Client Portal</div>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
