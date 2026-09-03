import React, { useState, useEffect } from 'react';
import { Tags, Plus, Trash2, Loader2, Tag } from 'lucide-react';
import documentsService from '../../api/documentsService';

export default function TagManager() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#3B82F6');

    const colors = [
        { name: 'blue', hex: '#3B82F6' },
        { name: 'red', hex: '#EF4444' },
        { name: 'green', hex: '#22C55E' },
        { name: 'yellow', hex: '#EAB308' },
        { name: 'purple', hex: '#A855F7' },
        { name: 'gray', hex: '#6B7280' },
        { name: 'pink', hex: '#EC4899' },
        { name: 'indigo', hex: '#6366F1' }
    ];

    const fetchTags = async () => {
        setLoading(true);
        try {
            const res = await documentsService.getTags();
            setTags(res?.results || res || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await documentsService.createTag({ name, color });
            setName('');
            fetchTags();
        } catch (err) {
            console.error('Failed to create tag', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this tag?")) return;
        try {
            await documentsService.deleteTag(id);
            fetchTags();
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                    <Tags className="text-cyan-500 w-8 h-8" /> 
                    Tag Management
                </h1>
                <p className="text-slate-400 mt-2">Manage metadata tags to categorize your documents dynamically.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                    <h2 className="text-xl font-bold text-white mb-4">New Tag</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Tag Name</label>
                            <input 
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Color</label>
                            <div className="flex flex-wrap gap-2">
                                {colors.map(c => (
                                    <button 
                                        key={c.name} type="button"
                                        onClick={() => setColor(c.hex)}
                                        className={`w-6 h-6 rounded-full border-2 ${color === c.hex ? 'border-white' : 'border-transparent'}`}
                                        style={{ backgroundColor: c.hex }}
                                    ></button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                            <Plus size={18} /> Create Tag
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Existing Tags</h2>
                    {loading ? (
                        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-cyan-500" /></div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {tags.map(t => (
                                <div key={t.id} className="flex items-center gap-2 bg-slate-800 rounded-full pl-3 pr-1 py-1 border border-slate-700">
                                    <Tag size={14} style={{ color: t.color || '#3B82F6' }}/>
                                    <span className="text-white text-sm">{t.name}</span>
                                    <button onClick={() => handleDelete(t.id)} className="text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-full p-1 ml-1">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {tags.length === 0 && <p className="text-slate-500 text-sm">No tags created yet.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
