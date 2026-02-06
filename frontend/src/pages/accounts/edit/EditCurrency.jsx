import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { ArrowLeft, Banknote } from 'lucide-react';

const EditCurrency = () => {
    const navigate = useNavigate();
    const [currency, setCurrency] = useState('USD');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const currencies = [
        { code: 'USD', name: 'US Dollar ($)' },
        { code: 'EUR', name: 'Euro (€)' },
        { code: 'GBP', name: 'British Pound (£)' },
        { code: 'CAD', name: 'Canadian Dollar (C$)' },
        { code: 'AUD', name: 'Australian Dollar (A$)' },
        { code: 'JPY', name: 'Japanese Yen (¥)' },
        { code: 'CNY', name: 'Chinese Yuan (¥)' },
        { code: 'INR', name: 'Indian Rupee (₹)' },
        { code: 'AED', name: 'UAE Dirham (AED)' },
        { code: 'SAR', name: 'Saudi Riyal (SAR)' },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('accounts/profile/me/');
                setCurrency(res.data.currency || 'USD');
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (currCode) => {
        setSaving(true);
        try {
            await client.patch('accounts/profile/me/', { currency: currCode });
            navigate('/account/personal-info');
        } catch (err) {
            console.error("Failed to update currency", err);
            // alert("Failed to save currency.");
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
                <h1 className="text-2xl font-bold text-white">Currency</h1>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-2">Preferred Currency</h3>
                    <p className="text-slate-400 text-sm">Select the currency you want to use for pricing and payments.</p>
                </div>

                <div className="divide-y divide-slate-800">
                    {currencies.map((curr) => (
                        <div
                            key={curr.code}
                            onClick={() => handleSave(curr.code)}
                            className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${currency === curr.code ? 'bg-blue-900/10' : 'hover:bg-slate-800/50'}`}
                        >
                            <span className={`font-medium ${currency === curr.code ? 'text-blue-400' : 'text-slate-300'}`}>
                                {curr.name}
                            </span>
                            {currency === curr.code && (
                                <div className="text-blue-400">
                                    <Banknote size={20} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditCurrency;
