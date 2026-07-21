import React, { useState, useEffect } from 'react';
import { Key, Plus, Search, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import client from '../../../../core/api/client';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr) - Date.now()) / (1000 * 60 * 60 * 24));
};

const expiryBadge = (days) => {
    if (days === null) return 'text-slate-500';
    if (days < 0) return 'text-rose-400 font-bold';
    if (days < 30) return 'text-rose-400 font-bold';
    if (days < 90) return 'text-amber-400 font-bold';
    return 'text-emerald-400';
};

const expiryLabel = (days) => {
    if (days === null) return '—';
    if (days < 0) return `Expired ${Math.abs(days)}d ago`;
    if (days === 0) return 'Expires today!';
    return `${days}d remaining`;
};

const LICENSE_FIELDS = [
    { name: 'software_name', label: 'Software Name', required: true },
    { name: 'vendor', label: 'Vendor', required: true },
    { name: 'license_key', label: 'License Key' },
    { name: 'seats_total', label: 'Total Seats', type: 'number', min: '1', default: '1' },
    { name: 'seats_used', label: 'Seats Used', type: 'number', min: '0', default: '0' },
    { name: 'expiry_date', label: 'Expiry Date', type: 'date' },
    { name: 'cost', label: 'Annual Cost ($)', type: 'number', step: '0.01' },
];

export default function LicenseManager() {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchLicenses = async () => {
        setLoading(true);
        try {
            const res = await client.get('assets/licenses/');
            setLicenses(res.data?.results || res.data || []);
        } catch { toast.error('Failed to load licenses'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLicenses(); }, []);

    const handleCreate = async (formData) => {
        setActionLoading(true);
        try {
            await client.post('assets/licenses/', formData);
            toast.success('License added');
            setIsModalOpen(false);
            fetchLicenses();
        } catch { toast.error('Failed to add license'); }
        finally { setActionLoading(false); }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await client.delete(`assets/licenses/${deleteTarget.id}/`);
            toast.success('License deleted');
            setDeleteTarget(null);
            fetchLicenses();
        } catch { toast.error('Failed to delete license'); }
        finally { setActionLoading(false); }
    };

    const maskKey = (key) => {
        if (!key) return '—';
        if (key.length <= 8) return '••••••••';
        return key.substring(0, 4) + '•'.repeat(Math.min(key.length - 8, 16)) + key.slice(-4);
    };

    const filtered = licenses.filter(l =>
        (l.software_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.vendor || '').toLowerCase().includes(search.toLowerCase())
    );

    // Summary stats
    const expiringSoon = licenses.filter(l => { const d = daysUntil(l.expiry_date); return d !== null && d < 30 && d >= 0; }).length;
    const expired = licenses.filter(l => { const d = daysUntil(l.expiry_date); return d !== null && d < 0; }).length;

    if (loading && licenses.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading licenses...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Key className="text-teal-400" size={28} /> License Manager
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Track software licenses, seats, and renewal dates</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-teal-600/20 active:scale-95">
                    <Plus size={18} /> Add License
                </button>
            </div>

            {/* Alert banners */}
            {(expiringSoon > 0 || expired > 0) && (
                <div className="flex flex-col sm:flex-row gap-3">
                    {expired > 0 && (
                        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
                            <AlertTriangle size={18} className="text-rose-400 shrink-0" />
                            <p className="text-rose-300 text-sm font-medium">{expired} license{expired > 1 ? 's' : ''} expired — renew immediately</p>
                        </div>
                    )}
                    {expiringSoon > 0 && (
                        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl">
                            <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                            <p className="text-amber-300 text-sm font-medium">{expiringSoon} license{expiringSoon > 1 ? 's' : ''} expiring within 30 days</p>
                        </div>
                    )}
                </div>
            )}

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search software or vendor..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        <Key size={40} className="mx-auto mb-3 text-slate-700" />
                        <p className="font-bold text-slate-400">No Licenses Found</p>
                        <p className="text-sm">Start tracking your software licenses</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                            <tr>
                                <th className="p-4">Software</th>
                                <th className="p-4">Vendor</th>
                                <th className="p-4">License Key</th>
                                <th className="p-4">Seats</th>
                                <th className="p-4">Expiry</th>
                                <th className="p-4">Status</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map(lic => {
                                const days = daysUntil(lic.expiry_date);
                                const seatPct = lic.seats_total > 0 ? Math.round((lic.seats_used / lic.seats_total) * 100) : 0;
                                return (
                                    <tr key={lic.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4">
                                            <p className="text-white font-semibold text-sm">{lic.software_name}</p>
                                            {lic.cost && <p className="text-slate-500 text-xs">${lic.cost}/yr</p>}
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">{lic.vendor}</td>
                                        <td className="p-4 font-mono text-slate-500 text-xs">{maskKey(lic.license_key)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-800 rounded-full h-1">
                                                    <div className={`h-1 rounded-full ${seatPct >= 90 ? 'bg-rose-500' : seatPct >= 70 ? 'bg-amber-500' : 'bg-teal-500'}`}
                                                        style={{ width: `${Math.min(seatPct, 100)}%` }} />
                                                </div>
                                                <span className="text-slate-400 text-xs">{lic.seats_used}/{lic.seats_total}</span>
                                            </div>
                                        </td>
                                        <td className={`p-4 text-sm ${expiryBadge(days)}`}>{expiryLabel(days)}</td>
                                        <td className="p-4">
                                            {days !== null && days < 0 ? (
                                                <span className="px-2 py-0.5 text-[10px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full uppercase">Expired</span>
                                            ) : days !== null && days < 30 ? (
                                                <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full uppercase">Renew Soon</span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full uppercase">Active</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => setDeleteTarget(lic)}
                                                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <GenericModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Software License" fields={LICENSE_FIELDS} onSubmit={handleCreate} loading={actionLoading} />
            <DeleteConfirmationModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={deleteTarget?.software_name} loading={actionLoading} />
        </div>
    );
}

