import React, { useState } from 'react';
import { Users, Send, CheckCircle, Globe, Shield, Zap } from 'lucide-react';
import client from '../../../core/api/client';
import toast from 'react-hot-toast';

export default function PartnerProgram() {
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        interest_areas: [],
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const toggleInterest = (area) => {
        setFormData(prev => ({
            ...prev,
            interest_areas: prev.interest_areas.includes(area)
                ? prev.interest_areas.filter(a => a !== area)
                : [...prev.interest_areas, area]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.post('store/partner-requests/', formData);
            setSubmitted(true);
            toast.success("Application submitted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit application.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 pt-24">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Application Received</h1>
                    <p className="text-slate-400">
                        Thank you for your interest in the BitGuard Partner Program. Our vendor relations team will review your application and contact you within 2-3 business days.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                        <Users size={14} />
                        <span>Partner Program</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                        Grow Your Tech Business with BitGuard
                    </h1>
                    <p className="text-xl text-slate-400">
                        Become an authorized reseller and provide your clients with world-class cybersecurity hardware, software licenses, and VPN infrastructure.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                            <Globe className="text-blue-400" />
                            <h3 className="font-bold text-white">Global Reach</h3>
                            <p className="text-sm text-slate-500">Access Tier-1 vendors and international logistics.</p>
                        </div>
                        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                            <Shield className="text-emerald-400" />
                            <h3 className="font-bold text-white">Partner Portal</h3>
                            <p className="text-sm text-slate-500">Dedicated dashboard for license management.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-6">Partner Inquiry</h2>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Company Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                                    value={formData.company_name}
                                    onChange={e => setFormData({...formData, company_name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Contact Person</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                                    value={formData.contact_person}
                                    onChange={e => setFormData({...formData, contact_person: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Professional Email</label>
                            <input 
                                required
                                type="email" 
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-400 block">Areas of Interest</label>
                            <div className="flex flex-wrap gap-2">
                                {['VPN Reselling', 'Hardware Distribution', 'SaaS Licensing', 'Managed SOC'].map(area => (
                                    <button
                                        type="button"
                                        key={area}
                                        onClick={() => toggleInterest(area)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                            formData.interest_areas.includes(area)
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                        }`}
                                    >
                                        {area}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Business Model / Notes</label>
                            <textarea 
                                rows="4"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="Tell us about your distribution plans..."
                                value={formData.notes}
                                onChange={e => setFormData({...formData, notes: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            disabled={submitting}
                            className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {submitting ? 'Sending Request...' : 'Submit Partnership Application'}
                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
