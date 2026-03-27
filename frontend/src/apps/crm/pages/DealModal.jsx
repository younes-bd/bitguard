import React, { useState, useEffect } from 'react';
import { X, DollarSign, Briefcase, Calendar } from 'lucide-react';

const STAGES = [
    { key: 'new', label: 'New Opportunity' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'proposal', label: 'Proposal Sent' },
    { key: 'negotiation', label: 'Negotiation' },
    { key: 'won', label: 'Closed Won' },
    { key: 'lost', label: 'Closed Lost' }
];

const DealModal = ({ isOpen, onClose, onSave, deal = null, clients = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        value: '',
        stage: 'new',
        expected_close_date: ''
    });

    useEffect(() => {
        if (deal) {
            setFormData({
                name: deal.name,
                client: deal.client,
                value: deal.value,
                stage: deal.stage,
                expected_close_date: deal.expected_close_date || ''
            });
        } else {
            setFormData({
                name: '',
                client: clients.length > 0 ? clients[0].id : '',
                value: '',
                stage: 'new',
                expected_close_date: ''
            });
        }
    }, [deal, clients, isOpen]);

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
                        <Briefcase className="text-blue-500" size={24} />
                        {deal ? 'Edit Deal' : 'New Deal'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Deal Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Acme Corp Migration"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Client & Value Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Client <span className="text-red-500">*</span></label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <label className="block text-sm font-medium text-slate-400 mb-1">Value ($)</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-3.5 text-slate-500" />
                                <input
                                    type="number"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stage & Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Stage</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.stage}
                                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                            >
                                {STAGES.map(stage => (
                                    <option key={stage.key} value={stage.key}>{stage.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Target Close Date</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-3.5 text-slate-500" />
                                <input
                                    type="date"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.expected_close_date}
                                    onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                                />
                            </div>
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
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-600/20"
                        >
                            {deal ? 'Save Changes' : 'Create Deal'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default DealModal;


