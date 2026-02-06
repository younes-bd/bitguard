import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { ArrowLeft, Globe } from 'lucide-react';

const EditLanguage = () => {
    const navigate = useNavigate();
    const [language, setLanguage] = useState('en-us');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const languages = [
        { code: 'en-us', name: 'English (United States)' },
        { code: 'fr', name: 'Français' },
        { code: 'es', name: 'Español' },
        { code: 'de', name: 'Deutsch' },
        { code: 'ar', name: 'العربية' },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('accounts/profile/me/');
                setLanguage(res.data.language || 'en-us');
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (langCode) => {
        setSaving(true);
        try {
            await client.patch('accounts/profile/me/', { language: langCode });
            navigate('/account/personal-info');
        } catch (err) {
            console.error("Failed to update language", err);
            // alert("Failed to save language.");
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
                <h1 className="text-2xl font-bold text-white">Language</h1>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-2">Preferred Language</h3>
                    <p className="text-slate-400 text-sm">Select the language you want to use on BitGuard.</p>
                </div>

                <div className="divide-y divide-slate-800">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            onClick={() => handleSave(lang.code)}
                            className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${language === lang.code ? 'bg-blue-900/10' : 'hover:bg-slate-800/50'}`}
                        >
                            <span className={`font-medium ${language === lang.code ? 'text-blue-400' : 'text-slate-300'}`}>
                                {lang.name}
                            </span>
                            {language === lang.code && (
                                <div className="text-blue-400">
                                    <Globe size={20} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditLanguage;
