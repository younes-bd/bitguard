import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Loader2 } from 'lucide-react';
import helpdeskService from '../../api/helpdeskService';

const TicketTags = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', color: '#6b7280' });

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        setLoading(true);
        try {
            const data = await helpdeskService.getTags();
            setTags(data.results || data);
        } catch (error) {
            console.error('Failed to load tags:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await helpdeskService.createTag(formData);
            setIsModalOpen(false);
            setFormData({ name: '', color: '#6b7280' });
            loadTags();
        } catch (error) {
            console.error('Failed to create tag:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tag?')) return;
        try {
            await helpdeskService.deleteTag(id);
            loadTags();
        } catch (error) {
            console.error('Failed to delete tag:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Tag className="text-pink-400" size={28} /> Ticket Tags
                    </h1>
                    <p className="text-slate-400">Manage tags for categorizing support tickets.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} /> Add Tag
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-pink-400" size={32} /></div>
                ) : tags.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Tag size={48} className="mx-auto mb-4 text-slate-700" />
                        <p className="text-lg">No tags configured.</p>
                        <p className="text-sm mt-2">Use tags to quickly filter and identify tickets.</p>
                    </div>
                ) : (
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {tags.map(tag => (
                            <div key={tag.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color || '#6b7280' }}></div>
                                    <span className="text-white text-sm font-medium">{tag.name}</span>
                                </div>
                                <button onClick={() => handleDelete(tag.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Create Tag</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Tag Name</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Color</label>
                                <div className="flex gap-2 items-center">
                                    <input 
                                        type="color" 
                                        className="h-10 w-10 rounded border border-slate-700 bg-slate-800"
                                        value={formData.color}
                                        onChange={e => setFormData({...formData, color: e.target.value})}
                                    />
                                    <span className="text-slate-300 font-mono text-sm">{formData.color}</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors">Save Tag</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketTags;
