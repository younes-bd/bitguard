import React, { useEffect, useState } from 'react';
import { crmService } from '../../../core/api/crmService';
import client from '../../../core/api/client';
import { MessageSquare, Calendar, User, Phone, Mail, Clock, ArrowRight, Plus, Edit2, Trash2 } from 'lucide-react';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const INTERACTION_FIELDS = [
    { name: 'client', label: 'Client ID', type: 'number', required: true },
    { name: 'interaction_type', label: 'Type', type: 'select', options: [
        { value: 'call', label: 'Call' },
        { value: 'email', label: 'Email' },
        { value: 'meeting', label: 'Meeting' }
    ]},
    { name: 'summary', label: 'Summary', required: true },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { name: 'date', label: 'Date', type: 'datetime-local' }
];

const InteractionList = () => {
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await crmService.getInteractions();
            setInteractions(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load interactions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedItem) {
                await client.put(`crm/interactions/${selectedItem.id}/`, formData);
                toast.success('Interaction updated');
            } else {
                await client.post('crm/interactions/', formData);
                toast.success('Interaction logged');
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save interaction');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await client.delete(`crm/interactions/${selectedItem.id}/`);
            toast.success('Interaction deleted');
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete interaction');
        } finally {
            setActionLoading(false);
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
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
                    <p className="text-slate-400 mt-1">History of all client communications.</p>
                </div>
                <button 
                    onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Log Interaction
                </button>
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
                        
                        <div className="flex justify-end gap-3 md:ml-auto">
                            <button onClick={() => { setSelectedItem(interaction); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => { setSelectedItem(interaction); setIsDeleteModalOpen(true); }} className="p-2 text-rose-400 hover:text-rose-300 transition-colors"><Trash2 size={16} /></button>
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

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
                title={selectedItem ? "Edit Interaction" : "Log Interaction"}
                fields={INTERACTION_FIELDS}
                initialData={selectedItem}
                onSubmit={handleSave}
                loading={actionLoading}
            />
            
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }}
                onConfirm={handleDelete}
                loading={actionLoading}
                title="Delete Interaction"
                message={`Are you sure you want to delete this interaction?`}
            />
        </div>
    );
};

export default InteractionList;



