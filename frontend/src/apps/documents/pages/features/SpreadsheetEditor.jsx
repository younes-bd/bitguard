import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Share2, Download, Settings, FileSpreadsheet } from 'lucide-react';

export default function SpreadsheetEditor() {
    const navigate = useNavigate();

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/documents')}
                        className="p-2 text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-colors"
                        title="Back to Documents"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <FileSpreadsheet size={18} />
                        </div>
                        <input 
                            type="text" 
                            defaultValue="Untitled Spreadsheet"
                            className="bg-transparent border-none text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1"
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2">
                        <Share2 size={16} /> Share
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2">
                        <Download size={16} /> Export
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                        <Save size={16} /> Save
                    </button>
                </div>
            </div>

            {/* Fake Ribbon (Excel/Odoo Style) */}
            <div className="flex items-center gap-6 px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-x-auto text-sm text-slate-600 dark:text-slate-400">
                <span className="cursor-pointer hover:text-emerald-500 font-medium">File</span>
                <span className="cursor-pointer hover:text-emerald-500 font-medium">Edit</span>
                <span className="cursor-pointer hover:text-emerald-500 font-medium">View</span>
                <span className="cursor-pointer hover:text-emerald-500 font-medium">Insert</span>
                <span className="cursor-pointer hover:text-emerald-500 font-medium">Format</span>
                <span className="cursor-pointer hover:text-emerald-500 font-medium">Data</span>
                <span className="cursor-pointer hover:text-emerald-500 font-medium">Tools</span>
            </div>

            {/* Spreadsheet Canvas Placeholder */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-10 dark:opacity-20"></div>
                <div className="h-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm relative flex flex-col items-center justify-center text-center">
                    <FileSpreadsheet size={64} className="text-slate-300 dark:text-slate-700 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-400 dark:text-slate-600">Enterprise Spreadsheet Engine</h2>
                    <p className="text-slate-500 mt-2 max-w-md">
                        This view is structurally wired for the spreadsheet component integration. 
                        In a full deployment, the Web-based Excel/Odoo spreadsheet engine renders here.
                    </p>
                </div>
            </div>
        </div>
    );
}
