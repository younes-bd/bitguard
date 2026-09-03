import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { portalService } from '../../../api/portalService';
import toast from 'react-hot-toast';

export default function PortalProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await portalService.getProjects();
                const items = data?.data || data?.results || data || [];
                setProjects(Array.isArray(items) ? items : []);
            } catch (error) {
                toast.error('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">Projects</h1>
                    <p className="dark:text-slate-400 text-slate-500">Track active projects and deployments.</p>
                </div>
            </div>

            <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="p-4 font-semibold">Project Name</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Manager</th>
                            <th className="p-4 font-semibold">Start Date</th>
                            <th className="p-4 font-semibold">End Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading projects...
                                </td>
                            </tr>
                        ) : projects.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <Briefcase size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    No active projects found.
                                </td>
                            </tr>
                        ) : (
                            projects.map(project => (
                                <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{project.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                                            project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {project.status ? project.status.replace('_', ' ') : 'Open'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">{project.manager_name || project.manager || 'N/A'}</td>
                                    <td className="p-4 text-slate-500 text-sm">{project.start_date || 'N/A'}</td>
                                    <td className="p-4 text-slate-500 text-sm">{project.end_date || 'N/A'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

