import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Layers, Image as ImageIcon, Copy, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../api/productService';

export default function VariantList() {
  const navigate = useNavigate();
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => { loadVariants(); }, [page, search]);

  const loadVariants = async () => {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize };
      if (search) params.search = search;
      const res = await productService.getVariants(params);
      setVariants(res.data.results || res.data || []);
      setTotal(res.data.count || (Array.isArray(res.data) ? res.data.length : 0));
    } catch { toast.error('Failed to load variants'); }
    finally { setLoading(false); }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Variants</h1>
          <p className="text-slate-400 text-sm mt-1">{total} variants across all products</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text" placeholder="Search by SKU, barcode, or product name..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Image</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Product & Variant</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">SKU / Barcode</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Extra Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded animate-pulse" /></td></tr>
                ))
              ) : variants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No variants found</p>
                  </td>
                </tr>
              ) : (
                variants.map(v => (
                  <tr key={v.id} className="hover:bg-slate-700/30 transition-colors group">
                    <td className="px-4 py-3">
                      {v.image ? (
                        <img src={v.image} alt={v.variant_label} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-slate-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{v.product_name}</div>
                      <div className="text-xs text-slate-400">{v.variant_label}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div>{v.sku || '—'}</div>
                      <div className="text-xs text-slate-500">{v.barcode || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">
                      {v.price_extra > 0 ? `+$${parseFloat(v.price_extra).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{v.stock_quantity}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        v.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'
                      }`}>
                        {v.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/products/${v.product}`)}
                        className="p-1.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                        title="Go to Product"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
