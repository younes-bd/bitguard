import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Lock, X } from 'lucide-react';
import { systemParameterService } from '../../../../core/api/systemParameterService';
import toast from 'react-hot-toast';

export default function SystemParametersPage() {
    const [parameters, setParameters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParam, setEditingParam] = useState(null);
    const [form, setForm] = useState({ key: '', value: '', description: '' });

    const fetchParameters = async () => {
        setLoading(true);
        try {
            const data = await systemParameterService.getParameters();
            setParameters(data);
        } catch (error) {
            toast.error('Failed to load system parameters');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParameters();
    }, []);

    const openModal = (param = null) => {
        if (param) {
            setEditingParam(param);
            setForm({ key: param.key, value: param.value, description: param.description || '' });
        } else {
            setEditingParam(null);
            setForm({ key: '', value: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingParam(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingParam) {
                await systemParameterService.updateParameter(editingParam.id, form);
                toast.success('System parameter updated successfully');
            } else {
                await systemParameterService.createParameter(form);
                toast.success('System parameter created successfully');
            }
            closeModal();
            fetchParameters();
        } catch (error) {
            toast.error('Failed to save system parameter. Check if key is unique.');
        }
    };

    const handleDelete = async (param) => {
        if (param.is_system) {
            toast.error("Cannot delete a system-required parameter");
            return;
        }
        if (window.confirm(`Are you sure you want to delete parameter: ${param.key}?`)) {
            try {
                await systemParameterService.deleteParameter(param.id);
                toast.success('Parameter deleted successfully');
                fetchParameters();
            } catch (error) {
                toast.error('Failed to delete system parameter');
            }
        }
    };

    const filteredParams = parameters.filter(p =>
        p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">System Parameters</h1>
                    <p className="text-slate-400">Manage low-level system configuration overrides.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} />
                    <span>New Parameter</span>
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search parameters..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Key</th>
                                <th className="p-4 font-medium">Value</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-slate-300">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">Loading parameters...</td>
                                </tr>
                            ) : filteredParams.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No system parameters found.</td>
                                </tr>
                            ) : (
                                filteredParams.map((param) => (
                                    <tr key={param.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4 font-mono text-sm text-white">{param.key}</td>
                                        <td className="p-4">
                                            <span className="bg-slate-950 px-2 py-1 rounded text-sm border border-slate-800 break-all">{param.value}</span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">{param.description || '-'}</td>
                                        <td className="p-4">
                                            {param.is_system ? (
                                                <span className="flex items-center space-x-1 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full w-max">
                                                    <Lock size={12} />
                                                    <span>System</span>
                                                </span>
                                            ) : (
                                                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full w-max">
                                                    Custom
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => openModal(param)}
                                                    className="text-slate-400 hover:text-blue-400 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(param)}
                                                    className={`transition-colors ${param.is_system ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-400'}`}
                                                    title={param.is_system ? "Cannot delete system parameter" : "Delete"}
                                                    disabled={param.is_system}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white">
                                {editingParam ? 'Edit Parameter' : 'New Parameter'}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Parameter Key</label>
                                <input
                                    type="text"
                                    required
                                    value={form.key}
                                    onChange={e => setForm({...form, key: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                                    placeholder="e.g. web.base.url"
                                    disabled={editingParam?.is_system}
                                />
                                {editingParam?.is_system && (
                                    <p className="text-xs text-amber-500 mt-1 flex items-center space-x-1">
                                        <Lock size={12} /><span>System keys cannot be renamed.</span>
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Value</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={form.value}
                                    onChange={e => setForm({...form, value: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Parameter value..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="What this parameter does..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20 font-medium"
                                >
                                    {editingParam ? 'Save Changes' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
