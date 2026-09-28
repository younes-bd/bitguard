import React, { useState, useEffect } from 'react';
import { databaseBackupService } from '../../../core/api/databaseBackupService';
import { settingsService } from '../../api/settingsService';
import { Database, Plus, Loader2, Download, Trash2, Search, Play } from 'lucide-react';
import toast from 'react-hot-toast';

const BackupsListPage = () => {
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [triggering, setTriggering] = useState(false);

    const loadBackups = async () => {
        setLoading(true);
        try {
            const res = await databaseBackupService.getBackups();
            setBackups(Array.isArray(res.data) ? res.data : (res.data?.results || []));
        } catch (err) {
            toast.error("Failed to load backups");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBackups(); }, []);

    const handleTrigger = async () => {
        setTriggering(true);
        try {
            await databaseBackupService.triggerBackup();
            toast.success("Backup triggered successfully");
            loadBackups();
        } catch (err) {
            toast.error("Failed to trigger backup");
        } finally {
            setTriggering(false);
        }
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filtered = backups.filter(b => b.filename?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-8 max-w-7xl mx-auto text-slate-200">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Database size={24} className="text-emerald-500" />
                        Database Backups
                    </h1>
                    <p className="text-slate-400">Manage automated and manual snapshots.</p>
                </div>
                <button 
                    onClick={handleTrigger}
                    disabled={triggering}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                    {triggering ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                    Trigger Backup Now
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search backups..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-500 w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4 border-b border-slate-800">Filename</th>
                                <th className="px-6 py-4 border-b border-slate-800">Size</th>
                                <th className="px-6 py-4 border-b border-slate-800">Status</th>
                                <th className="px-6 py-4 border-b border-slate-800">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                        <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                                        Loading...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                        No backups found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{item.filename || 'backup.zip'}</td>
                                        <td className="px-6 py-4 text-slate-300">{formatBytes(item.file_size)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                item.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                                'bg-amber-500/10 text-amber-400'
                                            }`}>
                                                {item.status || 'completed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{new Date(item.created_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BackupsListPage;
