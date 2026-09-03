import React, { useState, useEffect } from 'react';
import { Bot, Activity, CheckCircle2, XCircle, Loader2, Play, Users, BarChart3, AlertTriangle, Plus, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { aiAgentService } from '../../api/aiAgentService';

export default function AgentDashboard() {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [promptInput, setPromptInput] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedAgent) {
            loadLogs(selectedAgent.id);
        }
    }, [selectedAgent?.id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [agentsRes, statsRes] = await Promise.all([
                aiAgentService.getAgents(),
                aiAgentService.getStats()
            ]);
            const agentList = agentsRes.data?.results || agentsRes.data || [];
            setAgents(agentList);
            setStats(statsRes.data);
            if (agentList.length > 0 && !selectedAgent) {
                setSelectedAgent(agentList[0]);
            }
        } catch (error) {
            toast.error('Failed to load agents');
        } finally {
            setLoading(false);
        }
    };

    const loadLogs = async (agentId) => {
        try {
            const res = await aiAgentService.getAgentLogs(agentId);
            setLogs(res.data?.results || res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRun = async () => {
        if (!promptInput.trim()) return toast.error('Enter a prompt first');
        setRunning(true);
        try {
            await aiAgentService.runAgent(selectedAgent.id, promptInput);
            toast.success('Agent triggered successfully');
            setPromptInput('');
            setTimeout(() => loadLogs(selectedAgent.id), 2000);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to trigger agent');
        } finally {
            setRunning(false);
        }
    };

    const toggleStatus = async (agent) => {
        try {
            await aiAgentService.updateAgent(agent.id, { is_active: !agent.is_active });
            toast.success(agent.is_active ? 'Agent paused' : 'Agent activated');
            loadData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading && agents.length === 0) {
        return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
    }

    return (
        <div className="h-full bg-slate-950 flex flex-col font-sans text-slate-200">
            {/* KPI Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-900 border-b border-slate-800 shrink-0">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3 text-slate-400 mb-2"><Users className="w-4 h-4 text-blue-500" /> Total Agents</div>
                    <div className="text-2xl font-bold text-white">{stats?.total_agents || 0}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3 text-slate-400 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Active Now</div>
                    <div className="text-2xl font-bold text-white">{stats?.active_agents || 0}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3 text-slate-400 mb-2"><Activity className="w-4 h-4 text-purple-500" /> Runs Today</div>
                    <div className="text-2xl font-bold text-white">{stats?.runs_today || 0}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3 text-slate-400 mb-2"><BarChart3 className="w-4 h-4 text-yellow-500" /> Success Rate</div>
                    <div className="text-2xl font-bold text-white">{stats?.success_rate || 0}%</div>
                </div>
            </div>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                        <h2 className="font-semibold text-white">Roster</h2>
                        <button 
                            onClick={() => navigate('/admin/ai_agent/agents/new')}
                            className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-2">
                        {agents.map(agent => (
                            <button 
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent)}
                                className={`w-full text-left p-3 rounded-lg mb-1 flex items-center justify-between transition-colors ${selectedAgent?.id === agent.id ? 'bg-slate-800 border-l-2 border-purple-500' : 'hover:bg-slate-800/50 border-l-2 border-transparent'}`}
                            >
                                <div>
                                    <div className="font-medium text-white truncate max-w-[180px]">{agent.name}</div>
                                    <div className="text-xs text-slate-400 capitalize">{agent.role}</div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${agent.is_active ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Pane */}
                <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 bg-slate-950">
                    {selectedAgent ? (
                        <div className="max-w-5xl mx-auto w-full space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between bg-slate-900 p-6 rounded-xl border border-slate-800">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">{selectedAgent.name}</h1>
                                    <p className="text-slate-400">Model: <span className="text-purple-400">{selectedAgent.model || 'gpt-4o-mini'}</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => navigate(`/admin/ai_agent/agents/${selectedAgent.id}`)}
                                        className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => toggleStatus(selectedAgent)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedAgent.is_active ? 'bg-slate-800 text-slate-300 hover:text-red-400' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                                    >
                                        {selectedAgent.is_active ? 'Pause Agent' : 'Activate Agent'}
                                    </button>
                                </div>
                            </div>

                            {/* Run Trigger */}
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                <h3 className="text-lg font-semibold text-white mb-4">Manual Trigger</h3>
                                <div className="flex gap-3">
                                    <input 
                                        type="text" 
                                        value={promptInput}
                                        onChange={e => setPromptInput(e.target.value)}
                                        placeholder="Enter a prompt to test the agent..."
                                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    />
                                    <button 
                                        onClick={handleRun}
                                        disabled={running}
                                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                        Run
                                    </button>
                                </div>
                            </div>

                            {/* System Prompt & Tools */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col">
                                    <h3 className="text-lg font-semibold text-white mb-4">System Prompt</h3>
                                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 flex-1 overflow-y-auto max-h-48">
                                        {selectedAgent.system_prompt}
                                    </div>
                                </div>
                                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                    <h3 className="text-lg font-semibold text-white mb-4">Allowed Tools</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAgent.allowed_tools?.map((tool, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700">
                                                {tool}
                                            </span>
                                        ))}
                                        {(!selectedAgent.allowed_tools || selectedAgent.allowed_tools.length === 0) && (
                                            <span className="text-slate-500 italic">No tools configured</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Execution Logs */}
                            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-purple-500" /> Recent Executions
                                    </h3>
                                    <button onClick={() => loadLogs(selectedAgent.id)} className="text-slate-400 hover:text-white transition-colors">
                                        Refresh
                                    </button>
                                </div>
                                <div className="divide-y divide-slate-800">
                                    {logs.length > 0 ? logs.map(log => (
                                        <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    {log.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : 
                                                     log.status === 'escalated' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> :
                                                     <XCircle className="w-5 h-5 text-red-500" />}
                                                    <span className="text-slate-300 font-medium truncate max-w-md">{log.user_input || 'No input prompt'}</span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="pl-8 mt-2 space-y-3">
                                                {log.thoughts && (
                                                    <div className="text-sm text-slate-400 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs max-h-32 overflow-y-auto">
                                                        <span className="text-blue-400 block mb-1 font-sans font-medium">Thoughts:</span>
                                                        {log.thoughts}
                                                    </div>
                                                )}
                                                {log.final_output && (
                                                    <div className="text-sm text-slate-300 p-3 bg-slate-950 rounded-lg border border-slate-800">
                                                        <span className="text-emerald-400 block mb-1 text-xs font-semibold">Final Output:</span>
                                                        {log.final_output}
                                                    </div>
                                                )}
                                                <div className="flex gap-4 text-xs text-slate-500 font-medium">
                                                    <span>{log.duration_ms}ms</span>
                                                    <span>{log.tokens_used} tokens</span>
                                                    <span>Trigger: {log.triggered_by}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-slate-500">
                                            No execution logs found for this agent.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <Bot className="w-16 h-16 mb-4 text-slate-700" />
                            <h2 className="text-xl font-medium text-slate-300">Select an Agent</h2>
                            <p>Manage your autonomous virtual employees</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
