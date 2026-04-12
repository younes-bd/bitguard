import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supportService from '../../../core/api/supportService';
import { crmService } from '../../../core/api/crmService';
import {
    Ticket, Users, AlertCircle, Save, X
} from 'lucide-react';

const TicketCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        client: '',
        subject: '',
        description: '',
        priority: 'medium',
        status: 'open'
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await crmService.getClients();
                setClients(Array.isArray(data) ? data : data.results || []);
            } catch (error) {
                console.error("Failed to load clients", error);
            }
        };
        fetchClients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await supportService.createTicket(formData);
            navigate('/admin/support/tickets');
        } catch (error) {
            console.error("Failed to create ticket", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Ticket className="text-teal-400" size={28} />
                        Create Support Ticket
                    </h1>
                    <p className="text-slate-400 text-sm">Log a new issue or request for a managed client.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/support/tickets')}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-xl space-y-6">
                {/* Client Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Select Client *</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-2.5 text-slate-500" size={18} />
                        <select
                            name="client"
                            required
                            value={formData.client}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-teal-500 focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="">-- Choose a Client --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Subject *</label>
                    <div className="relative">
                        <AlertCircle className="absolute left-3 top-2.5 text-slate-500" size={18} />
                        <input
                            type="text"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Brief summary of the issue"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Priority</label>
                    <div className="flex gap-4">
                        {['low', 'medium', 'high'].map(priority => (
                            <label key={priority} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="priority"
                                    value={priority}
                                    checked={formData.priority === priority}
                                    onChange={handleChange}
                                    className="hidden peer"
                                />
                                <div className="px-5 py-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 peer-checked:bg-teal-500/20 peer-checked:text-teal-400 peer-checked:border-teal-500/50 capitalize transition-all">
                                    {priority}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Detailed explanation of the problem..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none resize-none"
                    ></textarea>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-800">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/support/tickets')}
                        className="px-6 py-2 text-slate-400 hover:text-white font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Save size={18} />
                                Create Ticket
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketCreate;
