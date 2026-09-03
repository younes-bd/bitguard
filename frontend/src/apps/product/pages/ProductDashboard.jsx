import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Tag, Layers, Star, TrendingUp, BarChart2, FolderOpen, ArrowRight, RefreshCw } from 'lucide-react';
import productService from '../api/productService';

export default function ProductDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getProductStats(),
      productService.getProducts({ page_size: 5, ordering: '-created_at' }),
    ]).then(([statsRes, recentRes]) => {
      setStats(statsRes.data);
      setRecent(recentRes.data.results || recentRes.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const kpis = stats ? [
    { label: 'Total Products', value: stats.total || 0, icon: Package, color: 'text-violet-400', bg: 'bg-violet-500/10', link: '/admin/products' },
    { label: 'Active Products', value: stats.by_status?.active || 0, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', link: '/admin/products?status=active' },
    { label: 'Draft Products', value: stats.by_status?.draft || 0, icon: BarChart2, color: 'text-yellow-400', bg: 'bg-yellow-500/10', link: '/admin/products?status=draft' },
    { label: 'Featured', value: stats.featured || 0, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10', link: '/admin/products' },
    { label: 'Low Stock Alerts', value: stats.low_stock || 0, icon: Tag, color: 'text-red-400', bg: 'bg-red-500/10', link: '/admin/products' },
    { label: 'Archived', value: stats.by_status?.archived || 0, icon: FolderOpen, color: 'text-slate-400', bg: 'bg-slate-500/10', link: '/admin/products?status=archived' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Master data dashboard</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Package className="w-4 h-4" /> New Product
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {kpis.map(({ label, value, icon: Icon, color, bg, link }) => (
            <button
              key={label}
              onClick={() => navigate(link)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-left hover:border-slate-600 transition-all group"
            >
              <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Manage Products', desc: 'View all products, create and edit', path: '/admin/products', icon: Package },
          { label: 'Categories', desc: 'Organize products into categories', path: '/admin/products/categories', icon: FolderOpen },
          { label: 'Attributes', desc: 'Manage variants attributes', path: '/admin/products/attributes', icon: Tag },
        ].map(({ label, desc, path, icon: Icon }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-left hover:border-violet-500/50 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Icon className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
          </button>
        ))}
      </div>

      {/* Recent products */}
      {recent.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Products</h2>
            <button onClick={() => navigate('/admin/products')} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {recent.map(p => (
              <button
                key={p.id}
                onClick={() => navigate(`/admin/products/${p.id}`)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                    <Package className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.product_type} · {p.status}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-300">${parseFloat(p.price || 0).toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
