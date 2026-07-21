import React, { useState, useEffect } from 'react';
import { Globe, Plus, CheckCircle2, XCircle, Search, Languages as LanguagesIcon, Edit, X } from 'lucide-react';
import { settingsService } from '../../api/settingsService';
import toast from 'react-hot-toast';

export default function Languages() {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [form, setForm] = useState({
        name: '',
        code: '',
        direction: 'ltr',
        is_active: true
    });

    const fetchLanguages = async () => {
        setLoading(true);
        try {
            const res = await settingsService.getLanguages();
            setLanguages(res.data?.results || res.data || []);
        } catch (error) {
            console.error("Failed to fetch languages", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    const toggleLanguage = async (language) => {
        if (language.is_default) {
            toast.error("Cannot deactivate the default language.");
            return;
        }
        try {
            await settingsService.updateLanguage(language.id, { is_active: !language.is_active });
            setLanguages(languages.map(l => l.id === language.id ? { ...l, is_active: !l.is_active } : l));
            toast.success('Language updated');
        } catch (error) {
            toast.error('Failed to toggle language');
        }
    };

    const setDefault = async (languageId) => {
        try {
            await settingsService.setDefaultLanguage(languageId);
            toast.success('Default language updated!');
            fetchLanguages();
        } catch (error) {
            toast.error('Failed to set default language');
        }
    };

    const deleteLanguage = async (language) => {
        if (language.is_default) {
            toast.error("Cannot delete the default language.");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this language?")) return;
        try {
            await settingsService.deleteLanguage(language.id);
            setLanguages(languages.filter(l => l.id !== language.id));
            toast.success('Language deleted');
        } catch (error) {
            toast.error('Failed to delete language');
        }
    };

    const openModal = (language = null) => {
        if (language) {
            setEditingLanguage(language);
            setForm({
                name: language.name,
                code: language.code,
                direction: language.direction,
                is_active: language.is_active
            });
        } else {
            setEditingLanguage(null);
            setForm({
                name: '',
                code: '',
                direction: 'ltr',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLanguage) {
                await settingsService.updateLanguage(editingLanguage.id, form);
            } else {
                await settingsService.createLanguage(form);
            }
            setIsModalOpen(false);
            fetchLanguages();
        } catch (error) {
            toast.error('Failed to save language');
        }
    };

    const filteredLanguages = languages.filter(l => 
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <LanguagesIcon className="text-emerald-500" size={28} />
                        Interface Languages
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage active translations and default language for the system.</p>
                </div>
                <button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2">
                    <Plus size={18} /> Add Language
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search languages..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                                <th className="p-4 font-semibold">Language Name</th>
                                <th className="p-4 font-semibold">Code</th>
                                <th className="p-4 font-semibold">Direction</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2"></div>
                                        Loading languages...
                                    </td>
                                </tr>
                            ) : filteredLanguages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No languages found.
                                    </td>
                                </tr>
                            ) : (
                                filteredLanguages.map((language) => (
                                    <tr key={language.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-white flex items-center gap-2">
                                                {language.name}
                                                {language.is_default && (
                                                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Default</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-mono text-emerald-400 bg-emerald-500/10 inline-block px-2 py-0.5 rounded">
                                                {language.code}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-slate-300 uppercase tracking-widest text-xs font-bold">
                                                {language.direction}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => toggleLanguage(language)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                                                    language.is_active 
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                                }`}
                                            >
                                                {language.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {language.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!language.is_default && language.is_active && (
                                                    <button 
                                                        onClick={() => setDefault(language.id)}
                                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-1"
                                                    >
                                                        Set Default
                                                    </button>
                                                )}
                                                <button onClick={() => openModal(language)} className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2 py-1 flex items-center gap-1">
                                                    <Edit size={14} /> Edit
                                                </button>
                                                {!language.is_default && (
                                                    <button onClick={() => deleteLanguage(language)} className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1">
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">{editingLanguage ? 'Edit Language' : 'Add Language'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1">Language Name</label>
                                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. French" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1">ISO Code</label>
                                    <input required type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. fr_FR" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Direction</label>
                                    <select value={form.direction} onChange={e => setForm({...form, direction: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                                        <option value="ltr">LTR (Left to Right)</option>
                                        <option value="rtl">RTL (Right to Left)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-5 h-5 accent-emerald-500 rounded bg-slate-950 border-slate-700" />
                                <label htmlFor="is_active" className="text-sm font-semibold text-slate-300 cursor-pointer">Active</label>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors">Save Language</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
