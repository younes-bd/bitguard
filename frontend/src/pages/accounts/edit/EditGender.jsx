import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { ArrowLeft } from 'lucide-react';

const EditGender = () => {
    const navigate = useNavigate();
    const [gender, setGender] = useState('');
    const [profileId, setProfileId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('accounts/profile/me/');
                setGender(res.data.gender || '');
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
            await client.patch(`accounts/profile/me/`, { gender });
            navigate('/account/personal-info');
        } catch (err) {
            console.error("Failed to update gender", err);
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
                <h1 className="text-2xl font-bold text-white">Gender</h1>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <form onSubmit={handleSave} className="space-y-6 max-w-lg">
                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-slate-300 block mb-4">Select your gender</label>

                        {['Male', 'Female'].map((option) => (
                            <label key={option} className="flex items-center gap-3 p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
                                <input
                                    type="radio"
                                    name="gender"
                                    value={option}
                                    checked={gender === option}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-5 h-5 text-blue-600 bg-slate-900 border-slate-600 focus:ring-blue-500"
                                />
                                <span className="text-slate-200 font-medium">{option}</span>
                            </label>
                        ))}
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

export default EditGender;
