import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, Package, Tag, Archive,
  Copy, ChevronDown, BarChart2, Star, RefreshCw,
  Image as ImageIcon, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../api/productService';

const STATUS_CONFIG = {
  active:   { label: 'Active',   cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  draft:    { label: 'Draft',    cls: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  archived: { label: 'Archived', cls: 'bg-slate-500/15 text-slate-400 border border-slate-500/30' },
};

const TYPE_LABELS = {
  digital: 'Digital',
  physical: 'Physical',
  subscription: 'Subscription',
  service_bundle: 'Bundle',
  service: 'Service',
};

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState('-created_at');
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
        ordering: sortField,
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.product_type = typeFilter;

      const res = await productService.getProducts(params);
      const data = res.data;
      setProducts(data.results || data);
      setTotal(data.count || (Array.isArray(data) ? data.length : 0));
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, typeFilter, sortField]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await productService.getProductStats();
      setStats(res.data);
    } catch {}
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleArchive = async (id, e) => {
    e.stopPropagation();
    try {
      await productService.archiveProduct(id);
      toast.success('Product archived');
      fetchProducts();
      fetchStats();
    } catch {
      toast.error('Failed to archive');
    }
  };

  const handleDuplicate = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await productService.duplicateProduct(id);
      toast.success('Product duplicated');
      navigate(`/admin/products/${res.data.id}`);
    } catch {
      toast.error('Failed to duplicate');
    }
  };

  const toggleSort = (field) => {
    setSortField(prev => prev === field ? `-${field}` : field);
    setPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortField === field) return <ChevronUp className="w-3 h-3 inline ml-1" />;
    if (sortField === `-${field}`) return <ChevronDown className="w-3 h-3 inline ml-1" />;
    return null;
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">{total} products total</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: stats.total, icon: Package, color: 'text-violet-400' },
            { label: 'Active', value: stats.by_status?.active || 0, icon: BarChart2, color: 'text-emerald-400' },
            { label: 'Featured', value: stats.featured || 0, icon: Star, color: 'text-yellow-400' },
            { label: 'Low Stock', value: stats.low_stock || 0, icon: Tag, color: 'text-red-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, SKU, brand..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Types</option>
          <option value="digital">Digital</option>
          <option value="physical">Physical</option>
          <option value="subscription">Subscription</option>
          <option value="service_bundle">Bundle</option>
          <option value="service">Service</option>
        </select>
        <button
          onClick={() => { setSearch(''); setStatusFilter(''); setTypeFilter(''); setPage(1); }}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
          title="Clear filters"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider w-10">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Image</th>
                <th
                  className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => toggleSort('name')}
                >
                  Name <SortIcon field="name" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th
                  className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => toggleSort('price')}
                >
                  Price <SortIcon field="price" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No products found</p>
                    <p className="text-xs mt-1">Try adjusting your filters or create a new product</p>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr
                    key={product.id}
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    className="hover:bg-slate-700/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-slate-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{product.name}</div>
                      {product.internal_reference || product.sku ? (
                        <div className="text-xs text-slate-400">{product.internal_reference || product.sku}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {TYPE_LABELS[product.product_type] || product.product_type}
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-medium">
                      ${parseFloat(product.price || 0).toFixed(2)}
                      {product.discount_price && (
                        <div className="text-xs text-emerald-400 line-through">
                          ${parseFloat(product.discount_price).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {product.track_stock ? (
                        <span className={product.stock_quantity < 5 ? 'text-red-400 font-medium' : ''}>
                          {product.stock_quantity}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        STATUS_CONFIG[product.status]?.cls || STATUS_CONFIG.draft.cls
                      }`}>
                        {STATUS_CONFIG[product.status]?.label || product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDuplicate(product.id, e)}
                          title="Duplicate"
                          className="p-1.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {product.status !== 'archived' && (
                          <button
                            onClick={(e) => handleArchive(product.id, e)}
                            title="Archive"
                            className="p-1.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">
              Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
