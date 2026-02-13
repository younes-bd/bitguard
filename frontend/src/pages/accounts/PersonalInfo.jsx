import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../shared/core/services/client';
import { authService } from '../../shared/core/services/authService';
import { iamService } from '../../shared/core/services/iamService';
import { User, ChevronRight, Camera } from 'lucide-react';

const PersonalInfo = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch User & Profile via Services
            try {
                const [userData, profileRes] = await Promise.all([
                    authService.getCurrentUser(),
                    client.get('accounts/profile/') // Profile still direct or needs service
                ]);
                setUser(userData);
                const profileData = Array.isArray(profileRes.data) ? (profileRes.data[0] || {}) : (profileRes.data || {});
                setProfile(profileData);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    console.log("Rendering PersonalInfo. User:", user, "Profile:", profile);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;

    const sections = [
        {
            title: 'Basic info',
            description: 'Some info may be visible to other people using BitGuard services.',
            items: [
                { label: 'Profile picture', value: 'A photo helps personalize your account', isImage: true, imageSrc: profile?.photo || user?.avatar || user?.photo, path: '/account/personal-info/photo' },
                { label: 'Name', value: `${user?.first_name} ${user?.last_name || ''}`, path: '/account/personal-info/name' },
                { label: 'Birthday', value: profile?.date_of_birth || 'Not set', path: '/account/personal-info/birthday' },
                { label: 'Gender', value: profile?.gender || 'Not set', path: '/account/personal-info/gender' },
            ]
        },
        {
            title: 'Contact info',
            description: '',
            items: [
                { label: 'Email', value: user?.email, path: null },
                { label: 'Phone', value: user?.phone_number || 'Add a recovery phone', path: '/account/personal-info/phone' },
            ]
        },
        {
            title: 'Addresses',
            description: 'Your home and work addresses are used to personalize your experiences.',
            items: [
                { label: 'Home address', value: profile?.home_address || 'Not set', path: '/account/personal-info/address?type=home' },
                { label: 'Work address', value: profile?.work_address || 'Not set', path: '/account/personal-info/address?type=work' },
            ]
        },
        {
            title: 'General preferences for the web',
            description: 'Manage settings for BitGuard services on the web.',
            items: [
                { label: 'Language', value: (profile?.language === 'fr' ? 'Français' : profile?.language === 'ar' ? 'العربية' : 'English (United States)'), path: '/account/personal-info/language' },
                { label: 'Currency', value: profile?.currency || 'USD', path: '/account/personal-info/currency' },
            ]
        }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white text-center md:text-left">Personal info</h1>
            <p className="text-slate-400 text-center md:text-left">Info about you and your preferences across BitGuard services.</p>

            <div className="space-y-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                            {section.description && <p className="text-sm text-slate-400 mt-1">{section.description}</p>}
                        </div>
                        <div className="divide-y divide-slate-800">
                            {section.items.map((item, i) => {
                                const Content = (
                                    <div className="flex items-center justify-between p-4 md:p-6 hover:bg-slate-800/50 transition-colors text-left group w-full cursor-pointer">
                                        <div className="flex-1 pr-4">
                                            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">{item.label}</div>
                                            {item.isImage ? (
                                                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                                                    {item.imageSrc ? (
                                                        <img src={item.imageSrc} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={24} className="text-slate-500" />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-slate-200 font-medium">{item.value}</div>
                                            )}
                                        </div>
                                        {item.path && <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-300 transition-colors" />}
                                    </div>
                                );

                                return item.path ? (
                                    <Link key={i} to={item.path} className="block no-underline">
                                        {Content}
                                    </Link>
                                ) : (
                                    <div key={i}>{Content}</div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonalInfo;
