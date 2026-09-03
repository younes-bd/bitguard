import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { accountingService } from '../../api/accountingService';
import { ecommerceService } from '../../../ecommerce/api/ecommerceService';
import toast from 'react-hot-toast';

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '', sku: '', description: '', product_type: 'service', 
        price: 0, unit_label: 'unit', tax_config: '', status: 'active'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodData, taxData] = await Promise.all([
                ecommerceService.getProducts(),
                accountingService.getTaxes()
            ]);
            setProducts(prodData || []);
            setTaxes(taxData || []);
        } catch (err) {
            toast.error("Failed to load catalog data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const payload = { ...formData, tax_config: formData.tax_config || null };
            if (formData.id) {
                await ecommerceService.updateProduct(formData.id, payload);
                toast.success("Item updated");
            } else {
                await ecommerceService.createProduct(payload);
                toast.success("Item created");
            }
            setIsEditing(false);
            fetchData();
        } catch (err) {
            toast.error("Failed to save item");
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this item from catalog?')) {
            try {
                await ecommerceService.deleteProduct(id);
                toast.success("Deleted successfully");
                fetchData();
            } catch (err) {
                toast.error("Failed to delete");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Package className="text-emerald-400" size={28} />
                        Product & Service Catalog
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage standard billable items for invoices</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => { setFormData({name: '', sku: '', product_type: 'service', price: 0, unit_label: 'unit'}); setIsEditing(true); }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Item
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <h3 className="text-white font-medium mb-4">{formData.id ? 'Edit Item' : 'New Item'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-xs mb-1">Item Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">SKU / Code</label>
                            <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Type</label>
                            <select value={formData.product_type} onChange={e => setFormData({...formData, product_type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm">
                                <option value="service">Service</option>
                                <option value="physical">Physical Product</option>
                                <option value="digital">Digital Download</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Unit Price</label>
                            <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Unit Label (e.g. hour, pcs)</label>
                            <input type="text" value={formData.unit_label} onChange={e => setFormData({...formData, unit_label: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-slate-400 text-xs mb-1">Description</label>
                            <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3 justify-end">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500">Save Item</button>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">SKU</th>
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">Price</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center text-slate-500">Loading catalog...</td></tr>
                        ) : products.map(item => (
                            <tr key={item.id} className="hover:bg-slate-800/30">
                                <td className="p-4 text-sm font-medium text-white">{item.name}</td>
                                <td className="p-4 text-sm text-slate-400">{item.sku || '-'}</td>
                                <td className="p-4 text-sm text-slate-400 capitalize">{item.product_type}</td>
                                <td className="p-4 text-sm text-slate-400">${parseFloat(item.price).toFixed(2)} / {item.unit_label}</td>
                                <td className="p-4 flex gap-3 justify-end">
                                    <button onClick={() => { setFormData(item); setIsEditing(true); }} className="text-slate-400 hover:text-white"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="text-rose-400 hover:text-rose-300"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductCatalog;

