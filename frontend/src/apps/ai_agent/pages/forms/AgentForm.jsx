import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bot, Save, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAgentService } from '../../api/aiAgentService';

export default function AgentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        is_active: true,
        system_prompt: '',
        allowed_tools: ''
    });

    useEffect(() => {
        if (isEditing) {
            loadAgent();
        }
    }, [id]);

    const loadAgent = async () => {
        try {
            const res = await aiAgentService.getAgent(id);
            const data = res.data;
            setFormData({
                name: data.name || '',
                role: data.role || '',
                is_active: data.is_active,
                system_prompt: data.system_prompt || '',
                allowed_tools: Array.isArray(data.allowed_tools) ? data.allowed_tools.join(', ') : ''
            });
        } catch (error) {
            toast.error('Failed to load agent');
            navigate('/admin/ai_agent/agents');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        const payload = {
            ...formData,
            allowed_tools: formData.allowed_tools.split(',').map(s => s.trim()).filter(Boolean)
        };

        try {
            if (isEditing) {
                await aiAgentService.updateAgent(id, payload);
                toast.success('Agent updated successfully');
            } else {
                await aiAgentService.createAgent(payload);
                toast.success('Agent created successfully');
            }
            navigate('/admin/ai_agent/agents');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save agent');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto font-sans text-slate-200">
            <button 
                onClick={() => navigate('/admin/ai_agent/agents')}
                className="flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Bot className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Agent' : 'Hire Virtual Employee'}</h1>
                        <p className="text-slate-400">Configure your autonomous AI agent's behavior and access permissions.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Agent Name</label>
                            <input 
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Sales SDR"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Role Module</label>
                            <input 
                                required
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g. crm, helpdesk, sales"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">System Prompt (Instructions)</label>
                        <textarea 
                            required
                            name="system_prompt"
                            value={formData.system_prompt}
                            onChange={handleChange}
                            rows="6"
                            placeholder="You are a helpful customer support agent. Your goal is to..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <p className="text-xs text-slate-500 mt-2">These instructions dictate how the AI will behave. Be specific.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Allowed Tools (comma separated)</label>
                        <input 
                            name="allowed_tools"
                            value={formData.allowed_tools}
                            onChange={handleChange}
                            placeholder="e.g. read_ticket, escalate_to_human, create_lead"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <p className="text-xs text-slate-500 mt-2">The exact python function names registered in the tool registry that this agent can use.</p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="is_active"
                                checked={formData.is_active} 
                                onChange={handleChange} 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                        <span className="text-sm font-medium text-slate-300">Agent is Active</span>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => navigate('/admin/ai_agent/agents')}
                            className="px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isEditing ? 'Save Changes' : 'Hire Agent'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
