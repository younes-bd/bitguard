import React, { useState, useEffect } from 'react';
import { settingsService } from '../../api/settingsService';
import toast from 'react-hot-toast';
import { FileText, Save, Loader2 } from 'lucide-react';

export default function DocumentLayoutsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        document_header: '',
        document_footer: '',
        primary_color: '#000000',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await settingsService.getSettings();
                const settings = Array.isArray(res.data) ? res.data : (res.data?.results || []);
                
                const header = settings.find(s => s.key === 'document_header')?.value || '';
                const footer = settings.find(s => s.key === 'document_footer')?.value || '';
                const color = settings.find(s => s.key === 'primary_color')?.value || '#000000';
                
                setFormData({ document_header: header, document_footer: footer, primary_color: color });
            } catch (err) {
                toast.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await settingsService.batchUpdateSettings({ settings: formData });
            toast.success('Document layouts saved');
        } catch (err) {
            toast.error('Failed to save document layouts');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center text-slate-500"><Loader2 className="animate-spin w-8 h-8" /></div>;

    return (
        <div className="p-8 max-w-3xl mx-auto text-slate-200">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText size={24} className="text-blue-500" />
                    Document Layouts
                </h1>
                <p className="text-slate-400">Configure PDF report headers, footers, and templates.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Document Header</label>
                    <textarea 
                        value={formData.document_header}
                        onChange={e => setFormData({ ...formData, document_header: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-blue-500 focus:outline-none min-h-[100px]"
                        placeholder="Company Name, Address, etc."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Document Footer</label>
                    <textarea 
                        value={formData.document_footer}
                        onChange={e => setFormData({ ...formData, document_footer: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-blue-500 focus:outline-none min-h-[100px]"
                        placeholder="Page numbers, terms, etc."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
                    <input 
                        type="color"
                        value={formData.primary_color}
                        onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                        className="w-16 h-10 bg-slate-950 border border-slate-700 rounded cursor-pointer"
                    />
                </div>
                
                <div className="flex justify-end border-t border-slate-800 pt-6">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Layouts
                    </button>
                </div>
            </form>
        </div>
    );
}

