import React, { useState, useEffect } from 'react';
import { Target, Star, Calendar, MessageSquare, Plus, Download } from 'lucide-react';
import reportingService from '@/apps/reporting/api/reportingService';

export default function Appraisals() {
    const [appraisals, setAppraisals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('../../../hr/api/hrService').then(module => {
            module.hrService.getPerformanceAppraisals().then(data => {
                setAppraisals(data || []);
                setLoading(false);
            }).catch(() => setLoading(false));
        });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Target className="text-purple-500" /> Performance Appraisals
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Manage employee performance reviews and feedback.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    <Plus size={18} /> Schedule Appraisal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {appraisals.map(app => (
                    <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                        {app.status === 'Done' && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>}
                        {app.status === 'Planned' && <div className="absolute top-0 left-0 w-full h-1 bg-slate-600"></div>}
                        {app.status === 'In Progress' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>}
                        
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{app.employee_name || `Employee #${app.employee}`}</h3>
                                <div className="text-sm text-slate-400">Reviewer: {app.manager_name || `Manager #${app.manager}`}</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                app.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400' :
                                app.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-slate-800 text-slate-400'
                            }`}>
                                {app.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-300 mb-6">
                            <Calendar size={16} className="text-slate-500"/> {app.review_date || app.date || 'No Date'}
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-auto">
                            <div className="flex items-center gap-1">
                                <Star className={`${app.score ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} size={18}/>
                                <span className="font-bold text-white">{app.score ? `${app.score} / 5.0` : 'Pending'}</span>
                            </div>
                            <div className="flex gap-3">
                                {app.status === 'Done' && (
                                    <button 
                                        onClick={async () => {
                                            try {
                                                await reportingService.generateReport(null, 'hrm.Appraisal', app.id);
                                                import('react-hot-toast').then(m => m.toast.success('Document downloaded'));
                                            } catch(e) {
                                                import('react-hot-toast').then(m => m.toast.error('Failed to download document'));
                                            }
                                        }}
                                        className="text-purple-400 hover:text-white flex items-center gap-1 text-sm font-bold transition-colors"
                                    >
                                        <Download size={16}/> PDF
                                    </button>
                                )}
                                <button className="text-purple-400 hover:text-white flex items-center gap-1 text-sm font-bold transition-colors">
                                    <MessageSquare size={16}/> Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

