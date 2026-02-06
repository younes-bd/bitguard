import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, DollarSign } from 'lucide-react';

const ContractModal = ({ isOpen, onClose, onSave, contract = null, clients = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        start_date: '',
        end_date: '',
        value: '',
        status: 'active'
    });

    useEffect(() => {
        if (contract) {
            setFormData({
                name: contract.name || '',
                client: contract.client || '',
                start_date: contract.start_date || '',
                end_date: contract.end_date || '',
                value: contract.value || '',
                status: contract.status || 'active'
            });
        } else {
            setFormData({
                name: '',
                client: clients.length > 0 ? clients[0].id : '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                value: '',
                status: 'active'
            });
        }
    }, [contract, clients, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-800/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="text-indigo-500" size={24} />
                        {contract ? 'Edit Contract' : 'New Contract'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Contract Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Annual Service Agreement"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Client & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Client <span className="text-red-500">*</span></label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select Client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-3.5 text-slate-500" />
                                <input
                                    type="date"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-3.5 text-slate-500" />
                                <input
                                    type="date"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Value */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Total Value ($)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-3.5 text-slate-500" />
                            <input
                                type="number"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0.00"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-600/20"
                        >
                            {contract ? 'Save Contract' : 'Create Contract'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ContractModal;


