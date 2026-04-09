import React, { useEffect, useState } from 'react';
import { Award, Plus, Loader2, X, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { hrmService } from '../../../core/api/hrmService';

const CertificationsPage = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: '', issuer: '', issued_date: '', expiry_date: '', credential_id: '' });

    const fetchCerts = async () => {
        setLoading(true);
        try {
            const data = await hrmService.getCertifications();
            setCerts(Array.isArray(data) ? data : data?.results ?? []);
        } catch (err) {
            console.error('Failed to load certifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCerts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const client = (await import('../../../core/api/client')).default;
            await client.post('hrm/certifications/', form);
            setShowModal(false);
            setForm({ title: '', issuer: '', issued_date: '', expiry_date: '', credential_id: '' });
            fetchCerts();
        } catch (err) {
            console.error('Failed to add certification:', err);
            alert('Failed to add certification.');
        } finally {
            setSubmitting(false);
        }
    };

    const activeCerts = certs.filter(c => c.is_active);
    const expiringSoon = certs.filter(c => {
        if (!c.expiry_date) return false;
        const diff = new Date(c.expiry_date) - new Date();
        return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Award className="text-pink-400" size={28} />
                        Certifications
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Track employee certifications, licenses, and professional development</p>
                </div>
                <button onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                    <Plus size={14} /> Add Certification
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Certifications</div>
                    <div className="text-3xl font-bold text-white">{certs.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Expiring Soon</div>
                    <div className="text-3xl font-bold text-amber-400">{expiringSoon.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Active</div>
                    <div className="text-3xl font-bold text-emerald-400">{activeCerts.length}</div>
                </div>
            </div>

            {loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-pink-400" size={32} />
                    <p className="text-slate-500 text-sm">Loading certifications...</p>
                </div>
            ) : certs.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <Award size={48} className="mx-auto mb-4 text-slate-700" />
                    <h3 className="text-white font-semibold text-lg mb-2">No Certifications Tracked</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">Click "Add Certification" to track employee credentials.</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/60 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                                <th className="p-4">Certification</th>
                                <th className="p-4">Issuer</th>
                                <th className="p-4">Issued</th>
                                <th className="p-4">Expiry</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {certs.map(cert => {
                                const isExpiring = cert.expiry_date && (new Date(cert.expiry_date) - new Date()) < 90 * 24 * 60 * 60 * 1000 && (new Date(cert.expiry_date) - new Date()) > 0;
                                const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date();
                                return (
                                    <tr key={cert.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Award size={18} className="text-pink-400" />
                                                <div>
                                                    <p className="text-white font-medium text-sm">{cert.title}</p>
                                                    {cert.credential_id && <p className="text-slate-500 text-xs">ID: {cert.credential_id}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300 text-sm">{cert.issuer}</td>
                                        <td className="p-4 text-slate-400 text-sm">{cert.issued_date}</td>
                                        <td className="p-4 text-slate-400 text-sm flex items-center gap-1">
                                            {isExpiring && <AlertTriangle size={12} className="text-amber-400" />}
                                            {isExpired && <AlertTriangle size={12} className="text-red-400" />}
                                            {cert.expiry_date || '—'}
                                        </td>
                                        <td className="p-4">
                                            {isExpired ? (
                                                <span className="text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">Expired</span>
                                            ) : cert.is_active ? (
                                                <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1 w-fit"><CheckCircle2 size={10}/> Active</span>
                                            ) : (
                                                <span className="text-slate-500 text-xs font-bold bg-slate-800 px-2 py-1 rounded">Inactive</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Certification Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Add Certification</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Certification Title *</label>
                                <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                                    placeholder="e.g. CISSP, AWS Solutions Architect" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Issuing Organization *</label>
                                <input type="text" required value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})}
                                    placeholder="e.g. ISC², Amazon Web Services" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Issued Date *</label>
                                    <input type="date" required value={form.issued_date} onChange={e => setForm({...form, issued_date: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Expiry Date</label>
                                    <input type="date" value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Credential ID</label>
                                <input type="text" value={form.credential_id} onChange={e => setForm({...form, credential_id: e.target.value})}
                                    placeholder="Optional" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700">Cancel</button>
                                <button type="submit" disabled={submitting} className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
                                    {submitting ? <Loader2 className="animate-spin" size={14}/> : <Award size={14}/>}
                                    {submitting ? 'Saving...' : 'Add Certification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificationsPage;
