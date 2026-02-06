import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { ArrowLeft, Briefcase, Home, MapPin } from 'lucide-react';

const EditAddress = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'home'; // 'home' or 'work'

    const [formData, setFormData] = useState({
        id: null,
        street_address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        is_default: false
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                // Fetch all addresses
                const res = await client.get('accounts/addresses/');
                // Find address of this type
                // Note: user might have multiple homes, but logic here assumes one per type for simple mapping
                // Or we filter by type.
                const existing = res.data.find(a => a.type === type);

                if (existing) {
                    setFormData({
                        id: existing.id,
                        street_address: existing.street_address || '',
                        city: existing.city || '',
                        state: existing.state || '',
                        postal_code: existing.postal_code || '',
                        country: existing.country || '',
                        is_default: existing.is_default
                    });
                }
            } catch (err) {
                console.error("Failed to fetch addresses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAddress();
    }, [type]);

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                type: type,
                street_address: formData.street_address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postal_code,
                country: formData.country,
                is_default: formData.is_default
            };

            if (formData.id) {
                await client.patch(`accounts/addresses/${formData.id}/`, payload);
            } else {
                await client.post('accounts/addresses/', payload);
            }
            navigate('/account/personal-info');
        } catch (err) {
            console.error("Failed to update address", err);
            alert("Failed to save address.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Loading...</div>;

    const isWork = type === 'work';
    const title = isWork ? 'Work address' : 'Home address';
    const Icon = isWork ? Briefcase : Home;

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/account/personal-info" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-sm text-slate-400">This address will be used for {type} related deliveries.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Street Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300 block">Street Address</label>
                        <input
                            type="text"
                            name="street_address"
                            value={formData.street_address}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                            placeholder="123 Main St"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* City */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 block">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                                placeholder="New York"
                                required
                            />
                        </div>

                        {/* State/Province */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 block">State / Province</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                                placeholder="NY"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Postal Code */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 block">Postal / Zip Code</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                                placeholder="10001"
                                required
                            />
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 block">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                                placeholder="USA"
                                required
                            />
                        </div>
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

export default EditAddress;
