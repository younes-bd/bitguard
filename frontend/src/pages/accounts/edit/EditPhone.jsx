import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { ArrowLeft, Trash2, Smartphone } from 'lucide-react';

const COUNTRY_CODES = [
    { code: 'US', dial: '+1', name: 'United States' },
    { code: 'GB', dial: '+44', name: 'United Kingdom' },
    { code: 'CA', dial: '+1', name: 'Canada' },
    { code: 'FR', dial: '+33', name: 'France' },
    { code: 'DE', dial: '+49', name: 'Germany' },
    { code: 'AE', dial: '+971', name: 'United Arab Emirates' },
    { code: 'SA', dial: '+966', name: 'Saudi Arabia' },
    { code: 'IN', dial: '+91', name: 'India' },
    { code: 'CN', dial: '+86', name: 'China' },
    { code: 'DZ', dial: '+213', name: 'Algeria' },
    { code: 'MA', dial: '+212', name: 'Morocco' },
    { code: 'TN', dial: '+216', name: 'Tunisia' },
    { code: 'EG', dial: '+20', name: 'Egypt' },
    { code: 'QA', dial: '+974', name: 'Qatar' },
    { code: 'JP', dial: '+81', name: 'Japan' },
    { code: 'AU', dial: '+61', name: 'Australia' },
    { code: 'BR', dial: '+55', name: 'Brazil' },
    { code: 'MX', dial: '+52', name: 'Mexico' },
    { code: 'RU', dial: '+7', name: 'Russia' },
    { code: 'ZA', dial: '+27', name: 'South Africa' },
    // Add more as needed or use a library
];

const EditPhone = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState(''); // Stores only the local part
    const [countryCode, setCountryCode] = useState('+1');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await client.get('accounts/me/');
                let fullPhone = res.data.phone_number || '';

                // Simple heuristic parse
                if (fullPhone) {
                    const found = COUNTRY_CODES.find(c => fullPhone.startsWith(c.dial));
                    if (found) {
                        setCountryCode(found.dial);
                        setPhone(fullPhone.replace(found.dial, ''));
                    } else {
                        setPhone(fullPhone); // Fallback: put everything in phone input
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);


    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        // Concatenate
        const fullNumber = countryCode + phone;
        try {
            await client.patch('accounts/me/', {
                phone_number: fullNumber
            });
            navigate('/account/personal-info');
        } catch (err) {
            console.error("Failed to update phone", err);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/account/personal-info" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-white">Phone number</h1>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Your phone number</h3>
                        <p className="text-sm text-slate-400 mt-1">Phone numbers added to your account.</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                        <Smartphone size={24} />
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                        <div className="flex gap-4">
                            {/* Country Code Selector */}
                            <div className="w-32 flex-shrink-0">
                                <select
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                                >
                                    {COUNTRY_CODES.map(c => (
                                        <option key={c.code} value={c.dial}>
                                            {c.code} {c.dial}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                                placeholder="Phone number"
                            />
                        </div>
                        <p className="text-xs text-slate-500 pt-1">BitGuard will use this number for account security and recovery.</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6">
                        <Link to="/account/personal-info" className="px-6 py-2.5 rounded-full text-sm font-semibold text-blue-400 hover:bg-blue-500/10 transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 block"
                        >
                            {saving ? 'Saving...' : 'Update Number'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPhone;
