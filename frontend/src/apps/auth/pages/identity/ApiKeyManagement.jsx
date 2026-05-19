import React, { useState, useEffect } from 'react';
import { Terminal, Plus, Trash2, Key, Copy, CheckCircle, Clock, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { iamService } from '../../../../core/api/iamService';
import { toast } from 'react-hot-toast';

const ApiKeyManagement = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [creating, setCreating] = useState(false);
    const [generatedKey, setGeneratedKey] = useState(null);

    useEffect(() => {
        loadKeys();
    }, []);

    const loadKeys = async () => {
        try {
            const data = await iamService.getApiKeys();
            setKeys(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load API keys", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) {
            toast.error("Please enter a name for the key");
            return;
        }
        setCreating(true);
        try {
            const data = await iamService.createApiKey(newKeyName);
            setGeneratedKey(data);
            setNewKeyName('');
            loadKeys();
        } catch (error) {
            toast.error("Failed to create API key");
        } finally {
            setCreating(false);
        }
    };

    const handleRevokeKey = async (id) => {
        if (!window.confirm("Are you sure you want to revoke this API key? This action is permanent and will break any integrations using it.")) return;
        try {
            await iamService.revokeApiKey(id);
            toast.success("API Key Revoked");
            loadKeys();
        } catch (error) {
            toast.error("Failed to revoke API key");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Key copied to clipboard");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                <p className="text-slate-500 font-mono text-sm">Accessing Keystore...</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Terminal size={32} className="text-purple-500" />
                        Programmatic Access
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage API credentials for service accounts and automated system integrations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
                        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Credentials</h3>
                            <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded font-black">{keys.length} Keys Enrolled</span>
                        </div>
                        <div className="divide-y divide-slate-800/50">
                            {keys.length > 0 ? keys.map(key => (
                                <div key={key.id} className="p-6 flex items-center justify-between hover:bg-slate-800/20 transition-all group">
                                    <div className="flex gap-4 items-center">
                                        <div className="p-3 bg-slate-800 rounded-2xl text-slate-400 group-hover:text-purple-400 transition-colors">
                                            <Key size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">{key.name}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-xs font-mono text-slate-500">{key.key_prefix}</p>
                                                <span className="text-slate-700">|</span>
                                                <p className="text-[10px] text-slate-600 flex items-center gap-1">
                                                    <Clock size={10} /> {key.last_used ? `Last used ${new Date(key.last_used).toLocaleDateString()}` : 'Never used'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleRevokeKey(key.id)}
                                        className="p-3 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                                        title="Revoke Key"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )) : (
                                <div className="p-16 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto opacity-20">
                                        <Terminal size={32} />
                                    </div>
                                    <p className="text-slate-500 text-sm">No active API credentials found for this account.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-white font-bold">Issue New Credential</h4>
                            <p className="text-slate-400 text-xs">Generate a new API key for system-level access.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Description</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. CI/CD Pipeline"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={handleCreateKey}
                                disabled={creating || !newKeyName.trim()}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {creating ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                                Provision Key
                            </button>
                        </div>

                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
                            <AlertCircle size={18} className="text-amber-500 shrink-0" />
                            <p className="text-[11px] text-amber-200/70 leading-relaxed">
                                API keys provide full administrative access. Store them securely and never share them in public repositories.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Key Modal */}
            {generatedKey && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-purple-500/30 w-full max-w-lg rounded-3xl p-8 space-y-6 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">API Key Provisioned</h2>
                            <p className="text-slate-400 text-sm">Copy your key now. For security, it will never be shown again.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Your Private Key</label>
                                <div className="flex gap-3">
                                    <div className="flex-1 font-mono text-purple-400 break-all text-sm py-1">
                                        {generatedKey.key}
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(generatedKey.key)}
                                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-colors shrink-0 h-fit"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={() => setGeneratedKey(null)}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
                            >
                                I've Stored It Securely
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeyManagement;
