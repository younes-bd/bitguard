import React, { useState } from 'react';
import {
    UserPlus,
    Ticket,
    AlertTriangle,
    FileText,
    Shield,
    CheckCircle,
    Filter
} from 'lucide-react';

const ActivityFeed = () => {
    const [filter, setFilter] = useState('All');

    const events = [
        {
            id: 1,
            type: 'client',
            title: 'New Client Onboarded',
            desc: 'TechCorp Solutions was added to the platform.',
            time: '10 mins ago',
            icon: UserPlus,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            category: 'Business'
        },
        {
            id: 2,
            type: 'security',
            title: 'Critical Alert Resolved',
            desc: 'Malware detected on Server-DB-01 has been quarantined.',
            time: '32 mins ago',
            icon: Shield,
            color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
            category: 'Security'
        },
        {
            id: 3,
            type: 'ticket',
            title: 'Ticket #4928 Updated',
            desc: 'Alice assigned ticket "VPN Connectivity Issues" to Tier 2.',
            time: '1 hour ago',
            icon: Ticket,
            color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
            category: 'System'
        },
        {
            id: 4,
            type: 'invoice',
            title: 'Invoice Paid',
            desc: 'Invoice #INV-2024-001 ($4,500) paid by Alpha Inc.',
            time: '2 hours ago',
            icon: FileText,
            color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            category: 'Business'
        },
        {
            id: 5,
            type: 'alert',
            title: 'High CPU Usage Detected',
            desc: 'Web-Server-04 running at 92% CPU load.',
            time: '3 hours ago',
            icon: AlertTriangle,
            color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
            category: 'Security'
        }
    ];

    const filteredEvents = filter === 'All' ? events : events.filter(e => e.category === filter);

    return (
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-white">Activity Timeline</h3>
                <div className="flex items-center gap-2">
                    {['All', 'Security', 'Business', 'System'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative space-y-6 pl-2">
                {/* Vertical Line */}
                <div className="absolute left-6 top-2 h-[calc(100%-1rem)] w-px bg-slate-700"></div>

                {filteredEvents.map((event) => (
                    <div key={event.id} className="relative flex items-start gap-4">
                        <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-slate-800 ring-1 ring-slate-700 ${event.color}`}>
                            <event.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 pt-1.5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-200">{event.title}</p>
                                <span className="text-xs text-slate-500">{event.time}</span>
                            </div>
                            <p className="mt-0.5 text-sm text-slate-400">
                                {event.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-slate-700 py-2 text-sm font-medium text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors">
                View All Activity
            </button>
        </div>
    );
};

export default ActivityFeed;
