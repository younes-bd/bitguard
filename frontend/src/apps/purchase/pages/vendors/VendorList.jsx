import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search, Filter, Mail, Phone, MapPin, MoreHorizontal, FileText, CheckCircle2 } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';

const VendorList = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await erpService.getVendors();
                setVendors(data || []);
            } catch (err) {
                console.error("Failed to load vendors", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Building2 className="text-emerald-500" />
                        Vendor Management
                    </h1>
                    <p className="text-sm text-slate-400">Manage suppliers, contractors, and purchase channels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search vendors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white w-64 transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => navigate('/admin/purchase/vendors/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <Plus size={18} />
                        <span>Add Vendor</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                    <div key={vendor.id} className="glass-panel rounded-2xl border border-slate-800 p-6 hover:border-emerald-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-emerald-400 group-hover:scale-110 transition-transform">
                                    {vendor.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{vendor.name}</h3>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        {vendor.is_active ? (
                                            <><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Vendor</>
                                        ) : (
                                            <><span className="w-2 h-2 rounded-full bg-slate-500"></span> Inactive</>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <button className="p-2 text-slate-600 hover:text-white transition-colors">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            {vendor.contact_name && (
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-6 text-center text-slate-500"><Building2 size={14} className="mx-auto" /></div>
                                    {vendor.contact_name}
                                </div>
                            )}
                            {vendor.email && (
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-6 text-center text-slate-500"><Mail size={14} className="mx-auto" /></div>
                                    <a href={`mailto:${vendor.email}`} className="hover:text-emerald-400 transition-colors">{vendor.email}</a>
                                </div>
                            )}
                            {vendor.phone && (
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-6 text-center text-slate-500"><Phone size={14} className="mx-auto" /></div>
                                    {vendor.phone}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">POs</div>
                                    <div className="text-sm font-bold text-white">{vendor.po_count || 0}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Terms</div>
                                    <div className="text-sm font-bold text-white">{vendor.payment_terms.replace('_', ' ')}</div>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                                View Profile <FileText size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredVendors.length === 0 && (
                <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 flex flex-col items-center">
                    <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-4">
                        <Building2 size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No Vendors Found</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">You haven't added any vendors yet. Add your suppliers and contractors to start managing purchase orders.</p>
                    <button 
                        onClick={() => navigate('/admin/purchase/vendors/create')}
                        className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors"
                    >
                        Add Your First Vendor
                    </button>
                </div>
            )}
        </div>
    );
};

export default VendorList;
