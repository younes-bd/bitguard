import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { ArrowLeft, Calendar } from 'lucide-react';

const EditBirthday = () => {
    const navigate = useNavigate();
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [profileId, setProfileId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('accounts/profile/me/');
                setDateOfBirth(res.data.date_of_birth || '');
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await client.patch('accounts/profile/me/', {
                date_of_birth: dateOfBirth
            });
            navigate('/account/personal-info');
        } catch (err) {
            console.error("Failed to update birthday", err);
            // alert("Failed to save changes."); 
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/account/personal-info" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-white">Birthday</h1>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <p className="text-slate-400 mb-8 max-w-lg">
                    Your birthday may be used for account security and personalized services.
                </p>

                <form onSubmit={handleSave} className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300 block">Date of birth</label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6">
                        <Link to="/account/personal-info" className="px-6 py-2.5 rounded-full text-sm font-semibold text-blue-400 hover:bg-blue-500/10 transition-colors">
                            Cancel
                        </Link>
                        <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBirthday;
