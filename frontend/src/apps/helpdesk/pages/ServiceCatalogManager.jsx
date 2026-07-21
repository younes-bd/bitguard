import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Tag, Box, Server, Shield, Cloud, Smartphone, Monitor } from 'lucide-react';
import serviceService from '../../../core/api/serviceService';
import { toast } from 'react-hot-toast';

export default function ServiceCatalogManager() {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', sku: '', category: '',
        base_price: 0, pricing_type: 'monthly', billing_cycle: 'monthly',
        visibility: 'client', is_active: true, is_featured: false, approval_required: false
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [svcRes, catRes] = await Promise.all([
                serviceService.getServiceItems(),
                serviceService.client.get('/services/service-categories/')
            ]);
            setServices(svcRes);
            setCategories(catRes.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load catalog data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredServices = services.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.sku && s.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleOpenModal = (service = null) => {
        if (service) {
            setFormData({
                id: service.id,
                name: service.name,
                description: service.description,
                sku: service.sku || '',
                category: service.category,
                base_price: service.base_price || 0,
                pricing_type: service.pricing_type,
                visibility: service.visibility,
                is_active: service.is_active,
                is_featured: service.is_featured,
                approval_required: service.approval_required
            });
        } else {
            setFormData({
                name: '', description: '', sku: '', category: categories[0]?.id || '',
                base_price: 0, pricing_type: 'monthly', billing_cycle: 'monthly',
                visibility: 'client', is_active: true, is_featured: false, approval_required: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (formData.id) {
                // Update
                await serviceService.client.patch(`/services/service-items/${formData.id}/`, formData);
                toast.success("Service updated successfully");
            } else {
                // Create
                await serviceService.client.post('/services/service-items/', formData);
                toast.success("Service created successfully");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save service");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await serviceService.client.delete(`/services/service-items/${id}/`);
            toast.success("Service deleted");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete service");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Catalog</h1>
                    <p className="text-gray-500 mt-1">Manage IT services, SLAs, and pricing models.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 font-medium">Service Name</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Base Price</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">Loading catalog...</td>
                                </tr>
                            ) : filteredServices.map(service => {
                                const catName = categories.find(c => c.id === service.category)?.name || 'Unknown';
                                return (
                                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                                    <Box className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{service.name}</div>
                                                    <div className="text-xs text-gray-500">{service.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{catName}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                            ${parseFloat(service.base_price).toFixed(2)} 
                                            <span className="text-xs text-gray-500 ml-1 block">{service.pricing_type}</span>
                                        </td>
                                        <td className="p-4">
                                            {service.is_active ? (
                                                <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => handleOpenModal(service)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold dark:text-white">
                                {formData.id ? 'Edit Service' : 'Add New Service'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4 text-white">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 text-sm">
                                    <label className="text-gray-400">Service Name *</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg" />
                                </div>
                                <div className="space-y-1 text-sm">
                                    <label className="text-gray-400">SKU</label>
                                    <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg" />
                                </div>
                                <div className="space-y-1 text-sm">
                                    <label className="text-gray-400">Category *</label>
                                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg">
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <label className="text-gray-400">Base Price *</label>
                                    <input required type="number" step="0.01" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg" />
                                </div>
                                <div className="space-y-1 text-sm">
                                    <label className="text-gray-400">Pricing Type</label>
                                    <select value={formData.pricing_type} onChange={e => setFormData({...formData, pricing_type: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg">
                                        <option value="free">Free</option>
                                        <option value="one_time">One Time</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="annual">Annual</option>
                                        <option value="per_seat">Per Seat</option>
                                    </select>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <label className="text-gray-400">Visibility</label>
                                    <select value={formData.visibility} onChange={e => setFormData({...formData, visibility: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg">
                                        <option value="internal">Internal Only</option>
                                        <option value="client">Client Facing</option>
                                        <option value="self_service">Self Service</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-1 text-sm">
                                <label className="text-gray-400">Description *</label>
                                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg" />
                            </div>

                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="rounded bg-gray-900 border-gray-700" />
                                    <span className="text-sm">Active Service</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.approval_required} onChange={e => setFormData({...formData, approval_required: e.target.checked})} className="rounded bg-gray-900 border-gray-700" />
                                    <span className="text-sm">Requires Approval</span>
                                </label>
                            </div>

                            <div className="border-t border-gray-700 pt-4 flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-300 hover:text-white">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                                    {isSubmitting ? 'Saving...' : 'Save Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
