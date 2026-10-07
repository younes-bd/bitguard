import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../../core/api/client';
import DataTable from '../../../shell/components/ui/views/DataTable';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function UomListPage() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { header: 'Unit of Measure', accessor: 'name', key: 'name' },
        { 
            header: 'Category', 
            accessor: 'category', 
            key: 'category',
            cell: (row) => row.category_name || row.category || '-'
        },
        { 
            header: 'Type', 
            accessor: 'uom_type', 
            key: 'uom_type',
            cell: (row) => (
                <span className="capitalize text-slate-300">
                    {row.uom_type?.replace('_', ' ') || 'Reference'}
                </span>
            )
        },
        { 
            header: 'Active', 
            accessor: 'is_active', 
            key: 'is_active',
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {row.is_active ? 'Active' : 'Archived'}
                </span>
            )
        }
    ];

    useEffect(() => {
        const fetchUoms = async () => {
            try {
                const response = await apiClient.get('base/uoms/');
                setData(response.data.results || response.data);
            } catch (error) {
                toast.error('Failed to load Units of Measure');
            } finally {
                setLoading(false);
            }
        };
        fetchUoms();
    }, []);

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Units of Measure</h1>
                    <p className="text-sm text-slate-400 mt-1">Configure measurement units for inventory and sales.</p>
                </div>
                <button 
                    onClick={() => toast('Form view not implemented yet')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> New UoM
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
