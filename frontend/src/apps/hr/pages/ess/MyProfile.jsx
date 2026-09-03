import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { hrService } from '../../api/hrService';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

export default function MyProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await client.get('hrm/employees/me/');
            setProfile(res.data?.data || res.data);
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-slate-400">No profile found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <User className="text-emerald-400" size={28} />
                    My Profile
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Manage your personal and professional information</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-slate-800">
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-emerald-400">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{profile.first_name} {profile.last_name}</h2>
                        <p className="text-emerald-400 font-medium">{profile.job_title}</p>
                        <p className="text-slate-400 text-sm mt-1">{profile.department_name}</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Contact Information</h3>
                        
                        <div className="flex items-center gap-3 text-slate-300">
                            <Mail size={18} className="text-slate-500" />
                            <span>{profile.email || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <Phone size={18} className="text-slate-500" />
                            <span>{profile.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <MapPin size={18} className="text-slate-500" />
                            <span>{profile.address || 'Not provided'}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Professional Details</h3>
                        
                        <div className="flex items-center gap-3 text-slate-300">
                            <Briefcase size={18} className="text-slate-500" />
                            <span>Employee ID: {profile.employee_id}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <User size={18} className="text-slate-500" />
                            <span>Status: <span className="text-emerald-400 capitalize">{profile.status}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
