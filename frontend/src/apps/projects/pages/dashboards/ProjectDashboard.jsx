import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, Clock, CheckCircle, AlertTriangle, ArrowLeft, Loader2, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import projectsService from '../../api/projectsService';
import { toast } from 'react-hot-toast';

export default function ProjectDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [projData, tasksData] = await Promise.all([
                projectsService.getProject(id),
                projectsService.getTasks({ project: id })
            ]);
            setProject(projData);
            setTasks(tasksData || []);
        } catch (error) {
            toast.error("Failed to load project dashboard");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
    if (!project) return <div className="text-center p-12 text-slate-400">Project not found</div>;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const now = new Date();
    const overdueTasks = tasks.filter(t => t.status !== 'done' && t.deadline && new Date(t.deadline) < now).length;
    const totalHours = tasks.reduce((sum, t) => sum + parseFloat(t.actual_hours || 0), 0);
    const estimatedHours = tasks.reduce((sum, t) => sum + parseFloat(t.estimated_hours || 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-6 h-[calc(100vh-64px)] overflow-y-auto">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Projects
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Activity className="text-blue-500" /> {project.name} Dashboard
                        </h1>
                        <p className="text-sm text-slate-400">KPIs, completion, and performance metrics</p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-2">
                        <Target size={24} />
                    </div>
                    <p className="text-slate-400 text-sm font-bold">Completion</p>
                    <h2 className="text-4xl font-black text-white">{completionPercent}%</h2>
                    <div className="w-full bg-slate-800 h-2 mt-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${completionPercent}%` }} />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-2">
                        <CheckCircle size={24} />
                    </div>
                    <p className="text-slate-400 text-sm font-bold">Tasks Done</p>
                    <h2 className="text-4xl font-black text-white">{completedTasks} <span className="text-xl text-slate-500">/ {totalTasks}</span></h2>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                        <AlertTriangle size={24} />
                    </div>
                    <p className="text-slate-400 text-sm font-bold">Overdue Tasks</p>
                    <h2 className="text-4xl font-black text-rose-500">{overdueTasks}</h2>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-2">
                        <Clock size={24} />
                    </div>
                    <p className="text-slate-400 text-sm font-bold">Hours Logged</p>
                    <h2 className="text-4xl font-black text-white">{totalHours.toFixed(1)} <span className="text-xl text-slate-500">/ {estimatedHours.toFixed(1)}h</span></h2>
                </div>
            </div>

            {/* Burn-down chart mock representation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-purple-500"/> Burn-down Status
                </h3>
                <div className="h-64 px-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { day: 'Day 1', points: 100 },
                            { day: 'Day 2', points: 95 },
                            { day: 'Day 3', points: 80 },
                            { day: 'Day 4', points: 75 },
                            { day: 'Day 5', points: 60 },
                            { day: 'Day 6', points: 45 },
                            { day: 'Day 7', points: 40 },
                            { day: 'Day 8', points: 20 },
                            { day: 'Day 9', points: 15 },
                            { day: 'Day 10', points: 5 },
                            { day: 'Day 11', points: 0 }
                        ]}>
                            <defs>
                                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                                itemStyle={{ color: '#c084fc' }}
                            />
                            <Area type="monotone" dataKey="points" name="Remaining Points" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorPoints)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
