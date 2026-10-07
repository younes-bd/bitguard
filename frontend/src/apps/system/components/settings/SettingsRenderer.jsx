import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../../../core/api/client';
import { toast } from 'react-hot-toast';
import { AlertCircle, Save, Loader2, Info } from 'lucide-react';

export default function SettingsRenderer({ schemaKey, title }) {
    const [schema, setSchema] = useState([]);
    const [originalValues, setOriginalValues] = useState({});
    const [draftValues, setDraftValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Fetch schema and values (Promise.allSettled Law for resiliency)
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const [schemaRes, valuesRes] = await Promise.allSettled([
                    apiClient.get(`/api/base/system-parameters/schema/?app=${schemaKey}`),
                    apiClient.get(`/api/base/system-parameters/?prefix=${schemaKey}`)
                ]);
                
                if (!isMounted) return;
                
                // If the schema call fails, we literally cannot render the page.
                if (schemaRes.status === 'rejected') {
                    throw new Error(schemaRes.reason?.response?.data?.detail || 'Failed to load settings schema. Check backend settings_schema.py.');
                }
                
                const loadedSchema = schemaRes.value.data.schema || [];
                
                // If values fail, it's safer to default to empty/schema defaults rather than crash
                const loadedValuesRaw = valuesRes.status === 'fulfilled' && valuesRes.value.data.results 
                    ? valuesRes.value.data.results 
                    : [];
                    
                const initialValues = {};
                
                // 1. Populate defaults from schema
                loadedSchema.forEach(field => {
                    initialValues[field.key] = field.default !== undefined ? field.default : '';
                });
                
                // 2. Overwrite with database values, casting safely
                loadedValuesRaw.forEach(row => {
                    const fieldDef = loadedSchema.find(f => f.key === row.key);
                    let val = row.value;
                    
                    if (fieldDef) {
                        if (fieldDef.type === 'boolean') {
                            val = (val === 'true' || val === 'True' || val === true);
                        }
                        if (fieldDef.type === 'integer') {
                            val = parseInt(val, 10) || 0;
                        }
                    }
                    initialValues[row.key] = val;
                });
                
                setSchema(loadedSchema);
                setOriginalValues(initialValues);
                setDraftValues(initialValues);
                
            } catch (err) {
                setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        
        fetchData();
        return () => { isMounted = false; };
    }, [schemaKey]);

    // Computed isDirty check
    const isDirty = useMemo(() => {
        return JSON.stringify(originalValues) !== JSON.stringify(draftValues);
    }, [originalValues, draftValues]);

    const handleSave = async () => {
        setSaving(true);
        
        const updates = Object.keys(draftValues)
            .filter(key => draftValues[key] !== originalValues[key])
            .map(key => ({
                key,
                value: draftValues[key]
            }));
            
        if (updates.length === 0) {
            setSaving(false);
            return;
        }
        
        try {
            await apiClient.post('/api/base/system-parameters/batch_update/', { updates });
            toast.success('Settings saved successfully');
            setOriginalValues(draftValues);
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        setDraftValues(originalValues);
    };

    const handleChange = (key, val) => {
        setDraftValues(prev => ({ ...prev, [key]: val }));
    };

    // Group fields mathematically
    const groupedFields = useMemo(() => {
        const groups = {};
        schema.forEach(field => {
            const groupName = field.group || 'General Settings';
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(field);
        });
        return groups;
    }, [schema]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                    <h3 className="text-red-400 font-semibold">Schema Error</h3>
                    <p className="text-sm text-red-400/80 mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative pb-20">
            {/* Odoo 17 Sticky Action Bar */}
            <div className={`fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 p-4 px-6 md:pl-72 flex justify-between items-center shadow-2xl transition-all duration-300 ease-in-out ${isDirty ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <span className="text-amber-500 font-medium flex items-center gap-3">
                    <AlertCircle size={20} className="animate-pulse" /> 
                    <span>You have unsaved changes</span>
                </span>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleDiscard} 
                        disabled={saving}
                        className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Page Header (if explicitly provided) */}
            {title && (
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                </div>
            )}

            {/* Dynamic Render by Group */}
            {Object.entries(groupedFields).map(([groupName, fields]) => (
                <div key={groupName} className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-300 border-b border-slate-800 pb-2">
                        {groupName}
                    </h2>
                    
                    {/* Standard Odoo Card Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map(field => (
                            <SettingField 
                                key={field.key}
                                field={field}
                                value={draftValues[field.key]}
                                onChange={(val) => handleChange(field.key, val)}
                            />
                        ))}
                    </div>
                </div>
            ))}
            
            {schema.length === 0 && (
                <div className="text-center p-12 bg-slate-900 border border-slate-800 rounded-xl">
                    <Info className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
                    <h3 className="text-slate-300 font-medium">No Settings Configured</h3>
                    <p className="text-sm text-slate-500 mt-1">This application does not have a schema registered in the backend.</p>
                </div>
            )}
        </div>
    );
}

// ─── Visual Field Factory ───────────────────────────────────────────────────

function SettingField({ field, value, onChange }) {
    
    const renderInput = () => {
        switch (field.type) {
            case 'boolean':
                return (
                    <button
                        type="button"
                        role="switch"
                        aria-checked={value}
                        onClick={() => onChange(!value)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                            ${value ? 'bg-blue-600' : 'bg-slate-700'}`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                                ${value ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                );
                
            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-slate-950 border border-slate-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="" disabled>Select an option...</option>
                        {field.choices?.map(choice => (
                            <option key={choice[0]} value={choice[0]}>
                                {choice[1]}
                            </option>
                        ))}
                    </select>
                );
                
            case 'integer':
                return (
                    <input
                        type="number"
                        value={value || ''}
                        onChange={(e) => onChange(parseInt(e.target.value, 10))}
                        className="mt-1 block w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                );
                
            default: // string
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                );
        }
    };

    return (
        <div className={`p-5 rounded-xl border transition-colors ${value !== field.default ? 'bg-blue-900/5 border-blue-500/20' : 'bg-slate-900 border-slate-800'} hover:border-slate-700`}>
            <div className="flex gap-4">
                {/* For Booleans, the switch goes on the left (Odoo Style) */}
                {field.type === 'boolean' && (
                    <div className="pt-0.5 flex-shrink-0">
                        {renderInput()}
                    </div>
                )}
                
                <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold text-white mb-1">
                        {field.label || field.key}
                    </label>
                    
                    {field.help && (
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                            {field.help}
                        </p>
                    )}
                    
                    {/* For non-booleans, input goes below the label */}
                    {field.type !== 'boolean' && (
                        <div>{renderInput()}</div>
                    )}
                    
                    {field.devOnly && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                            <AlertCircle size={10} /> developer only
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
