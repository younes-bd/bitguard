import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function AttendanceLog() {
    const [records] = useState([
        { id: 1, name: 'Alice Smith', date: '2026-06-12', checkIn: '08:55 AM', checkOut: '05:05 PM', status: 'Present' },
        { id: 2, name: 'Bob Jones', date: '2026-06-12', checkIn: '09:15 AM', checkOut: null, status: 'Late' },
        { id: 3, name: 'Charlie Brown', date: '2026-06-12', checkIn: null, checkOut: null, status: 'Absent' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Clock className="text-emerald-500" /> Attendance Log
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Track employee check-ins, check-outs, and presence.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                    <Calendar className="text-slate-500" size={18}/>
                    <span className="text-white font-bold text-sm">Today, Jun 12</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-2xl font-bold text-white">42</div>
                    <div className="text-slate-400 text-xs font-bold uppercase mt-1">Total Employees</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                    <div className="text-2xl font-bold text-emerald-400">38</div>
                    <div className="text-emerald-500/70 text-xs font-bold uppercase mt-1">Present</div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
                    <div className="text-2xl font-bold text-amber-400">3</div>
                    <div className="text-amber-500/70 text-xs font-bold uppercase mt-1">Late</div>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-5">
                    <div className="text-2xl font-bold text-rose-400">1</div>
                    <div className="text-rose-500/70 text-xs font-bold uppercase mt-1">Absent</div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Check In</th>
                            <th className="px-6 py-4">Check Out</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                        {records.map(record => (
                            <tr key={record.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-bold text-white">{record.name}</td>
                                <td className="px-6 py-4 text-slate-300">{record.checkIn || '--'}</td>
                                <td className="px-6 py-4 text-slate-300">{record.checkOut || '--'}</td>
                                <td className="px-6 py-4">
                                    {record.status === 'Present' && <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold"><CheckCircle size={14}/> Present</span>}
                                    {record.status === 'Late' && <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded text-xs font-bold"><Clock size={14}/> Late</span>}
                                    {record.status === 'Absent' && <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-1 rounded text-xs font-bold"><XCircle size={14}/> Absent</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
