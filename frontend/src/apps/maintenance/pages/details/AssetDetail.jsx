import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Monitor, ArrowLeft, Clock, AlertTriangle, CheckCircle, Wrench, Archive, Download } from 'lucide-react';
import client from '../../../../core/api/client';
import toast from 'react-hot-toast';

export default function AssetDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [asset, setAsset] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        Promise.all([
            client.get(`assets/maintenance/${id}/`),
            client.get(`assets/maintenance/${id}/history/`).catch(() => ({ data: [] })),
        ]).then(([assetRes, histRes]) => {
            setAsset(assetRes.data);
            setHistory(histRes.data?.results || histRes.data || []);
        }).catch(() => toast.error('Failed to load asset')).finally(() => setLoading(false));
    }, [id]);

    const handleAction = async (action) => {
        const messages = { decommission: 'Decommission this asset? This cannot be undone.', repair: 'Send this asset for repair?' };
        if (!window.confirm(messages[action])) return;
        setActionLoading(true);
        try {
            const status = action === 'decommission' ? 'decommissioned' : 'in_repair';
            await client.patch(`assets/maintenance/${id}/`, { status });
            toast.success(`Asset ${action === 'decommission' ? 'decommissioned' : 'sent for repair'}`);
            setAsset(prev => ({ ...prev, status }));
        } catch { toast.error('Action failed'); }
        finally { setActionLoading(false); }
    };

    const STATUS_BADGE = {
        active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        in_repair: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        decommissioned: 'bg-slate-700 text-slate-400 border-slate-600',
        spare: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading asset...</p>
        </div>
    );

    if (!asset) return (
        <div className="text-center py-20 text-slate-500">
            <Monitor size={40} className="mx-auto mb-3 text-slate-700" />
            <p className="font-bold">Asset not found</p>
            <button onClick={() => navigate('/admin/maintenance/assets')} className="mt-4 text-teal-400 text-sm hover:underline">Back to Assets</button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/admin/maintenance/assets')} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Monitor className="text-teal-400" size={26} /> {asset.name}
                    </h1>
                    <span className={`mt-1 inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${STATUS_BADGE[asset.status] || STATUS_BADGE.active}`}>
                        {asset.status?.replace('_', ' ') || 'active'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={async () => {
                            try {
                                const { default: reportingService } = await import('../../../../core/api/reportingService');
                                const res = await reportingService.generateReport(null, 'maintenance.Asset', asset.id);
                                if (res && res.file) window.open(res.file, '_blank');
                            } catch (e) { toast.error("Failed to download PDF"); }
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 rounded-xl text-sm font-bold transition-all"
                    >
                        <Download size={15} /> Download PDF
                    </button>
                    {asset.status !== 'in_repair' && asset.status !== 'decommissioned' && (
                        <button onClick={() => handleAction('repair')} disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/20 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                            <Wrench size={15} /> Send for Repair
                        </button>
                    )}
                    {asset.status !== 'decommissioned' && (
                        <button onClick={() => handleAction('decommission')} disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/20 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                            <Archive size={15} /> Decommission
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Asset Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4">Asset Information</h3>
                    <div className="space-y-3">
                        {[
                            ['Serial Number', asset.serial_number],
                            ['Type', asset.asset_type],
                            ['Manufacturer', asset.manufacturer],
                            ['Model', asset.model],
                            ['Location', asset.location],
                            ['Assigned To', asset.assigned_to_name || asset.assigned_to],
                            ['Purchase Date', asset.purchase_date],
                            ['Purchase Cost', asset.purchase_cost ? `$${asset.purchase_cost}` : null],
                            ['Warranty Expiry', asset.warranty_expiry],
                        ].filter(([, v]) => v).map(([label, value]) => (
                            <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
                                <span className="text-slate-500 text-sm">{label}</span>
                                <span className="text-white text-sm font-medium">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assignment History */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4">Assignment History</h3>
                    {history.length === 0 ? (
                        <div className="text-center py-8 text-slate-600 text-sm border border-dashed border-slate-800 rounded-xl">
                            No assignment history
                        </div>
                    ) : (
                        <div className="space-y-3 relative">
                            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-slate-800" />
                            {history.map((h, i) => (
                                <div key={i} className="flex items-start gap-3 pl-2">
                                    <div className="w-4 h-4 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0 mt-0.5 z-10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                    </div>
                                    <div>
                                        <p className="text-slate-200 text-sm font-medium">{h.action || 'Assigned'}</p>
                                        <p className="text-slate-500 text-xs">{h.user || h.assigned_to} Â· {h.date || h.created_at}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {asset.notes && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-3">Notes</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{asset.notes}</p>
                </div>
            )}
        </div>
    );
}

