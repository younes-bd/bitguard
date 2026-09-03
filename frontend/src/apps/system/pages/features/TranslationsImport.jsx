import React, { useState, useRef } from 'react';
import { Upload, Import, Inbox, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/core/api/client';

export default function TranslationsImport() {
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
      language_name: '',
      language_code: '',
      overwrite: 'false'
  });

  const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;
      
      const isPoOrCsv = selectedFile.name.endsWith('.po') || selectedFile.name.endsWith('.csv');
      if (!isPoOrCsv) {
          toast.error('You can only upload .po or .csv files!');
          e.target.value = '';
          setFile(null);
          return;
      }
      setFile(selectedFile);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload a translation file');
      return;
    }

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('overwrite', form.overwrite === 'true');

      await apiClient.post('system/translations/import_file/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Translations imported successfully');
      setForm({ language_name: '', language_code: '', overwrite: 'false' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      toast.error('Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Oswald'] uppercase mb-2 flex items-center gap-3">
                    <Globe className="text-blue-500" size={28} />
                    Import Translation
                </h1>
                <p className="text-slate-400 text-sm mt-1">Import new translations from PO or CSV files.</p>
            </div>
        </div>

        <div className="max-w-3xl">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center gap-2">
                    <Import size={18} className="text-slate-400" />
                    <h2 className="font-semibold text-white">Import Translation File</h2>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleImport} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Language Name *</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="e.g. French / FranÃƒÂ§ais"
                                    value={form.language_name}
                                    onChange={e => setForm({...form, language_name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Language Code *</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="e.g. fr_FR"
                                    value={form.language_code}
                                    onChange={e => setForm({...form, language_code: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Overwrite Existing Terms</label>
                            <select
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={form.overwrite}
                                onChange={e => setForm({...form, overwrite: e.target.value})}
                            >
                                <option value="false">No, only add new terms</option>
                                <option value="true">Yes, overwrite existing translations</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Translation File (.po or .csv) *</label>
                            
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl hover:border-blue-500 transition-colors bg-slate-950/50 relative">
                                <div className="space-y-1 text-center">
                                    <Inbox className="mx-auto h-12 w-12 text-slate-400" />
                                    <div className="flex text-sm text-slate-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-900 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input 
                                                id="file-upload" 
                                                name="file-upload" 
                                                type="file" 
                                                className="sr-only" 
                                                accept=".po,.csv"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Only .po and .csv files are supported
                                    </p>
                                    {file && (
                                        <p className="text-sm font-semibold text-emerald-600 mt-2">
                                            Selected: {file.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3 border-t border-slate-800">
                            <button 
                                type="submit" 
                                disabled={importing}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                            >
                                {importing ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Import size={18} />
                                )}
                                Import
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
