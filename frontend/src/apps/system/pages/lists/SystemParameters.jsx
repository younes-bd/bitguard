import React, { useState, useEffect } from 'react';
import { settingsService } from '../../api/settingsService';
import { Settings, Plus, Loader2, Edit, Trash2, Search, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SystemParameters = () => {
    const [parameters, setParameters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({ key: '', value: '' });

    const loadParams = async () => {
        setLoading(true);
        try {
            const res = await settingsService.getSettings();
            setParameters(Array.isArray(res.data) ? res.data : (res.data?.results || []));
        } catch (err) {
            toast.error("Failed to load parameters");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadParams(); }, []);

    const handleSave = async () => {
        if (!editForm.key) return;
        try {
            if (editing === 'new') {
                // Mock endpoint doesn't strictly have a "create" endpoint, usually it's update.
                // Assuming updateSetting will create if it doesn't exist, or we use batch update.
                await settingsService.updateSetting(editForm.key, { value: editForm.value });
            } else {
                await settingsService.updateSetting(editForm.key, { value: editForm.value });
            }
            toast.success("Parameter saved");
            setEditing(null);
            loadParams();
        } catch (err) {
            toast.error("Failed to save parameter");
        }
    };

    const filtered = parameters.filter(p => p.key.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-8 max-w-7xl mx-auto text-slate-200">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Settings size={24} className="text-blue-500" />
                        System Parameters
                    </h1>
                    <p className="text-slate-400">Advanced key-value configuration.</p>
                </div>
                <button 
                    onClick={() => { setEditing('new'); setEditForm({ key: '', value: '' }); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-semibold"
                >
                    <Plus size={18} /> New Parameter
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                    <Search size={18} className="text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search keys..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-white w-full placeholder:text-slate-600"
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Key</th>
                                <th className="px-6 py-4 font-medium">Value</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {editing === 'new' && (
                                <tr className="bg-slate-800/50">
                                    <td className="px-6 py-3">
                                        <input 
                                            type="text" 
                                            value={editForm.key}
                                            onChange={e => setEditForm({...editForm, key: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                            placeholder="system.config.key"
                                        />
                                    </td>
                                    <td className="px-6 py-3">
                                        <input 
                                            type="text" 
                                            value={editForm.value}
                                            onChange={e => setEditForm({...editForm, value: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                            placeholder="value"
                                        />
                                    </td>
                                    <td className="px-6 py-3 text-right space-x-2">
                                        <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300"><Save size={18} /></button>
                                        <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                                    </td>
                                </tr>
                            )}
                            {filtered.map(p => (
                                <tr key={p.key} className="hover:bg-slate-800/20">
                                    <td className="px-6 py-4 font-mono text-sm">{p.key}</td>
                                    <td className="px-6 py-4">
                                        {editing === p.key ? (
                                            <input 
                                                type="text" 
                                                value={editForm.value}
                                                onChange={e => setEditForm({...editForm, value: e.target.value})}
                                                className="w-full bg-slate-950 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <span className="font-mono text-sm text-slate-300">{p.value === null ? 'null' : String(p.value)}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editing === p.key ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300 p-1"><Save size={18} /></button>
                                                <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-white p-1"><X size={18} /></button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => { setEditing(p.key); setEditForm({ key: p.key, value: p.value }); }} className="text-slate-500 hover:text-blue-400 p-1"><Edit size={16} /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && editing !== 'new' && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                        No system parameters found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SystemParameters;
