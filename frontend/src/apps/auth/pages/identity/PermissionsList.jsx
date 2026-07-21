import React, { useState, useEffect } from 'react';
import { Shield, Lock, Search, Filter, ShieldCheck, ShieldAlert, Loader2, Info } from 'lucide-react';
import { iamService } from '../../../../core/api/iamService';
import { toast } from 'react-hot-toast';

const PermissionsList = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProduct, setFilterProduct] = useState('All');

    useEffect(() => {
        const loadPermissions = async () => {
            try {
                const data = await iamService.getPermissions();
                setPermissions(data);
            } catch (error) {
                toast.error("Failed to sync permission matrix");
            } finally {
                setLoading(false);
            }
        };
        loadPermissions();
    }, []);

    const filteredPermissions = permissions.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProduct = filterProduct === 'All' || p.product === filterProduct;
        return matchesSearch && matchesProduct;
    });

    const products = ['All', ...new Set(permissions.map(p => p.product))];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest animate-pulse">Scanning Security Matrix...</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4 font-['Outfit']">
                        <Shield className="text-purple-500" size={40} />
                        Granular Permissions
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                        Reference of all atomic security vectors available for RBAC policy enforcement. These permissions are immutable and managed by the BitGuard Core.
                    </p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                    <ShieldCheck className="text-purple-400" size={20} />
                    <span className="text-xs font-black text-purple-300 uppercase tracking-widest">{permissions.length} Total Vectors</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by code, name or impact..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex gap-2">
                    {products.map(prod => (
                        <button
                            key={prod}
                            onClick={() => setFilterProduct(prod)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filterProduct === prod ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                        >
                            {prod}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPermissions.map(p => (
                    <div key={p.id} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 text-purple-500">
                            <Lock size={48} />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">{p.product} VECTOR</span>
                                <ShieldAlert size={16} className="text-slate-700 group-hover:text-purple-500/50 transition-colors" />
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{p.name}</h3>
                                <code className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded mt-2 inline-block border border-slate-800">{p.code}</code>
                            </div>
                            
                            <p className="text-xs text-slate-500 leading-relaxed min-h-[3em]">
                                {p.description}
                            </p>
                            
                            <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                                    <Info size={12} /> Enforcement Active
                                </div>
                                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPermissions.length === 0 && (
                <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-800">
                        <Search size={32} className="text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-medium">No security vectors match your current search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default PermissionsList;
