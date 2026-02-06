import React, { useState, useEffect } from 'react';
import securityService from '../../../shared/core/services/securityService';
import { Bug, Search } from 'lucide-react';

const VulnerabilitiesPage = () => {
    const [vulns, setVulns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVulns = async () => {
            try {
                const response = await securityService.getVulnerabilities();
                setVulns(response.data.results || response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchVulns();
    }, []);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Vulnerability Management</h1>
                    <p className="text-slate-400">Track and remediate known CVEs.</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase p-4">
                            <th className="p-4">CVE ID</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4">Affected Assets</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {vulns.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">No vulnerabilities found.</td></tr>
                        ) : (
                            vulns.map((v) => (
                                <tr key={v.id} className="hover:bg-slate-700/30">
                                    <td className="p-4 font-mono text-indigo-400">{v.cve_id}</td>
                                    <td className="p-4 text-white">{v.title}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getSeverityColor(v.severity)}`}>
                                            {v.severity}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-300">{v.affected_assets?.length || 0}</td>
                                    <td className="p-4 text-slate-300 capitalize">{v.status.replace('_', ' ')}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Details</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VulnerabilitiesPage;
