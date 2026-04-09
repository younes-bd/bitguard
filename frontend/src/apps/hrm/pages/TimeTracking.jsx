import React, { useEffect, useState } from 'react';
import { Clock, Calendar, User, Timer, Loader2, Plus, X, CheckCircle2 } from 'lucide-react';
import { hrmService } from '../../../core/api/hrmService';

const TimeTracking = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ description: '', hours: '', entry_date: new Date().toISOString().split('T')[0], project_name: '', is_billable: true });

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const data = await hrmService.getTimeEntries();
            setEntries(Array.isArray(data) ? data : data?.results ?? []);
        } catch (err) {
            console.error('Failed to load time entries:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEntries(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await hrmService.createTimeEntry?.(form) ?? 
                (await import('../../../core/api/client')).default.post('hrm/time-entries/', form);
            setShowModal(false);
            setForm({ description: '', hours: '', entry_date: new Date().toISOString().split('T')[0], project_name: '', is_billable: true });
            fetchEntries();
        } catch (err) {
            console.error('Failed to log time:', err);
            alert('Failed to log time entry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const totalHoursThisWeek = entries.reduce((sum, e) => sum + parseFloat(e.hours || 0), 0);
    const billableEntries = entries.filter(e => e.is_billable);
    const billablePercent = entries.length > 0 ? Math.round((billableEntries.length / entries.length) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Clock className="text-pink-400" size={28} />
                        Time Tracking
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Log and monitor employee time entries across projects</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Timer size={14} /> Log Time
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Entries</div>
                    <div className="text-3xl font-bold text-white">{entries.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Hours</div>
                    <div className="text-3xl font-bold text-pink-400">{totalHoursThisWeek.toFixed(1)}h</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Billable %</div>
                    <div className="text-3xl font-bold text-emerald-400">{billablePercent}%</div>
                </div>
            </div>

            {loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-pink-400" size={32} />
                    <p className="text-slate-500 text-sm">Loading time entries...</p>
                </div>
            ) : entries.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <Clock size={48} className="mx-auto mb-4 text-slate-700" />
                    <h3 className="text-white font-semibold text-lg mb-2">No Time Entries Yet</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">Click "Log Time" to create your first time entry.</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/60 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                                <th className="p-4">Date</th>
                                <th className="p-4">Project</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Hours</th>
                                <th className="p-4">Billable</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {entries.map(entry => (
                                <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 text-slate-300 text-sm flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-500" />
                                        {entry.entry_date}
                                    </td>
                                    <td className="p-4 text-white font-medium text-sm">{entry.project_name || '—'}</td>
                                    <td className="p-4 text-slate-400 text-sm max-w-xs truncate">{entry.description}</td>
                                    <td className="p-4 text-pink-400 font-bold text-sm">{entry.hours}h</td>
                                    <td className="p-4">
                                        {entry.is_billable ? (
                                            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">Yes</span>
                                        ) : (
                                            <span className="text-slate-500 text-xs font-bold bg-slate-800 px-2 py-1 rounded">No</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {entry.approved ? (
                                            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Approved</span>
                                        ) : (
                                            <span className="text-amber-400 text-xs font-bold">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Log Time Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Log Time Entry</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                                <input type="date" required value={form.entry_date} onChange={e => setForm({...form, entry_date: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Project Name</label>
                                <input type="text" value={form.project_name} onChange={e => setForm({...form, project_name: e.target.value})}
                                    placeholder="e.g. BitGuard Platform" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description *</label>
                                <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                                    placeholder="What did you work on?" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Hours *</label>
                                    <input type="number" step="0.25" min="0.25" required value={form.hours} onChange={e => setForm({...form, hours: e.target.value})}
                                        placeholder="e.g. 2.5" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-pink-500" />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.is_billable} onChange={e => setForm({...form, is_billable: e.target.checked})}
                                            className="w-4 h-4 text-pink-600 bg-slate-800 border-slate-600 rounded focus:ring-pink-500" />
                                        <span className="text-sm text-slate-300">Billable</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors">Cancel</button>
                                <button type="submit" disabled={submitting} className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
                                    {submitting ? <Loader2 className="animate-spin" size={14}/> : <Timer size={14}/>}
                                    {submitting ? 'Saving...' : 'Log Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeTracking;
