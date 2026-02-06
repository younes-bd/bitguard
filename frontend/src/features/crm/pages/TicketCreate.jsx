import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmService } from '../../../shared/core/services/crmService';
import {
    Ticket, Users, AlertCircle, MessageSquare, Save, X
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
            await crmService.createTicket(formData);
            navigate('/crm/tickets');
        } catch (error) {
            console.error("Failed to create ticket", error);
            alert("Failed to create ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Ticket className="text-pink-500" size={32} />
                        Create Support Ticket
                    </h1>
                    <p className="text-slate-400">Log a new issue or request for a client.</p>
                </div>
                <button
                    onClick={() => navigate('/crm/tickets')}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-xl border border-slate-700/50 space-y-6">

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
                            className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-pink-500 appearance-none cursor-pointer"
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
                            className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-pink-500"
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
                                <div className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 peer-checked:bg-pink-500 peer-checked:text-white capitalize transition-all border border-transparent peer-checked:shadow-lg peer-checked:shadow-pink-500/20">
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
                        className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-pink-500 resize-none"
                    ></textarea>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-700/50">
                    <button
                        type="button"
                        onClick={() => navigate('/crm/tickets')}
                        className="px-6 py-2 text-slate-400 hover:text-white font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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


