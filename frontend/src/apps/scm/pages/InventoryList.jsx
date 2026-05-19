import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, Package, ArrowUpDown, Edit2, Trash2 } from 'lucide-react';
import scmService from '../../../core/api/scmService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const stockBadge = (qty, reorderLevel = 10) => {
    if (qty === 0) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/10 text-red-400">Out of Stock</span>;
    if (qty <= reorderLevel) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400">Low Stock</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400">In Stock</span>;
};

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Stock adjustment state
    const [showLowStock, setShowLowStock] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [adjustingItem, setAdjustingItem] = useState(null);
    const [adjustFormData, setAdjustFormData] = useState({ adjustment_type: 'restock', quantity: '', reason: '', reference: '' });

    useEffect(() => {
        scmService.getInventoryItems({ search }).then(d => {
            setItems(d?.results ?? d ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [search]);

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedItem) {
                await scmService.updateInventoryItem(selectedItem.id, formData);
            } else {
                await scmService.createInventoryItem(formData);
            }
            setIsModalOpen(false);
            const data = await scmService.getInventoryItems({ search });
            setItems(data?.results ?? data ?? []);
            toast.success(selectedItem ? 'Inventory item updated successfully!' : 'Inventory item created successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save inventory item');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        setActionLoading(true);
        try {
            await scmService.deleteInventoryItem(selectedItem.id);
            setIsDeleteModalOpen(false);
            const data = await scmService.getInventoryItems({ search });
            setItems(data?.results ?? data ?? []);
            toast.success('Inventory item deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete inventory item');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAdjustStock = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await scmService.adjustStock(adjustingItem.id, adjustFormData);
            toast.success('Stock adjusted successfully');
            setIsAdjustModalOpen(false);
            const data = await scmService.getInventoryItems({ search });
            setItems(data?.results ?? data ?? []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to adjust stock');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const INVENTORY_FIELDS = [
        { name: 'name', label: 'Item Name', required: true },
        { name: 'sku', label: 'SKU', required: true },
        { name: 'category', label: 'Category' },
        { name: 'quantity_on_hand', label: 'Quantity On Hand', type: 'number' },
        { name: 'reorder_level', label: 'Reorder Level', type: 'number' },
        { name: 'unit_price', label: 'Unit Price ($)', type: 'number', step: '0.01' }
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Inventory</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{items.length} SKUs tracked</p>
                </div>
                <button onClick={() => { setSelectedItem(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /><span>Add Item</span>
                </button>
            </div>
            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search inventory..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
                </div>
                <button onClick={() => setShowLowStock(!showLowStock)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${showLowStock ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'}`}>
                    <AlertTriangle size={16} />
                    {showLowStock ? 'Showing Low Stock' : 'Show Low Stock Only'}
                </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['SKU / Name', 'Category', 'Qty on Hand', 'Reorder Level', 'Unit Price', 'Status', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="py-16 text-center text-slate-500">Loading inventory...</td></tr>
                        ) : items.filter(item => !showLowStock || (item.quantity_on_hand ?? 0) <= (item.reorder_level ?? 10)).length === 0 ? (
                            <tr><td colSpan={7} className="py-16 text-center text-slate-500">No inventory items found</td></tr>
                        ) : items.filter(item => !showLowStock || (item.quantity_on_hand ?? 0) <= (item.reorder_level ?? 10)).map(item => (
                            <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group">
                                <td className="px-5 py-4">
                                    <p className="text-white font-medium">{item.name}</p>
                                    <p className="text-slate-500 text-xs font-mono">{item.sku}</p>
                                </td>
                                <td className="px-5 py-4 text-slate-300">{item.category ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-200 font-mono">{item.quantity_on_hand ?? 0}</td>
                                <td className="px-5 py-4 text-slate-400 font-mono">{item.reorder_level ?? 10}</td>
                                <td className="px-5 py-4 text-slate-300">${Number(item.unit_price ?? 0).toFixed(2)}</td>
                                <td className="px-5 py-4">{stockBadge(item.quantity_on_hand ?? 0, item.reorder_level ?? 10)}</td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setAdjustingItem(item); setAdjustFormData({ adjustment_type: 'restock', quantity: '', reason: '', reference: '' }); setIsAdjustModalOpen(true); }}
                                            className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded flex items-center gap-1 transition-colors"
                                        >
                                            <ArrowUpDown size={12} /> Adjust
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsModalOpen(true); }}
                                            className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsDeleteModalOpen(true); }}
                                            className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Inventory Item"
                fields={INVENTORY_FIELDS}
                initialData={selectedItem}
                onSubmit={handleSave}
                loading={actionLoading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Inventory Item"
                message={`Are you sure you want to delete ${selectedItem?.name} (${selectedItem?.sku})?`}
                loading={actionLoading}
            />

            {/* Adjust Stock Modal */}
            {isAdjustModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white">Adjust Stock</h2>
                                <p className="text-slate-400 text-sm mt-1">{adjustingItem?.name} ({adjustingItem?.sku})</p>
                            </div>
                            <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleAdjustStock} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Adjustment Type *</label>
                                <select required value={adjustFormData.adjustment_type} onChange={e => setAdjustFormData({...adjustFormData, adjustment_type: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                    <option value="restock">Restock</option>
                                    <option value="write-off">Write-off</option>
                                    <option value="correction">Correction</option>
                                    <option value="sale">Sale</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Quantity * (Positive or Negative)</label>
                                <input type="number" required value={adjustFormData.quantity} onChange={e => setAdjustFormData({...adjustFormData, quantity: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-orange-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Reason</label>
                                <textarea rows={2} value={adjustFormData.reason} onChange={e => setAdjustFormData({...adjustFormData, reason: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-orange-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Reference</label>
                                <input type="text" value={adjustFormData.reference} onChange={e => setAdjustFormData({...adjustFormData, reference: e.target.value})}
                                    placeholder="e.g. PO-1234" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-orange-500" />
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-slate-800">
                                <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="flex-1 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50">{actionLoading ? 'Saving...' : 'Apply Adjustment'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryList;
