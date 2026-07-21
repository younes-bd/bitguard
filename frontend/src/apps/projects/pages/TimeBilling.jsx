import React, { useState, useEffect } from 'react';
import { Clock, FileText, Plus, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import client from '../../../core/api/client';
import toast from 'react-hot-toast';

export default function TimeBilling() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [timeLogs, setTimeLogs] = useState([]);
    const [selected, setSelected] = useState({});
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        client.get('projects/')
            .then(r => {
                const data = r.data?.results || r.data?.data || r.data;
                setProjects(Array.isArray(data) ? data : []);
            })
            .catch(() => toast.error('Failed to load projects'));
    }, []);

    const fetchTimeLogs = async (projectId) => {
        setLoading(true);
        setTimeLogs([]);
        setSelected({});
        try {
            const res = await client.get('hrm/time-logs/', { params: { project_id: projectId, billable: true, invoiced: false } });
            setTimeLogs(res.data?.results || res.data || []);
        } catch { toast.error('Failed to load time logs'); }
        finally { setLoading(false); }
    };

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
        if (e.target.value) fetchTimeLogs(e.target.value);
    };

    const toggleSelect = (id) => setSelected(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleAll = () => {
        const allSelected = timeLogs.every(l => selected[l.id]);
        const next = {};
        timeLogs.forEach(l => { next[l.id] = !allSelected; });
        setSelected(next);
    };

    const selectedLogs = timeLogs.filter(l => selected[l.id]);
    const totalAmount = selectedLogs.reduce((sum, l) => sum + ((l.hours || 0) * (l.hourly_rate || 0)), 0);

    const handleGenerate = async () => {
        if (selectedLogs.length === 0) { toast.error('Select at least one time log'); return; }
        setGenerating(true);
        try {
            const project = projects.find(p => String(p.id) === String(selectedProject));
            const lineItems = selectedLogs.map(l => ({
                description: `${l.employee_name || 'Staff'} - ${l.description || 'Time'} (${l.hours}h)`,
                quantity: l.hours,
                unit_price: l.hourly_rate || 0,
                amount: (l.hours || 0) * (l.hourly_rate || 0),
            }));
            await client.post('erp/invoices/', { client: project?.client || null, project: selectedProject, line_items: lineItems });
            await Promise.allSettled(selectedLogs.map(l => client.patch(`hrm/time-logs/${l.id}/`, { invoiced: true })));
            toast.success('Invoice created!');
            navigate('/admin/accounting/invoices');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate invoice');
        } finally { setGenerating(false); }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <Clock className="text-emerald-400" size={28} /> Billable Time → Invoice
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Convert unbilled time logs into client invoices</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Step 1 — Select Project</p>
                <select value={selectedProject} onChange={handleProjectChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option value="">-- Choose a project --</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            {selectedProject && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Step 2 — Select Time Logs</p>
                        {timeLogs.length > 0 && (
                            <button onClick={toggleAll} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold">
                                {timeLogs.every(l => selected[l.id]) ? 'Deselect All' : 'Select All'}
                            </button>
                        )}
                    </div>
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">
                            <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
                            Loading time logs...
                        </div>
                    ) : timeLogs.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <AlertCircle size={36} className="mx-auto mb-3 text-slate-700" />
                            <p>No unbilled billable time logs for this project</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                <tr>
                                    <th className="p-4 w-12"></th>
                                    <th className="p-4">Employee</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Hours</th>
                                    <th className="p-4">Rate</th>
                                    <th className="p-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {timeLogs.map(log => (
                                    <tr key={log.id} onClick={() => toggleSelect(log.id)}
                                        className={`cursor-pointer transition-colors ${selected[log.id] ? 'bg-emerald-500/5' : 'hover:bg-slate-800/30'}`}>
                                        <td className="p-4">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${selected[log.id] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                                {selected[log.id] && <CheckCircle size={12} className="text-white" />}
                                            </div>
                                        </td>
                                        <td className="p-4 text-white text-sm font-medium">{log.employee_name || 'Staff'}</td>
                                        <td className="p-4 text-slate-400 text-sm">{log.description || '—'}</td>
                                        <td className="p-4 text-slate-400 text-sm">{log.date}</td>
                                        <td className="p-4 text-white font-bold text-sm">{log.hours}h</td>
                                        <td className="p-4 text-slate-400 text-sm">${log.hourly_rate || '0'}/h</td>
                                        <td className="p-4 text-right text-emerald-400 font-bold">${((log.hours||0)*(log.hourly_rate||0)).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {selectedLogs.length > 0 && (
                <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Step 3 — Generate Invoice</p>
                        <p className="text-slate-300">{selectedLogs.length} log(s) · <span className="text-emerald-400 font-bold text-lg">${totalAmount.toFixed(2)}</span></p>
                    </div>
                    <button onClick={handleGenerate} disabled={generating}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 active:scale-95">
                        {generating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                        Generate Invoice
                    </button>
                </div>
            )}
        </div>
    );
}
