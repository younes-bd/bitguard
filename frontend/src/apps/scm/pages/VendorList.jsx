import React, { useState, useEffect } from 'react';
import { Search, Plus, Globe, Phone, Mail, ChevronRight } from 'lucide-react';
import scmService from '../../../core/api/scmService';

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        scmService.getVendors({ search }).then(d => {
            setVendors(d?.results ?? d ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [search]);

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Vendors</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{vendors.length} suppliers</p>
                </div>
                <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /><span>Add Vendor</span>
                </button>
            </div>
            <div className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search vendors..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-3 text-center py-16 text-slate-500">Loading vendors...</div>
                ) : vendors.length === 0 ? (
                    <div className="col-span-3 text-center py-16 text-slate-500">No vendors found</div>
                ) : vendors.map(vendor => (
                    <div key={vendor.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-orange-500/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold text-sm">
                                {(vendor.name?.[0] ?? 'V').toUpperCase()}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${vendor.is_active !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                {vendor.is_active !== false ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-white font-semibold">{vendor.name}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{vendor.category ?? vendor.type ?? 'Supplier'}</p>
                        <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                            {vendor.email && <div className="flex items-center gap-2"><Mail size={11} />{vendor.email}</div>}
                            {vendor.phone && <div className="flex items-center gap-2"><Phone size={11} />{vendor.phone}</div>}
                            {vendor.website && <div className="flex items-center gap-2"><Globe size={11} />{vendor.website}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorList;
