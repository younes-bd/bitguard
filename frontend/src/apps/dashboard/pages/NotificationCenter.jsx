import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Filter } from 'lucide-react';
import client from '../../../core/api/client';

const typeBadge = (type) => {
    const map = {
        security: 'bg-red-500/10 text-red-400',
        billing: 'bg-emerald-500/10 text-emerald-400',
        support: 'bg-amber-500/10 text-amber-400',
        system: 'bg-blue-500/10 text-blue-400',
        crm: 'bg-indigo-500/10 text-indigo-400',
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[type] ?? 'bg-slate-700 text-slate-400'}`}>{type ?? 'general'}</span>;
};

const timeAgo = (dateStr) => {
    if (!dateStr) return '—';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchNotifications = () => {
        setLoading(true);
        const params = filter !== 'all' ? { is_read: filter === 'read', limit: 100 } : { limit: 100 };
        client.get('notifications/', { params })
            .then(r => { setNotifications(r.data?.results ?? r.data ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchNotifications(); }, [filter]);

    const markAllRead = async () => {
        await client.post('notifications/mark-all-read/').catch(() => { });
        fetchNotifications();
    };

    const markRead = async (id) => {
        await client.patch(`/notifications/${id}/`, { is_read: true }).catch(() => { });
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Bell size={22} className="text-blue-400" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">{unreadCount}</span>
                        )}
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">System alerts and cross-module notifications</p>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead}
                        className="flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
                        <CheckCheck size={15} /> Mark all read
                    </button>
                )}
            </div>
            {/* Filter tabs */}
            <div className="flex gap-2">
                {['all', 'unread', 'read'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                        {f}
                    </button>
                ))}
            </div>
            {/* Notification list */}
            <div className="space-y-2">
                {loading ? (
                    <div className="text-center py-16 text-slate-500">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        <Bell size={32} className="mx-auto mb-3 text-slate-700" />
                        <p>No notifications</p>
                    </div>
                ) : notifications.map(n => (
                    <div key={n.id}
                        onClick={() => !n.is_read && markRead(n.id)}
                        className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer
                            ${n.is_read ? 'bg-slate-900/40 border-slate-800/60' : 'bg-slate-900 border-slate-700 hover:border-blue-500/30'}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.is_read ? 'bg-slate-700' : 'bg-blue-500'}`} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {typeBadge(n.notification_type ?? n.type)}
                                <span className="text-slate-500 text-xs">{timeAgo(n.created_at)}</span>
                            </div>
                            <p className={`text-sm leading-snug ${n.is_read ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>{n.message}</p>
                            {n.url && (
                                <a href={n.url} className="text-blue-400 text-xs mt-1 hover:text-blue-300 inline-block no-underline">View details →</a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationCenter;
