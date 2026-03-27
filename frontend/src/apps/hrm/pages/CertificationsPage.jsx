import React from 'react';
import { Award, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const CertificationsPage = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <Award className="text-pink-400" size={28} />
                Certifications
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Track employee certifications, licenses, and professional development</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Certifications</div>
                <div className="text-3xl font-bold text-white">0</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Expiring Soon</div>
                <div className="text-3xl font-bold text-amber-400">0</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Active</div>
                <div className="text-3xl font-bold text-emerald-400">0</div>
            </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Award size={48} className="mx-auto mb-4 text-slate-700" />
            <h3 className="text-white font-semibold text-lg mb-2">No Certifications Tracked</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Employee certifications are tracked via /api/hrm/certifications/. Add your first certification record.</p>
        </div>
    </div>
);

export default CertificationsPage;
