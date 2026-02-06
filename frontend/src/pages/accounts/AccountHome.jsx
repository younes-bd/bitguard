import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../shared/core/services/client';
import { Shield, User, CreditCard } from 'lucide-react';

const AccountHome = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await client.get('accounts/me/');
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.first_name}</h1>
                <p className="text-slate-400">Manage your info, privacy, and security to make BitGuard work better for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info Card */}
                <Link to="/account/personal-info" className="group block bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors no-underline">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <User size={24} />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Personal info</h3>
                    <p className="text-slate-400 text-sm">Update your photo, name, and contact details.</p>
                </Link>

                {/* Security Card */}
                <Link to="/account/security" className="group block bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors no-underline">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <Shield size={24} />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Security</h3>
                    <p className="text-slate-400 text-sm">Settings and recommendations to help keep your account secure.</p>
                </Link>

                {/* Payments Card */}
                <Link to="/account/payments" className="group block bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors no-underline">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-full text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <CreditCard size={24} />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Payments & subscriptions</h3>
                    <p className="text-slate-400 text-sm">Manage payment methods and BitGuard Premium.</p>
                </Link>
            </div>
        </div>
    );
};

export default AccountHome;
