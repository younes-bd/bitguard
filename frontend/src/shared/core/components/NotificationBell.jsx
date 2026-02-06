import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

const NotificationBell = () => {
    const { notifications, removeNotification } = useNotification();
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    const unreadCount = notifications.length;

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-slate-950"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-slate-800 bg-slate-950/50">
                        <h4 className="text-sm font-semibold text-white">Notifications</h4>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">No notifications</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`p-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors`}>
                                    <div className="flex justify-between items-start">
                                        <h5 className="text-sm font-medium text-slate-200">{n.title || 'Notification'}</h5>
                                        <button onClick={() => removeNotification(n.id)} className="text-xs text-blue-400 hover:text-blue-300">Dismiss</button>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{n.message}</p>
                                    <span className="text-[10px] text-slate-500 mt-2 block">{n.created_at ? new Date(n.created_at).toLocaleTimeString() : 'Just now'}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
