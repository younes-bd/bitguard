import React, { useState, useEffect } from 'react';
import apiClient from '../../../../core/api/client';
import DataTable from '../../../shell/components/ui/views/DataTable';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function TranslationsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { header: 'Source Term', accessor: 'source_term', key: 'source_term' },
        { header: 'Language', accessor: 'language', key: 'language' },
        { 
            header: 'Translated Value', 
            accessor: 'translated_term', 
            key: 'translated_term',
            cell: (row) => <span className="font-medium text-blue-400">{row.translated_term}</span>
        },
        { 
            header: 'State', 
            accessor: 'state', 
            key: 'state',
            cell: (row) => (
                <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-full capitalize">
                    {row.state || 'Translated'}
                </span>
            )
        }
    ];

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const response = await apiClient.get('/api/core/translations/');
                setData(response.data.results || response.data);
            } catch (error) {
                toast.error('Failed to load translations');
            } finally {
                setLoading(false);
            }
        };
        fetchTranslations();
    }, []);

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Translated Terms</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage tenant-specific terminology overrides.</p>
                </div>
                <button 
                    onClick={() => toast('Inline edit not implemented yet')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> Add Term
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
