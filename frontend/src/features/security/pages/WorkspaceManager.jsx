import React, { useState, useEffect } from 'react';
import { platformService } from '../../../shared/core/services/platformService';
import {
    Squares2X2Icon,
    PlusIcon,
    TrashIcon,
    PencilIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const WorkspaceManager = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');

    const fetchWorkspaces = async () => {
        setLoading(true);
        try {
            const data = await platformService.getWorkspaces();
            setWorkspaces(data);
        } catch (error) {
            console.error("Failed to fetch workspaces", error);
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
            await platformService.createWorkspace({ name: newWorkspaceName });
            setNewWorkspaceName('');
            setIsModalOpen(false);
            fetchWorkspaces();
        } catch (error) {
            console.error("Failed to create workspace", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this workspace?")) return;
        try {
            await platformService.deleteWorkspace(id);
            setWorkspaces(prev => prev.filter(w => w.id !== id));
        } catch (error) {
            console.error("Failed to delete workspace", error);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Workspaces</h1>
                    <p className="text-slate-400">Manage client environments and security scopes.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Workspace
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaces.map(workspace => (
                    <div key={workspace.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 group hover:border-indigo-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-700/50 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                <BuildingOfficeIcon className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(workspace.id)}
                                    className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-500"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{workspace.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{workspace.users?.length || 0} Users</span>
                            <span>•</span>
                            <span>{workspace.client ? 'Client Linked' : 'Internal'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Create New Workspace</h2>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="block text-sm text-slate-400 mb-2">Workspace Name</label>
                                <input
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. Finance Sector or Client A"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                                >
                                    Create Workspace
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceManager;
