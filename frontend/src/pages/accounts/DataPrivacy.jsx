import React, { useState, useEffect } from 'react';
import client from '../../shared/core/services/client';
import { Database, Download, History, MonitorX } from 'lucide-react';

const DataPrivacy = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('accounts/profile/me/');
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const toggleSetting = async (key) => {
        const newVal = !profile[key];
        try {
            await client.patch('accounts/profile/me/', { [key]: newVal });
            setProfile(prev => ({ ...prev, [key]: newVal }));
        } catch (err) {
            console.error(err);
            alert("Failed to update setting.");
        }
    };

    const handleDownload = async () => {
        try {
            const res = await client.get('accounts/download/personal-data/'); // JSON
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "bitguard_personal_data.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to download data.");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white text-center md:text-left">Data & privacy</h1>
            <p className="text-slate-400 text-center md:text-left">Key privacy options to control your data on BitGuard.</p>

            {/* History Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white">History settings</h2>
                    <p className="text-sm text-slate-400 mt-1">Choose what activity is saved in your account.</p>
                </div>
                <div className="divide-y divide-slate-800">
                    <div className="p-6 flex items-start gap-4">
                        <History className="text-slate-400 mt-1" />
                        <div>
                            <div className="font-medium text-white">Web & App Activity</div>
                            <div className="text-sm text-slate-500 mt-1">Saves your activity on BitGuard sites and apps.</div>
                            <div className="mt-3 flex gap-4">
                                <button onClick={() => toggleSetting('history_enabled')} className="text-blue-400 text-sm font-medium hover:underline">
                                    {profile.history_enabled ? 'Turn off' : 'Turn on'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ad Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white">Ad settings</h2>
                    <p className="text-sm text-slate-400 mt-1">Control the information used to show you ads.</p>
                </div>
                <div className="p-6 flex items-start gap-4">
                    <MonitorX className="text-slate-400 mt-1" />
                    <div>
                        <div className="font-medium text-white">Personalized Ads</div>
                        <div className="text-sm text-slate-500 mt-1">You can choose whether your ads are personalized.</div>
                        <div className="mt-3">
                            <button onClick={() => toggleSetting('ads_enabled')} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${profile.ads_enabled ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                {profile.ads_enabled ? 'On' : 'Off'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Data */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white">Download or delete your data</h2>
                    <p className="text-sm text-slate-400 mt-1">Make a copy of your data or remove it from our services.</p>
                </div>
                <div className="p-6 flex items-start gap-4">
                    <Download className="text-slate-400 mt-1" />
                    <div>
                        <div className="font-medium text-white">Download your data</div>
                        <div className="text-sm text-slate-500 mt-1">Make a copy of your data to back it up (JSON format).</div>
                        <div className="mt-3">
                            <button onClick={handleDownload} className="text-blue-400 text-sm font-medium hover:underline">Download data</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataPrivacy;
