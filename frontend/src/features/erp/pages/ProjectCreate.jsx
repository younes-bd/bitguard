import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../shared/core/services/erpService';
import { crmService } from '../../../shared/core/services/crmService';
import { Save, ArrowLeft, Users, DollarSign, Briefcase } from 'lucide-react';

const ProjectCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Dropdown Data
    const [clients, setClients] = useState([]);
    const [managers, setManagers] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        client: '',
        manager: '',
        status: 'planning',
        start_date: new Date().toISOString().split('T')[0],
        deadline: '',
        revenue: 0,
        budget_cost: 0,
        description: '',
        service_type: 'consulting' // Default
    });

    useEffect(() => {
        fetchDropdowns();
    }, []);

    const fetchDropdowns = async () => {
        try {
            const [clientsData, employeesData] = await Promise.all([
                crmService.getClients(),
                erpService.getEmployees()
            ]);
            setClients(Array.isArray(clientsData) ? clientsData : clientsData.results || []);
            setManagers(Array.isArray(employeesData) ? employeesData : employeesData.results || []);
        } catch (error) {
            console.error("Failed to load form data", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newProject = await erpService.createProject(formData);
            navigate(`/erp/projects/${newProject.id}`);
        } catch (error) {
            console.error("Create failed", error);
            alert("Failed to create project. Please stick with standard fields.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/erp/projects')}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create New Project</h1>
                    <p className="text-slate-400">Launch a new engagement</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Info */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                        <Briefcase size={20} />
                        <h3 className="font-semibold text-white">Project Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Project Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Client</label>
                            <select
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                required
                            >
                                <option value="">Select Client</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Team & Timeline */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-4 text-purple-400">
                        <Users size={20} />
                        <h3 className="font-semibold text-white">Team & Timeline</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Project Manager</label>
                            <select
                                name="manager"
                                value={formData.manager}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                            >
                                <option value="">Select Manager</option>
                                {managers.map(m => (
                                    <option key={m.id} value={m.user}>{m.username}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                            >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="on_hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Financials */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                        <DollarSign size={20} />
                        <h3 className="font-semibold text-white">Financials</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Estimated Revenue ($)</label>
                            <input
                                type="number"
                                name="revenue"
                                value={formData.revenue}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Budget Cost ($)</label>
                            <input
                                type="number"
                                name="budget_cost"
                                value={formData.budget_cost}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/erp/projects')}
                        className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/20 transition-colors flex items-center gap-2"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Save size={18} />
                                Create Project
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ProjectCreate;


