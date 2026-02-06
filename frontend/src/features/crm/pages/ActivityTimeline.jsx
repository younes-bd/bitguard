import React, { useState } from 'react';
import { crmService } from '../../../shared/core/services/crmService';
import { Phone, Mail, Users, FileText, Send, Plus } from 'lucide-react';

const ActivityTimeline = ({ clientId, interactions, onActivityAdded }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        setIsSubmitting(true);
        try {
            await crmService.createInteraction({
                client: clientId,
                interaction_type: 'note',
                summary: 'New Note',
                description: newNote
            });
            setNewNote('');
            setIsAdding(false);
            if (onActivityAdded) onActivityAdded();
        } catch (error) {
            console.error("Failed to add note", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'call': return <Phone size={14} className="text-blue-400" />;
            case 'email': return <Mail size={14} className="text-purple-400" />;
            case 'meeting': return <Users size={14} className="text-emerald-400" />;
            default: return <FileText size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Activity Timeline</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                >
                    <Plus size={16} /> Add Note
                </button>
            </div>

            {/* Quick Add Note */}
            {isAdding && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 mb-6 animate-fade-in-down">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Write a note..."
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white text-sm focus:ring-1 focus:ring-blue-500 mb-2 min-h-[80px]"
                        ></textarea>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded flex items-center gap-1"
                            >
                                <Send size={12} /> Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Timeline Stream */}
            <div className="relative border-l border-slate-700/50 ml-3 space-y-6 pl-6 pb-2">
                {interactions.map((item) => (
                    <div key={item.id} className="relative">
                        <div className="absolute -left-[30px] top-0 w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                            {getIcon(item.interaction_type)}
                        </div>

                        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-slate-200 text-sm capitalize">
                                    {item.interaction_type === 'note' ? 'Internal Note' : `${item.interaction_type} Logged`}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                                {item.description || item.summary}
                            </p>
                            <div className="mt-2 text-xs text-slate-600 font-medium">
                                By {item.user_name || 'System'}
                            </div>
                        </div>
                    </div>
                ))}

                {interactions.length === 0 && (
                    <div className="text-slate-500 text-sm italic py-4">
                        No activities recorded yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityTimeline;


