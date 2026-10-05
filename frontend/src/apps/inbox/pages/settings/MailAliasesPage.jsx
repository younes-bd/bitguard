import React, { useState, useEffect } from 'react';
import apiClient from '../../../../core/api/client';
import DataTable from '../../../shell/components/ui/views/DataTable';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function MailAliasesPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { header: 'Alias Name', accessor: 'alias_name', key: 'alias_name' },
        { 
            header: 'Target Model', 
            accessor: 'alias_model_id', 
            key: 'alias_model_id',
            cell: (row) => <span className="font-mono text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{row.alias_model_id || 'crm.lead'}</span>
        },
        { 
            header: 'Accept Emails From', 
            accessor: 'alias_contact', 
            key: 'alias_contact',
            cell: (row) => (
                <span className="capitalize text-slate-400">
                    {row.alias_contact?.replace('_', ' ') || 'Everyone'}
                </span>
            )
        },
        { 
            header: 'Status', 
            accessor: 'is_active', 
            key: 'is_active',
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {row.is_active !== false ? 'Active' : 'Disabled'}
                </span>
            )
        }
    ];

    useEffect(() => {
        const fetchAliases = async () => {
            try {
                const response = await apiClient.get('/api/inbox/mail-aliases/');
                setData(response.data.results || response.data);
            } catch (error) {
                toast.error('Failed to load mail aliases');
            } finally {
                setLoading(false);
            }
        };
        fetchAliases();
    }, []);

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mail Aliases</h1>
                    <p className="text-sm text-slate-400 mt-1">Configure inbound email routing to ERP models.</p>
                </div>
                <button 
                    onClick={() => toast('Form view not implemented yet')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> New Alias
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <DataTable 
                    columns={columns} 
                    data={data} 
                    isLoading={loading} 
                />
            </div>
        </div>
    );
}
