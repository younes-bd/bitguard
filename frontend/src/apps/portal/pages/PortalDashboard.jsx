import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, FileText, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../core/hooks/useAuth';
import client from '../../../core/api/client';

const PortalDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState({ tickets: [], invoices: [], contracts: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            client.get('/support/tickets/?limit=5').catch(() => ({ data: { results: [] } })),
            client.get('/erp/invoices/?limit=5').catch(() => ({ data: { results: [] } })),
            client.get('/contracts/contracts/?limit=3').catch(() => ({ data: { results: [] } })),
        ]).then(([t, i, c]) => {
            setData({
                tickets: t.data?.results ?? [],
                invoices: i.data?.results ?? [],
                contracts: c.data?.results ?? [],
            });
            setLoading(false);
        });
    }, []);

    const statBadge = (v, warn, color) => (
        <span className={`font-bold ${v >= warn ? `text-${color}-400` : 'text-slate-300'}`}>{v}</span>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-400">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-white">
                    Welcome back, {user?.first_name ?? 'Client'} 👋
                </h1>
                <p className="text-slate-400 text-sm mt-1">Your BitGuard services overview</p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Open Tickets', value: data.tickets.filter(t => t.status !== 'resolved').length, icon: Ticket, color: 'amber', link: '/portal/tickets' },
                    { label: 'Unpaid Invoices', value: data.invoices.filter(i => i.status === 'unpaid').length, icon: FileText, color: 'rose', link: '/portal/invoices' },
                    { label: 'Active Contracts', value: data.contracts.filter(c => c.status === 'active').length, icon: Shield, color: 'emerald', link: '/portal/contracts' },
                ].map(s => (
                    <Link key={s.label} to={s.link}
                        className={`bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-${s.color}-500/30 transition-colors no-underline`}>
                        <div className={`text-${s.color}-400 mb-2`}><s.icon size={18} /></div>
                        <p className="text-slate-400 text-xs">{s.label}</p>
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                    </Link>
                ))}
            </div>

            {/* Recent Tickets */}
            {data.tickets.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-800 flex justify-between">
                        <h2 className="text-sm font-bold text-white">Recent Tickets</h2>
                        <Link to="/portal/tickets" className="text-xs text-blue-400 hover:text-blue-300 no-underline">View all →</Link>
                    </div>
                    {data.tickets.slice(0, 3).map(t => (
                        <div key={t.id} className="px-5 py-3 border-b border-slate-800/50 flex justify-between items-center">
                            <p className="text-sm text-slate-200">{t.title ?? t.subject}</p>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {t.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PortalDashboard;
