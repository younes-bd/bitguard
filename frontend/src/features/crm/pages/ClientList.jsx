import React, { useEffect, useState } from 'react';
import { crmService } from '../../../shared/core/services/crmService';
import { Users, Search, Filter, Briefcase, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientList = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await crmService.getClients();
                setClients(Array.isArray(data) ? data : data.results || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="text-blue-400" size={32} />
                        Client Management
                    </h1>
                    <p className="text-slate-400">Manage customer relationships and profiles.</p>
                </div>
                <button
                    onClick={() => navigate('/crm/clients/create')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                    Add Client
                </button>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-sm mb-1 uppercase font-bold">Total Clients</div>
                    <div className="text-3xl font-bold text-white">{clients.length}</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-sm mb-1 uppercase font-bold">Active Contracts</div>
                    <div className="text-3xl font-bold text-emerald-400">--</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-sm mb-1 uppercase font-bold">Pending Tickets</div>
                    <div className="text-3xl font-bold text-yellow-400">--</div>
                </div>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {clients.map(client => (
                    <div
                        key={client.id}
                        onClick={() => navigate(`/crm/clients/${client.id}`)}
                        className="glass-panel p-6 rounded-xl border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/80 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                    {client.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{client.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <Briefcase size={12} />
                                        <span>{client.industry || 'Tech'}</span>
                                    </div>
                                </div>
                            </div>
                            <ExternalLink size={18} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <MapPin size={14} className="text-slate-500" />
                                <span>{client.address && client.address.length > 20 ? client.address.substring(0, 20) + '...' : client.address || 'No Address'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Users size={14} className="text-slate-500" />
                                <span>{client.contact_email}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 mt-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${client.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                {client.status || 'Active'}
                            </span>
                            <span className="text-xs text-slate-500">Joined {new Date(client.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}

                {clients.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No clients found. Start by adding one.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientList;


