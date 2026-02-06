import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { ArrowLeft, Camera, Upload, Trash2, User } from 'lucide-react';

const EditPhoto = () => {
    const navigate = useNavigate();
    const [photoUrl, setPhotoUrl] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch profile to get current photo
                const res = await client.get('accounts/profile/me/');
                setPhotoUrl(res.data.photo);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const objectUrl = URL.createObjectURL(file);
        setPhotoUrl(objectUrl);

        // Store file
        setPhotoFile(file);
    };

    const [photoFile, setPhotoFile] = useState(null);

    const handleSave = async () => {
        if (!photoFile && photoUrl) {
            // No new file selected, just go back
            navigate('/account/personal-info');
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();
            if (photoFile) {
                formData.append('photo', photoFile);
            }

            // Patch profile
            await client.patch(`accounts/profile/me/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Also force refresh of 'me' cache if exists, or just navigate
            navigate('/account/personal-info');
            // Reload page to ensure header avatar updates? 
            // Better to rely on the app refetching or context update.
        } catch (err) {
            console.error("Failed to upload photo", err);
            // Fallback to generic endpoint
            try {
                const formData = new FormData();
                if (photoFile) formData.append('photo', photoFile);
                await client.patch(`accounts/profile/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                navigate('/account/personal-info');
            } catch (err2) {
                alert("Failed to save photo.");
            }
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
                <h1 className="text-2xl font-bold text-white">Profile picture</h1>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center">
                <p className="text-slate-400 mb-8 max-w-lg">
                    A picture helps people recognize you and lets you know when you’re signed in to your account.
                </p>

                <div className="relative group cursor-pointer mb-8" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-800 group-hover:border-blue-500 transition-colors relative">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <User size={64} className="text-slate-600" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={32} className="text-white" />
                        </div>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />

                <div className="flex gap-4">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-white transition-colors font-semibold text-sm"
                    >
                        <Upload size={18} />
                        <span>Change</span>
                    </button>
                    {/* Remove button logic could be added here (PATCH photo=null) */}
                </div>

                <div className="w-full border-t border-slate-800 mt-8 pt-6 flex justify-end gap-3">
                    <Link to="/account/personal-info" className="px-6 py-2.5 rounded-full text-sm font-semibold text-blue-400 hover:bg-blue-500/10 transition-colors">
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving || !photoFile}
                        className="px-6 py-2.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save as profile picture'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPhoto;
