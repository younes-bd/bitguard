import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const GenericModal = ({ isOpen, onClose, title, fields, initialData, onSubmit, loading, error }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen) {
            const initial = {};
            fields.forEach(f => {
                if (initialData && initialData[f.name] !== undefined) {
                    initial[f.name] = initialData[f.name];
                } else {
                    initial[f.name] = f.type === 'checkbox' || f.type === 'toggle' ? (f.default ?? false) : (f.default ?? '');
                }
            });
            setFormData(initial);
        }
    }, [isOpen, initialData, fields]);

    const handleChange = (e, field) => {
        const value = field.type === 'checkbox' || field.type === 'toggle' ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [field.name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-5 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">{initialData ? `Edit ${title}` : `New ${title}`}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <form id="generic-form" onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(field => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5 capitalize">
                                    {field.label || field.name.replace('_', ' ')}
                                    {field.required && <span className="text-red-400 ml-1">*</span>}
                                </label>
                                
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(e, field)}
                                        required={field.required}
                                        rows={field.rows || 3}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(e, field)}
                                        required={field.required}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    >
                                        <option value="">Select option...</option>
                                        {field.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'checkbox' || field.type === 'toggle' ? (
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="checkbox"
                                            checked={!!formData[field.name]}
                                            onChange={(e) => handleChange(e, field)}
                                            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                                        />
                                        <span className="text-sm text-slate-400">{field.description || 'Enable'}</span>
                                    </div>
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        step={field.step}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(e, field)}
                                        required={field.required}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    />
                                )}
                            </div>
                        ))}
                    </form>
                </div>
                
                <div className="p-5 border-t border-slate-800 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="generic-form"
                        disabled={loading}
                        className="flex items-center justify-center min-w-[100px] px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenericModal;
