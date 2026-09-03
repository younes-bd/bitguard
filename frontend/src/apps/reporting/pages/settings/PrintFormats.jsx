import React, { useState, useEffect } from 'react';
import { settingsService } from '../../../system/api/settingsService';
import { FileText, Loader2, Play } from 'lucide-react';
import toast from 'react-hot-toast';

const PrintFormats = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await settingsService.getReports();
                setReports(res.results || res);
            } catch (err) {
                toast.error("Failed to load print formats");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wide">Print Formats</h1>
                <p className="text-slate-400 mt-1">Manage print formats and report templates.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Model</th>
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    No print formats found.
                                </td>
                            </tr>
                        ) : reports.map(report => (
                            <tr key={report.id} className="hover:bg-slate-800/20 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{report.name}</div>
                                            <div className="text-xs text-slate-500">{report.report_name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-400 text-sm">{report.model}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                                        {report.report_type}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">
                                        <Play size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PrintFormats;
