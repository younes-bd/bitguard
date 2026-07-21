import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Plus, Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { hrmService } from '../../../../core/api/hrmService';

export default function RecruitmentBoard() {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            hrmService.getJobPositions(),
            hrmService.getJobApplications()
        ]).then(([jobsData, appsData]) => {
            const jobsList = Array.isArray(jobsData) ? jobsData : jobsData?.results || [];
            const appsList = Array.isArray(appsData) ? appsData : appsData?.results || [];
            
            // Map applications to count per job
            const jobsWithStats = jobsList.map(job => {
                const applicantsCount = appsList.filter(app => app.job_position === job.id).length;
                return {
                    id: job.id,
                    title: job.name,
                    department: job.department_name || 'General',
                    applicants: applicantsCount,
                    status: job.is_active ? 'Active' : 'Paused'
                };
            });

            const mappedApps = appsList.map(app => ({
                id: app.id,
                name: app.applicant_name,
                job: app.job_position_name,
                stage: app.status,
                date: new Date(app.created_at).toISOString().split('T')[0]
            }));

            setJobs(jobsWithStats);
            setApplications(mappedApps);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-400" size={32}/></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Briefcase className="text-blue-500" /> Recruitment Board
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Manage job postings and track applicant pipelines.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    <Plus size={18} /> Post a Job
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <h2 className="text-lg font-bold text-white">Active Positions</h2>
                    {jobs.length === 0 ? (
                        <p className="text-slate-500 text-sm">No active positions</p>
                    ) : jobs.map(job => (
                        <div key={job.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{job.title}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                                    {job.status}
                                </span>
                            </div>
                            <div className="text-sm text-slate-400 mb-4">{job.department}</div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-400 font-bold">{job.applicants} Applicants</span>
                                <button className="text-slate-500 hover:text-white"><MoreHorizontal size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-white">Recent Applications</h2>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="text" placeholder="Search applicants..." className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                            </div>
                            <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white flex items-center gap-2">
                                <Filter size={16}/> Filter
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Applicant</th>
                                    <th className="px-4 py-3">Position</th>
                                    <th className="px-4 py-3">Stage</th>
                                    <th className="px-4 py-3">Applied</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-sm">
                                {applications.length === 0 ? (
                                    <tr><td colSpan="5" className="p-4 text-center text-slate-500">No applications found</td></tr>
                                ) : applications.map(app => (
                                    <tr key={app.id} className="hover:bg-slate-800/30">
                                        <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold">
                                                {app.name.charAt(0)}
                                            </div>
                                            {app.name}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">{app.job}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">{app.stage}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{app.date}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="text-blue-400 hover:underline">Review</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
