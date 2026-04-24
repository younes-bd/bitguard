import React, { useState, useEffect } from 'react';
import { Activity, Webhook, Save, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';
import toast from 'react-hot-toast';

export default function PixelTracking() {
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('store/tracking-configs/')
            .then(res => {
                const data = res.data.results?.[0] || res.data?.[0] || res.data;
                setTracking(data || { facebook_pixel_id: '', google_analytics_id: '' });
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = () => {
        const payload = tracking;
        const req = payload.id 
            ? client.put(`store/tracking-configs/${payload.id}/`, payload)
            : client.post(`store/tracking-configs/`, payload);

        req.then(res => {
            setTracking(res.data);
            toast.success('Analytics tracking telemetry synced');
        }).catch(err => {
            console.error(err);
            toast.error('Failed to update telemetry keys');
        });
    };

    if (loading) return (
        <div className="py-20 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-500" />
            Loading telemetry metrics...
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-emerald-400" /> Marketing Analytics
                </h1>
                <button 
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Save size={16} /> Deploy Trackers
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm p-6">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Webhook size={18} /> Telemetry Configurations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Google Analytics (G-ID / UA-ID)</label>
                        <input 
                            type="text" 
                            placeholder="G-XXXXXXXXXX"
                            value={tracking?.google_analytics_id || ''} 
                            onChange={e => setTracking({...tracking, google_analytics_id: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono" 
                        />
                        <p className="text-xs text-slate-500 mt-2">Active telemetry streams direct page views and checkout funnels directly to your GCP Datastream.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Meta Pixel ID (Facebook)</label>
                        <input 
                            type="text" 
                            placeholder="123456789012345"
                            value={tracking?.facebook_pixel_id || ''} 
                            onChange={e => setTracking({...tracking, facebook_pixel_id: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono" 
                        />
                        <p className="text-xs text-slate-500 mt-2">Enables dynamic Ad retargeting across Meta properties after cart abandonment.</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-xl p-4 flex items-start gap-3">
                <Activity className="text-emerald-500 mt-0.5" size={20} />
                <div>
                    <h3 className="text-emerald-400 font-bold mb-1">Server-Side Tracking Architecture</h3>
                    <p className="text-emerald-400/70 text-sm">BitGuard bypasses local ad-blockers by executing conversion APIs securely on the Django server layer utilizing direct S2S tunneling. Ad-blockers cannot interrupt telemetry arrays.</p>
                </div>
            </div>
        </div>
    );
}
