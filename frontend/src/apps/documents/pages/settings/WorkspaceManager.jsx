import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit3, Loader2 } from 'lucide-react';
import documentsService from '../../api/documentsService';

export default function WorkspaceManager() {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const fetchWorkspaces = async () => {
        setLoading(true);
        try {
            const res = await documentsService.getWorkspaces();
            setWorkspaces(res?.results || res || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await documentsService.createWorkspace({ name, description });
            setName('');
            setDescription('');
            fetchWorkspaces();
        } catch (err) {
            console.error('Failed to create workspace', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this workspace and potentially detach documents?")) return;
        try {
            await documentsService.deleteWorkspace(id);
            fetchWorkspaces();
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    const handleUpdate = async (id) => {
        try {
            await documentsService.updateWorkspace(id, { name: editName, description: editDescription });
            setEditingId(null);
            fetchWorkspaces();
        } catch (err) {
            console.error('Failed to update', err);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                    <Building2 className="text-cyan-500 w-8 h-8" /> 
                    Workspace Folders
                </h1>
                <p className="text-slate-400 mt-2">Manage the top-level vaults and folders for your enterprise.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                    <h2 className="text-xl font-bold text-white mb-4">New Workspace</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Name</label>
                            <input 
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Description</label>
                            <textarea 
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                                rows="3"
                            />
                        </div>
                        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                            <Plus size={18} /> Create Workspace
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-cyan-500" /></div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Workspace Name</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {workspaces.map(ws => (
                                    <tr key={ws.id} className="hover:bg-slate-800/50">
                                        <td className="p-4">
                                            {editingId === ws.id ? (
                                                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 text-sm focus:outline-none" />
                                            ) : (
                                                <span className="text-white font-medium">{ws.name}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingId === ws.id ? (
                                                <input value={editDescription} onChange={e => setEditDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 text-sm focus:outline-none" />
                                            ) : (
                                                <span className="text-slate-400 text-sm">{ws.description || '-'}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {editingId === ws.id ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white text-sm">Cancel</button>
                                                    <button onClick={() => handleUpdate(ws.id)} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">Save</button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => { setEditingId(ws.id); setEditName(ws.name); setEditDescription(ws.description || ''); }} className="text-slate-400 hover:bg-slate-700 p-2 rounded transition-colors">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(ws.id)} className="text-red-400 hover:bg-red-400/10 p-2 rounded transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {workspaces.length === 0 && (
                                    <tr><td colSpan="3" className="p-6 text-center text-slate-500">No workspaces found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
