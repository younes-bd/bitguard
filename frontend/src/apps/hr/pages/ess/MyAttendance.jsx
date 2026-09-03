import React, { useState, useEffect } from 'react';
import { Clock, Play, Square } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

export default function MyAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [activeRecord, setActiveRecord] = useState(null);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const response = await client.get('hrm/time-entries/');
            const records = response.data?.results || response.data?.data || response.data || [];
            setAttendance(records);
            
            // Check if there is an active ongoing attendance record
            const active = records.find(r => r.time_out === null);
            if (active) {
                setIsCheckedIn(true);
                setActiveRecord(active);
            } else {
                setIsCheckedIn(false);
                setActiveRecord(null);
            }
        } catch (err) {
            toast.error('Failed to load attendance records');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckInOut = async () => {
        try {
            if (isCheckedIn && activeRecord) {
                // Check Out
                await client.patch(`hrm/time-entries/${activeRecord.id}/`, {
                    time_out: new Date().toISOString()
                });
                toast.success('Successfully checked out');
            } else {
                // Check In
                await client.post('hrm/time-entries/', {
                    time_in: new Date().toISOString(),
                    date: new Date().toISOString().split('T')[0]
                });
                toast.success('Successfully checked in');
            }
            fetchAttendance();
        } catch (err) {
            toast.error(isCheckedIn ? 'Failed to check out' : 'Failed to check in');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Clock className="text-emerald-400" size={28} />
                        My Attendance
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Track your daily working hours</p>
                </div>
                
                <button 
                    onClick={handleCheckInOut} 
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isCheckedIn ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
                >
                    {isCheckedIn ? <><Square size={16} fill="currentColor" /> Check Out</> : <><Play size={16} fill="currentColor" /> Check In</>}
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Check In</th>
                            <th className="p-4 font-medium">Check Out</th>
                            <th className="p-4 font-medium">Total Hours</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr><td colSpan="4" className="p-8 text-center text-slate-500">Loading attendance...</td></tr>
                        ) : attendance.map(att => (
                            <tr key={att.id} className="hover:bg-slate-800/30">
                                <td className="p-4 text-sm font-medium text-white">{att.date || '-'}</td>
                                <td className="p-4 text-sm text-emerald-400">{att.time_in ? new Date(att.time_in).toLocaleTimeString() : '-'}</td>
                                <td className="p-4 text-sm text-rose-400">{att.time_out ? new Date(att.time_out).toLocaleTimeString() : 'Ongoing'}</td>
                                <td className="p-4 text-sm font-medium text-slate-300">
                                    {att.total_hours ? parseFloat(att.total_hours).toFixed(2) : '-'}
                                </td>
                            </tr>
                        ))}
                        {!loading && attendance.length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-slate-500">No attendance records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
