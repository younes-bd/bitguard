import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../api/productService';

export default function AttributeList() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [showAttrModal, setShowAttrModal] = useState(false);
  const [editingAttr, setEditingAttr] = useState(null);
  const [attrForm, setAttrForm] = useState({ name: '' });
  const [showValModal, setShowValModal] = useState(false);
  const [selectedAttr, setSelectedAttr] = useState(null);
  const [attrValues, setAttrValues] = useState([]);
  const [valForm, setValForm] = useState({ value: '' });

  useEffect(() => { loadAttributes(); }, []);

  const loadAttributes = async () => {
    setLoading(true);
    try {
      const res = await productService.getAttributes({ page_size: 200 });
      setAttributes(res.data.results || res.data || []);
    } catch { toast.error('Failed to load attributes'); }
    finally { setLoading(false); }
  };

  const loadValues = async (attrId) => {
    try {
      const res = await productService.getAttributeValues({ attribute: attrId, page_size: 200 });
      setAttrValues(res.data.results || res.data || []);
    } catch {}
  };

  const saveAttribute = async () => {
    if (!attrForm.name.trim()) { toast.error('Name required'); return; }
    try {
      if (editingAttr) {
        await productService.updateAttribute(editingAttr.id, attrForm);
        toast.success('Attribute updated');
      } else {
        await productService.createAttribute(attrForm);
        toast.success('Attribute created');
      }
      setShowAttrModal(false);
      loadAttributes();
    } catch { toast.error('Save failed'); }
  };

  const deleteAttribute = async (id) => {
    if (!window.confirm('Delete this attribute and all its values?')) return;
    try {
      await productService.deleteAttribute(id);
      toast.success('Deleted');
      loadAttributes();
    } catch { toast.error('Delete failed'); }
  };

  const openValueModal = async (attr) => {
    setSelectedAttr(attr);
    await loadValues(attr.id);
    setValForm({ value: '' });
    setShowValModal(true);
  };

  const saveValue = async () => {
    if (!valForm.value.trim()) { toast.error('Value required'); return; }
    try {
      await productService.createAttributeValue({ attribute: selectedAttr.id, value: valForm.value });
      toast.success('Value added');
      setValForm({ value: '' });
      loadValues(selectedAttr.id);
    } catch { toast.error('Save failed'); }
  };

  const deleteValue = async (id) => {
    try {
      await productService.deleteAttributeValue(id);
      toast.success('Value deleted');
      loadValues(selectedAttr.id);
    } catch { toast.error('Delete failed'); }
  };

  const filtered = attributes.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Attributes</h1>
          <p className="text-slate-400 text-sm mt-1">Manage product attributes and their values</p>
        </div>
        <button
          onClick={() => { setEditingAttr(null); setAttrForm({ name: '' }); setShowAttrModal(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Attribute
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text" placeholder="Search attributes..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400 font-medium">No attributes found</p>
          </div>
        ) : (
          filtered.map(attr => (
            <div key={attr.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-violet-400" />
                  <span className="font-medium text-white">{attr.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openValueModal(attr)}
                    className="px-2.5 py-1 text-xs bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-lg hover:bg-violet-500/25 transition-colors"
                  >
                    Manage Values
                  </button>
                  <button onClick={() => { setEditingAttr(attr); setAttrForm({ name: attr.name }); setShowAttrModal(true); }} className="p-1.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteAttribute(attr.id)} className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Attribute Modal */}
      {showAttrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">{editingAttr ? 'Edit Attribute' : 'New Attribute'}</h2>
            <input
              placeholder="Attribute name (e.g. Color, Size)"
              value={attrForm.name}
              onChange={e => setAttrForm({ name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={saveAttribute} className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium">Save</button>
              <button onClick={() => setShowAttrModal(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Values Modal */}
      {showValModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-1">{selectedAttr?.name} Values</h2>
            <p className="text-slate-400 text-sm mb-4">{attrValues.length} value(s)</p>
            <div className="flex gap-2 mb-4">
              <input
                placeholder="Add value (e.g. Red, XL)"
                value={valForm.value}
                onChange={e => setValForm({ value: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && saveValue()}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button onClick={saveValue} className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {attrValues.map(v => (
                <div key={v.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                  <span className="text-sm text-white">{v.value}</span>
                  <button onClick={() => deleteValue(v.id)} className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowValModal(false)} className="w-full mt-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
