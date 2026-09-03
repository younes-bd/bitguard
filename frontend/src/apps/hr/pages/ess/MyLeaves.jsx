import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { hrService } from '../../api/hrService';
import toast from 'react-hot-toast';

export default function MyLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRequesting, setIsRequesting] = useState(false);
    const [formData, setFormData] = useState({
        leave_type: 'annual', start_date: '', end_date: '', reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const response = await hrService.getLeaveRequests();
            setLeaves(response.results || response || []);
        } catch (err) {
            toast.error('Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await hrService.createLeaveRequest(formData);
            toast.success('Leave request submitted successfully');
            setIsRequesting(false);
            setFormData({ leave_type: 'annual', start_date: '', end_date: '', reason: '' });
            fetchLeaves();
        } catch (err) {
            toast.error('Failed to submit request');
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-400';
            case 'rejected': return 'bg-rose-500/10 text-rose-400';
            default: return 'bg-amber-500/10 text-amber-400';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Calendar className="text-emerald-400" size={28} />
                        My Time Off
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Request and track your leave</p>
                </div>
                {!isRequesting && (
                    <button onClick={() => setIsRequesting(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                        <Plus size={16} /> Request Leave
                    </button>
                )}
            </div>

            {isRequesting && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <h3 className="text-white font-medium mb-4">New Leave Request</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Leave Type</label>
                            <select value={formData.leave_type} onChange={e => setFormData({...formData, leave_type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" required>
                                <option value="annual">Annual Leave</option>
                                <option value="sick">Sick Leave</option>
                                <option value="unpaid">Unpaid Leave</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Start Date</label>
                            <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" required />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">End Date</label>
                            <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-xs mb-1">Reason</label>
                            <textarea value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" rows="3" required></textarea>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button type="button" onClick={() => setIsRequesting(false)} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500">Submit Request</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">Start Date</th>
                            <th className="p-4 font-medium">End Date</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr><td colSpan="4" className="p-8 text-center text-slate-500">Loading requests...</td></tr>
                        ) : leaves.map(lv => (
                            <tr key={lv.id} className="hover:bg-slate-800/30">
                                <td className="p-4 text-sm font-medium text-white capitalize">{lv.leave_type?.replace('_', ' ')}</td>
                                <td className="p-4 text-sm text-slate-400">{lv.start_date}</td>
                                <td className="p-4 text-sm text-slate-400">{lv.end_date}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lv.status)}`}>
                                        {lv.status?.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {!loading && leaves.length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-slate-500">No leave requests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
