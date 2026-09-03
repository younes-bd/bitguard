import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, FolderOpen, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../api/productService';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', is_visible: true, parent_category: '' });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await productService.getCategories({ page_size: 200 });
      setCategories(res.data.results || res.data || []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', is_visible: true, parent_category: '' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', is_visible: cat.is_visible, parent_category: cat.parent_category || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name required'); return; }
    const payload = { ...form };
    if (!payload.slug) payload.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!payload.parent_category) delete payload.parent_category;
    try {
      if (editing) {
        await productService.updateCategory(editing.id, payload);
        toast.success('Category updated');
      } else {
        await productService.createCategory(payload);
        toast.success('Category created');
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      toast.error('Save failed: ' + (err.response?.data?.slug?.[0] || JSON.stringify(err.response?.data || 'Error')));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await productService.deleteCategory(id);
      toast.success('Category deleted');
      loadCategories();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-slate-400 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400 font-medium">No categories found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Parent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Products</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Visible</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.map(cat => (
                <tr key={cat.id} className="hover:bg-slate-700/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-violet-400" />
                      <span className="text-white font-medium">{cat.complete_name || cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{cat.parent_name || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{cat.product_count ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      cat.is_visible ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'
                    }`}>
                      {cat.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(cat)} className="p-1.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Category' : 'New Category'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Slug</label>
                <input value={form.slug} onChange={e => setForm(p => ({...p, slug: e.target.value}))} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Parent Category</label>
                <select value={form.parent_category} onChange={e => setForm(p => ({...p, parent_category: e.target.value}))} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="">None (root category)</option>
                  {categories.filter(c => !editing || c.id !== editing.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_visible} onChange={e => setForm(p => ({...p, is_visible: e.target.checked}))} className="accent-violet-500" />
                <span className="text-sm text-slate-300">Visible on website</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors">Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
