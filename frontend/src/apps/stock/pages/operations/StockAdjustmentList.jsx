import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/core/components/shared/views/DataTable';
import inventoryService from '../../api/inventoryService';
import { Edit3, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StockAdjustmentList() {
    const navigate = useNavigate();
    const [adjustments, setAdjustments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdjustments = async () => {
        try {
            setLoading(true);
            const res = await inventoryService.getAdjustments();
            setAdjustments(res.results || res || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch adjustments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdjustments();
    }, []);

    const columns = [
        { key: 'reference', label: 'Reference', render: (val, row) => <span className="font-bold text-white">{val || `ADJ-${row.id}`}</span> },
        { key: 'inventory_item_name', label: 'Item', render: (val, row) => val || row.inventory_item || '-' },
        { key: 'counted_quantity', label: 'Counted Qty', render: (val) => <span className="font-medium text-emerald-400">{val}</span> },
        { key: 'reason', label: 'Reason' },
        { 
            key: 'created_at', 
            label: 'Date', 
            render: (val) => val ? new Date(val).toLocaleDateString() : '-' 
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Edit3 className="text-emerald-500" /> Stock Adjustments
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Manage physical inventory counts and adjustments.</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/stock/adjustments/create')}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={18} /> New Count
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search adjustments..." 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                        />
                    </div>
                    <button className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white flex items-center gap-2 transition-colors">
                        <Filter size={16}/> Filter
                    </button>
                </div>
                
                <DataTable 
                    columns={columns}
                    data={adjustments}
                    loading={loading}
                    onRowClick={(row) => navigate(`/admin/stock/adjustments/${row.id}`)}
                />
            </div>
        </div>
    );
}
