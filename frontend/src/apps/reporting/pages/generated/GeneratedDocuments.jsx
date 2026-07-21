import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Clock, Loader2, AlertCircle, Search, Filter, RefreshCw, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import reportingService from '../../../../core/api/reportingService';

export default function GeneratedDocuments() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleFilter, setModuleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [previewDoc, setPreviewDoc] = useState(null);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await reportingService.getGeneratedReports();
            setReports(res?.results || res || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleBulkDownload = () => {
        alert("Bulk download as ZIP coming soon!");
    };

    const handleRegenerate = async (r) => {
        try {
            alert(`Re-generating document for ${r.record_model} #${r.record_id}...`);
            // await reportingService.generateDocument(moduleName, resourceName, r.record_id);
            fetchReports();
        } catch (e) {
            alert("Failed to regenerate");
        }
    };

    const StatusBadge = ({ status }) => {
        if (status === 'done') {
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 w-fit">
                    <CheckCircle size={14} /> Ready
                </span>
            );
        }
        if (status === 'pending') {
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 w-fit">
                    <Clock size={14} /> Pending
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 w-fit">
                <AlertCircle size={14} /> Failed
            </span>
        );
    };

    const filteredReports = reports.filter(r => {
        const matchSearch = r.template_name?.toLowerCase().includes(searchTerm.toLowerCase()) || r.record_model?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchModule = moduleFilter === 'all' || r.record_model?.startsWith(moduleFilter);
        const matchStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchSearch && matchModule && matchStatus;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 font-['Outfit']">
                        <FileText className="text-blue-500 w-8 h-8" />
                        Generated Documents
                    </h1>
                    <p className="text-slate-400 mt-2">View and manage all system-generated PDF documents in one central hub.</p>
                </div>
                {selectedIds.length > 0 && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl px-4 py-2 flex items-center gap-4">
                        <span className="text-blue-400 font-bold text-sm">{selectedIds.length} selected</span>
                        <button onClick={handleBulkDownload} className="text-sm font-bold text-white hover:text-blue-300 flex items-center gap-2">
                            <Download size={16}/> Bulk ZIP
                        </button>
                    </div>
                )}
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-700/50 bg-slate-900/80 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search templates or models..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-blue-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 min-w-[140px]">
                    <option value="all">All Modules</option>
                    <option value="accounting">Accounting / Finance</option>
                    <option value="purchase">Purchase</option>
<option value="inventory">Inventory</option>
                    <option value="hrm">Human Resources (HRM)</option>
                    <option value="contracts">Contracts</option>
                    <option value="crm">CRM & Sales</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 min-w-[140px]">
                    <option value="all">All Statuses</option>
                    <option value="done">Ready</option>
                    <option value="pending">Generating</option>
                    <option value="failed">Failed</option>
                </select>
                <button onClick={fetchReports} className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700">
                    <RefreshCw size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl ${previewDoc ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    {loading ? (
                        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>
                    ) : filteredReports.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText size={48} className="text-slate-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">No reports found</h3>
                            <p className="text-slate-400 mt-2">Adjust your filters or generate a new document.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 w-12">
                                            <input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? filteredReports.map(r=>r.id) : [])} className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                                        </th>
                                        <th className="p-4">Document / Template</th>
                                        <th className="p-4">Source Record</th>
                                        <th className="p-4">Generated Date</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredReports.map(r => (
                                        <tr key={r.id} className={`hover:bg-slate-800/50 transition-colors ${previewDoc?.id === r.id ? 'bg-blue-900/10' : ''}`}>
                                            <td className="p-4">
                                                <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleSelection(r.id)} className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                                            </td>
                                            <td className="p-4">
                                                <div className="text-white font-medium flex items-center gap-2">
                                                    <FileText size={16} className="text-slate-500" />
                                                    {r.template_name}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-slate-300 font-mono">{r.record_model}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    ID: {r.record_id}
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-400 text-sm">
                                                {new Date(r.created_at).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button 
                                                        onClick={() => setPreviewDoc(previewDoc?.id === r.id ? null : r)}
                                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                                                        title="Quick Preview"
                                                    >
                                                        {previewDoc?.id === r.id ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRegenerate(r)}
                                                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors"
                                                        title="Re-generate"
                                                    >
                                                        <RefreshCw size={16} />
                                                    </button>
                                                    <Link 
                                                        to={`/admin/documents/workspaces/generated-docs?source=${r.record_model}&id=${r.record_id}`}
                                                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded transition-colors"
                                                        title="View in EDMS Vault"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                    {r.file && r.status === 'done' ? (
                                                        <a 
                                                            href={r.file} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                            title="Download PDF"
                                                        >
                                                            <Download size={16} />
                                                        </a>
                                                    ) : (
                                                        <button disabled className="p-2 text-slate-600 cursor-not-allowed">
                                                            <Download size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Preview Panel */}
                {previewDoc && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col animate-in slide-in-from-right-4 duration-300 h-[800px] sticky top-6">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Eye size={18} className="text-blue-500"/>
                                Document Preview
                            </h3>
                            <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                                &times;
                            </button>
                        </div>
                        <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden">
                            {previewDoc.file ? (
                                <iframe 
                                    src={previewDoc.file} 
                                    className="w-full h-full border-0 bg-white"
                                    title="PDF Preview"
                                />
                            ) : (
                                <div className="text-slate-500 flex flex-col items-center">
                                    <AlertCircle size={32} className="mb-2 opacity-50" />
                                    <p>No PDF file available to preview.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
                            <span>Template: {previewDoc.template_name}</span>
                            <a href={previewDoc.file} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Open in new tab</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
