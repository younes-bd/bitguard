import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../../core/api/client';
import DataTable from '../../../shell/components/ui/views/DataTable';
import { toast } from 'react-hot-toast';

export default function CountriesListPage() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { header: 'Country Code', accessor: 'code', key: 'code' },
        { header: 'Country Name', accessor: 'name', key: 'name' },
        { 
            header: 'Status', 
            accessor: 'is_active', 
            key: 'is_active',
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await apiClient.get('base/countries/');
                setData(response.data.results || response.data);
            } catch (error) {
                toast.error('Failed to load countries');
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Countries</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage global localization records.</p>
                </div>
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
