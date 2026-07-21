import React, { useState, useEffect } from 'react';
import { Layout, Plus, Edit2, Trash2, Loader2, X, Save, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import discussService from '../../../../core/api/discussService';

export default function LiveChatChannels() {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingChannel, setEditingChannel] = useState(null);
    const [form, setForm] = useState({ name: '', welcome_message: '', button_text: '', button_color: '#3b82f6' });

    const loadChannels = async () => {
        try {
            const data = await discussService.getLiveChatChannels();
            setChannels(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            toast.error("Failed to load live chat channels");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadChannels(); }, []);

    const openModal = (channel = null) => {
        setEditingChannel(channel);
        setForm(channel ? {
            name: channel.name,
            welcome_message: channel.welcome_message,
            button_text: channel.button_text,
            button_color: channel.button_color || '#3b82f6'
        } : { name: '', welcome_message: 'How can we help you?', button_text: 'Chat with us', button_color: '#3b82f6' });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingChannel) {
                await discussService.updateLiveChatChannel(editingChannel.id, form);
                toast.success('Channel updated');
            } else {
                await discussService.createLiveChatChannel(form);
                toast.success('Channel created');
            }
            setIsModalOpen(false);
            loadChannels();
        } catch (err) {
            toast.error("Failed to save channel");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this channel?")) return;
        try {
            await discussService.deleteLiveChatChannel(id);
            toast.success("Channel deleted");
            loadChannels();
        } catch (err) {
            toast.error("Failed to delete channel");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <MessageCircle className="text-rose-400" size={28} /> Live Chat Channels
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage live chat widgets and configurations</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95">
                    <Plus size={18} /> New Channel
                </button>
            </div>

            {channels.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500 bg-slate-900/50">
                    <MessageCircle size={40} className="mx-auto mb-3 text-slate-700" />
                    <p className="font-bold text-slate-400">No Channels Found</p>
                    <p className="text-sm mt-1">Click "New Channel" to create your first widget.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {channels.map(channel => (
                        <div key={channel.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-rose-500/50 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={() => openModal(channel)} className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(channel.id)} className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: channel.button_color || '#3b82f6' }}>
                                    <MessageCircle className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{channel.name}</h3>
                                    <p className="text-xs text-slate-500">ID: {channel.id}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-500">Button Text:</span>
                                    <span className="text-slate-300 font-medium">{channel.button_text || 'Chat with us'}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-slate-500">Welcome Msg:</span>
                                    <span className="text-slate-300 font-medium truncate max-w-[150px]">{channel.welcome_message || 'None'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-6 font-['Oswald'] tracking-wider uppercase">
                            {editingChannel ? 'Edit Channel' : 'New Channel'}
                        </h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Channel Name</label>
                                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="e.g., General Support" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Welcome Message</label>
                                <input value={form.welcome_message} onChange={e => setForm({...form, welcome_message: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="e.g., Hello! How can we help you today?" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Button Text</label>
                                    <input value={form.button_text} onChange={e => setForm({...form, button_text: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="Chat with us" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Button Color</label>
                                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2">
                                        <input type="color" value={form.button_color} onChange={e => setForm({...form, button_color: e.target.value})} className="w-8 h-8 rounded border-none bg-transparent cursor-pointer" />
                                        <input type="text" value={form.button_color} onChange={e => setForm({...form, button_color: e.target.value})} className="w-full bg-transparent text-white focus:outline-none text-sm" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {saving ? 'Saving...' : 'Save Channel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
