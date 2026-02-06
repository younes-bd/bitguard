import React, { useEffect, useState } from 'react';
import { crmService } from '../../../shared/core/services/crmService';
import { MessageSquare, Calendar, User, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

const InteractionList = () => {
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await crmService.getInteractions();
            setInteractions(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load interactions", error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'call': return <Phone size={16} className="text-blue-400" />;
            case 'email': return <Mail size={16} className="text-purple-400" />;
            case 'meeting': return <User size={16} className="text-emerald-400" />;
            default: return <MessageSquare size={16} className="text-slate-400" />;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <MessageSquare className="text-purple-400" size={32} />
                        Interactions Log
                    </h1>
                    <p className="text-slate-400">History of all client communications.</p>
                </div>
            </div>

            <div className="space-y-4">
                {interactions.map(interaction => (
                    <div key={interaction.id} className="glass-panel p-4 rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-purple-500/30 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                            {getTypeIcon(interaction.interaction_type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-white text-lg truncate">{interaction.summary}</h3>
                                <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 uppercase font-mono">
                                    {interaction.interaction_type}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm line-clamp-2">{interaction.description}</p>

                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <User size={12} />
                                    <span className="text-blue-400 hover:underline cursor-pointer">
                                        {interaction.client_name || 'Unknown Client'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{new Date(interaction.date).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {interactions.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <MessageSquare size={32} />
                        </div>
                        <p className="text-slate-400">No interactions logged yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractionList;


