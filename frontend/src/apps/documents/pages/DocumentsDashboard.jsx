import React from 'react';
import { FolderOpen, Upload, Search, FileText, Image, File, Archive } from 'lucide-react';

const TYPE_ICONS = { pdf: '📄', doc: '📝', xls: '📊', img: '🖼️', zip: '📦', other: '📎' };

const MOCK_DOCS = [
    { id: 1, name: 'Acme Corp — Master Service Agreement.pdf', type: 'pdf', size: '2.4 MB', uploaded_by: 'Admin', date: '2026-03-18' },
    { id: 2, name: 'Q1 Revenue Report.xlsx', type: 'xls', size: '1.1 MB', uploaded_by: 'Admin', date: '2026-03-15' },
    { id: 3, name: 'SOW — TechStart Security Audit.docx', type: 'doc', size: '450 KB', uploaded_by: 'Admin', date: '2026-03-10' },
    { id: 4, name: 'Network Topology Diagram.png', type: 'img', size: '3.2 MB', uploaded_by: 'Admin', date: '2026-03-05' },
    { id: 5, name: 'Compliance Certificates Bundle.zip', type: 'zip', size: '12 MB', uploaded_by: 'Admin', date: '2026-02-28' },
];

const DocumentsDashboard = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <FolderOpen className="text-cyan-400" size={28} />
                    Document Management
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Centralized file vault for contracts, SOWs, proposals, and compliance documents</p>
            </div>
            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                <Upload size={14} /> Upload Document
            </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
                { label: 'Total Documents', value: MOCK_DOCS.length, color: 'text-white' },
                { label: 'Contracts', value: 2, color: 'text-cyan-400' },
                { label: 'Reports', value: 1, color: 'text-purple-400' },
                { label: 'Storage Used', value: '19.1 MB', color: 'text-amber-400' },
            ].map(kpi => (
                <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">{kpi.label}</div>
                    <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                </div>
            ))}
        </div>

        <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Search documents..." className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-800">
                        {['Document', 'Size', 'Uploaded By', 'Date'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {MOCK_DOCS.map(doc => (
                        <tr key={doc.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                            <td className="px-5 py-4 flex items-center gap-3">
                                <span className="text-xl">{TYPE_ICONS[doc.type] || TYPE_ICONS.other}</span>
                                <span className="text-white font-medium">{doc.name}</span>
                            </td>
                            <td className="px-5 py-4 text-slate-400">{doc.size}</td>
                            <td className="px-5 py-4 text-slate-400">{doc.uploaded_by}</td>
                            <td className="px-5 py-4 text-slate-500 text-xs">{doc.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default DocumentsDashboard;
