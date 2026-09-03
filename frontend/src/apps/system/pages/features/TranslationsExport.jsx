import React, { useState } from 'react';
import { Download, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/core/api/client';
import { settingsService } from '../../api/settingsService';

export default function TranslationsExport() {
  const [languages, setLanguages] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [form, setForm] = useState({
      language: '',
      format: 'po',
      apps: 'all'
  });

  useEffect(() => {
    settingsService.getLanguages()
        .then(res => setLanguages(res.data?.results || res.data || []))
        .catch(() => setLanguages([
            { code: 'en', name: 'English' },
            { code: 'fr', name: 'French' },
            { code: 'es', name: 'Spanish' },
        ]));
  }, []);

  const handleExport = async (e) => {
    e.preventDefault();
    if (!form.language) {
        toast.error('Please select a language to export');
        return;
    }
    
    setExporting(true);
    try {
      const response = await apiClient.post('system/translations/export/', {
          language: form.language,
          format: form.format,
          modules: form.apps
      }, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `translation_${form.language}.${form.format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Translations exported successfully');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Oswald'] uppercase mb-2 flex items-center gap-3">
                    <Globe className="text-blue-500" size={28} />
                    Export Translation
                </h1>
                <p className="text-slate-400 text-sm mt-1">Export translations as PO or CSV files.</p>
            </div>
        </div>

        <div className="max-w-3xl">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center gap-2">
                    <Globe size={18} className="text-slate-400" />
                    <h2 className="font-semibold text-white">Export Translation File</h2>
                </div>
                
                <div className="p-6">
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                        <div className="mt-0.5 text-blue-500">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-blue-800">This will export a translation file for the selected language.</h3>
                            <p className="text-sm text-blue-600 mt-1">You can edit this file using a PO editor or a spreadsheet program and then import it back into the system.</p>
                        </div>
                    </div>

                    <form onSubmit={handleExport} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Language *</label>
                            <select
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={form.language}
                                onChange={e => setForm({...form, language: e.target.value})}
                                required
                            >
                                <option value="" disabled>Select Language</option>
                                {languages.map(lang => (
                                    <option key={lang.code || lang.id} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">File Format</label>
                            <select
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={form.format}
                                onChange={e => setForm({...form, format: e.target.value})}
                            >
                                <option value="po">PO File (.po)</option>
                                <option value="csv">CSV File (.csv)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Apps To Export</label>
                            <select
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={form.apps}
                                onChange={e => setForm({...form, apps: e.target.value})}
                            >
                                <option value="all">All Apps</option>
                                <option value="crm">CRM</option>
                                <option value="sales">Sales</option>
                                <option value="accounting">Accounting</option>
                                <option value="hr">Human Resources</option>
                            </select>
                        </div>

                        <div className="pt-4 flex gap-3 border-t border-slate-800">
                            <button 
                                type="submit" 
                                disabled={exporting}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                            >
                                {exporting ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Download size={18} />
                                )}
                                Export
                            </button>
                            <button 
                                type="button"
                                onClick={() => window.history.back()}
                                className="bg-slate-900 border border-slate-700 text-slate-700 hover:bg-slate-950 px-5 py-2 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}
