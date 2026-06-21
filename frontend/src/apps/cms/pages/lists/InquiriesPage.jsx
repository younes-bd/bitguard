import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Clock, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cmsApi } from '../../api/cmsApi';

const STATUS_MAP = {
    new: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: AlertCircle },
    replied: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    closed: { color: 'bg-slate-700 text-slate-400 border-slate-600', icon: CheckCircle2 },
};

const InquiriesPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const data = await cmsApi.getInquiries();
            setInquiries(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to fetch inquiries", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = inquiries.filter(i =>
        `${i.name} ${i.email} ${i.subject}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <MessageSquare className="text-blue-400" size={28} />
                    Website Inquiries
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Form submissions and contact requests from your public website</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Inquiries', value: inquiries.length, color: 'text-white' },
                            { label: 'Awaiting Reply', value: inquiries.filter(i => i.status === 'new').length, color: 'text-blue-400' },
                            { label: 'Resolved', value: inquiries.filter(i => i.status === 'closed').length, color: 'text-emerald-400' },
                        ].map(kpi => (
                            <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                                <div className="text-slate-400 text-xs uppercase font-bold mb-1 tracking-wider">{kpi.label}</div>
                                <div className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
                            </div>
                        ))}
                    </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search inquiries..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Contact', 'Subject', 'Source Page', 'Status', 'Date'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(inq => {
                            const st = STATUS_MAP[inq.status] || STATUS_MAP.new;
                            return (
                                <tr key={inq.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                                    <td className="px-5 py-4">
                                        <div className="text-white font-medium">{inq.name}</div>
                                        <div className="text-slate-500 text-xs flex items-center gap-1"><Mail size={11} /> {inq.email}</div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-300">{inq.subject}</td>
                                    <td className="px-5 py-4"><span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs">{inq.page}</span></td>
                                    <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${st.color}`}>{inq.status}</span></td>
                                    <td className="px-5 py-4 text-slate-500 text-xs flex items-center gap-1"><Clock size={11} /> {new Date(inq.created_at).toLocaleDateString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            </>
            )}
        </div>
    );
};

export default InquiriesPage;

