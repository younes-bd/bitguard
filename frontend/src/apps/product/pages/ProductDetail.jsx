import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save, ArrowLeft, Package, DollarSign, Tag, Layers,
  BarChart2, Settings, Truck, Star, Copy, Archive
} from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../api/productService';

const TABS = [
  { id: 'general', label: 'General', icon: Package },
  { id: 'variants', label: 'Variants', icon: Layers },
  { id: 'sales', label: 'Sales', icon: DollarSign },
  { id: 'purchase', label: 'Purchase', icon: Truck },
  { id: 'accounting', label: 'Accounting', icon: BarChart2 },
];

const INITIAL_FORM = {
  name: '', slug: '', internal_reference: '', barcode: '', sku: '',
  description: '', description_sale: '', description_purchase: '',
  product_type: 'digital', status: 'draft',
  price: '', discount_price: '',
  brand: '', vendor: '', weight: '', dimensions: '',
  warranty_months: 12, license_type: '', delivery_type: 'instant',
  unit_label: 'unit', min_quantity: 1, max_quantity: '',
  is_featured: false, sales_ok: true, purchase_ok: true, track_stock: false,
  stock_quantity: 0, is_rental: false,
  category_ids: [], tag_ids: [],
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new' || id === 'undefined' || id === 'null';
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState(INITIAL_FORM);
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id && id !== 'undefined' && id !== 'null') {
      loadProduct();
    }
    loadCategories();
  }, [id, isNew]);

  const loadProduct = async () => {
    if (!id || id === 'new' || id === 'undefined' || id === 'null') return;
    setLoading(true);
    try {
      const res = await productService.getProduct(id);
      const p = res.data;
      setForm({
        name: p.name || '', slug: p.slug || '',
        internal_reference: p.internal_reference || '',
        barcode: p.barcode || '', sku: p.sku || '',
        description: p.description || '',
        description_sale: p.description_sale || '',
        description_purchase: p.description_purchase || '',
        product_type: p.product_type || 'digital',
        status: p.status || 'draft',
        price: p.price || '', discount_price: p.discount_price || '',
        brand: p.brand || '', vendor: p.vendor || '',
        weight: p.weight || '', dimensions: p.dimensions || '',
        warranty_months: p.warranty_months || 12,
        license_type: p.license_type || '',
        delivery_type: p.delivery_type || 'instant',
        unit_label: p.unit_label || 'unit',
        min_quantity: p.min_quantity || 1,
        max_quantity: p.max_quantity || '',
        is_featured: p.is_featured || false,
        sales_ok: p.sales_ok !== undefined ? p.sales_ok : true,
        purchase_ok: p.purchase_ok !== undefined ? p.purchase_ok : true,
        track_stock: p.track_stock || false,
        stock_quantity: p.stock_quantity || 0,
        is_rental: p.is_rental || false,
        category_ids: p.categories?.map(c => c.id) || [],
        tag_ids: p.tags?.map(t => t.id) || [],
      });
      setVariants(p.variants || []);
    } catch (err) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await productService.getCategories({ page_size: 200 });
      setCategories(res.data.results || res.data || []);
    } catch {}
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Auto-generate slug from name
    if (field === 'name' && isNew) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, name: value, slug }));
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Product name is required'); return; }
    if (!form.price) { toast.error('Price is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.max_quantity) delete payload.max_quantity;
      if (!payload.discount_price) delete payload.discount_price;
      if (!payload.weight) delete payload.weight;

      if (isNew) {
        const res = await productService.createProduct(payload);
        toast.success('Product created successfully!');
        navigate(`/admin/products/${res.data.id}`);
      } else {
        await productService.updateProduct(id, payload);
        toast.success('Product saved successfully!');
      }
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Save failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    try {
      await productService.archiveProduct(id);
      toast.success('Product archived');
      setForm(prev => ({ ...prev, status: 'archived' }));
    } catch { toast.error('Archive failed'); }
  };

  const handleDuplicate = async () => {
    try {
      const res = await productService.duplicateProduct(id);
      toast.success('Product duplicated');
      navigate(`/admin/products/${res.data.id}`);
    } catch { toast.error('Duplicate failed'); }
  };

  const InputField = ({ label, field, type = 'text', className = '' }) => (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        value={form[field] || ''}
        onChange={e => handleChange(field, e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
  );

  const TextareaField = ({ label, field, rows = 3 }) => (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <textarea
        rows={rows}
        value={form[field] || ''}
        onChange={e => handleChange(field, e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
      />
    </div>
  );

  const SelectField = ({ label, field, options }) => (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <select
        value={form[field] || ''}
        onChange={e => handleChange(field, e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  const CheckboxField = ({ label, field }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={form[field] || false}
        onChange={e => handleChange(field, e.target.checked)}
        className="w-4 h-4 rounded accent-violet-500"
      />
      <span className="text-sm text-slate-300">{label}</span>
    </label>
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isNew ? 'New Product' : form.name || 'Product'}
            </h1>
            <p className="text-slate-400 text-sm">
              {isNew ? 'Fill in the details below' : `ID: ${id}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <>
              <button
                onClick={handleDuplicate}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
              >
                <Copy className="w-4 h-4" /> Duplicate
              </button>
              {form.status !== 'archived' && (
                <button
                  onClick={handleArchive}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                >
                  <Archive className="w-4 h-4" /> Archive
                </button>
              )}
            </>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : (isNew ? 'Create Product' : 'Save Changes')}
          </button>
        </div>
      </div>

      {/* Status + Type badges */}
      {!isNew && (
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            form.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
            form.status === 'archived' ? 'bg-slate-500/15 text-slate-400 border border-slate-500/30' :
            'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
          }`}>{form.status}</span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
            {form.product_type}
          </span>
          {form.is_featured && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-700/50">
        <nav className="flex gap-1" aria-label="Tabs">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">

        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Product Name *" field="name" className="md:col-span-2" />
              <InputField label="Internal Reference (SKU)" field="internal_reference" />
              <InputField label="Barcode (EAN/UPC)" field="barcode" />
              <InputField label="URL Slug" field="slug" />
              <SelectField
                label="Product Type *"
                field="product_type"
                options={[
                  { value: 'digital', label: 'Digital Download' },
                  { value: 'physical', label: 'Physical Hardware' },
                  { value: 'subscription', label: 'Subscription/Service' },
                  { value: 'service_bundle', label: 'Service Bundle' },
                  { value: 'service', label: 'Professional Service' },
                ]}
              />
              <SelectField
                label="Status"
                field="status"
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'active', label: 'Active' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </div>
            <TextareaField label="Description" field="description" rows={4} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              <CheckboxField label="Can be Sold" field="sales_ok" />
              <CheckboxField label="Can be Purchased" field="purchase_ok" />
              <CheckboxField label="Featured" field="is_featured" />
              <CheckboxField label="Track Stock" field="track_stock" />
              <CheckboxField label="Available for Rental" field="is_rental" />
            </div>
          </div>
        )}

        {/* VARIANTS TAB */}
        {activeTab === 'variants' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">Product Variants</h3>
              <p className="text-xs text-slate-400">{variants.length} variant(s)</p>
            </div>
            {variants.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No variants configured</p>
                <p className="text-xs mt-1">Configure attributes first, then variants will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {variants.map(v => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">{v.variant_label || v.sku || `Variant #${v.id}`}</p>
                      <p className="text-xs text-slate-400">SKU: {v.sku || '—'} | Stock: {v.stock_quantity}</p>
                    </div>
                    <div className="text-sm text-slate-300">
                      {v.price_extra > 0 ? `+$${parseFloat(v.price_extra).toFixed(2)}` : 'Base price'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SALES TAB */}
        {activeTab === 'sales' && (
          <div className="space-y-5">
            <h3 className="font-medium text-white border-b border-slate-700/50 pb-3">Pricing & Sales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Sales Price *" field="price" type="number" />
              <InputField label="Discount Price" field="discount_price" type="number" />
              <InputField label="Unit of Measure" field="unit_label" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Min. Order Qty" field="min_quantity" type="number" />
              <InputField label="Max. Order Qty" field="max_quantity" type="number" />
              <InputField label="Current Stock" field="stock_quantity" type="number" />
            </div>
            <TextareaField label="Sales Description (shown on invoices)" field="description_sale" rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Delivery Type"
                field="delivery_type"
                options={[
                  { value: 'instant', label: 'Instant Download' },
                  { value: 'email', label: 'Email Delivery' },
                  { value: 'shipping', label: 'Physical Shipping' },
                ]}
              />
              <InputField label="License Type" field="license_type" />
            </div>
          </div>
        )}

        {/* PURCHASE TAB */}
        {activeTab === 'purchase' && (
          <div className="space-y-5">
            <h3 className="font-medium text-white border-b border-slate-700/50 pb-3">Purchase & Vendor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Brand / Manufacturer" field="brand" />
              <InputField label="Vendor / Distributor" field="vendor" />
              <InputField label="Weight (kg)" field="weight" type="number" />
              <InputField label="Dimensions (L × W × H)" field="dimensions" />
              <InputField label="Warranty (months)" field="warranty_months" type="number" />
            </div>
            <TextareaField label="Purchase Description" field="description_purchase" rows={3} />
          </div>
        )}

        {/* ACCOUNTING TAB */}
        {activeTab === 'accounting' && (
          <div className="space-y-5">
            <h3 className="font-medium text-white border-b border-slate-700/50 pb-3">Accounting Configuration</h3>
            <p className="text-sm text-slate-400">
              Accounting fields (tax configuration, income account, expense account) are linked to the
              Accounting module. These can be configured via the Accounting → Chart of Accounts section.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">Income Account</p>
                <p className="text-sm text-slate-300">Linked via accounting configuration</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">Expense Account</p>
                <p className="text-sm text-slate-300">Linked via accounting configuration</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">Tax Configuration</p>
                <p className="text-sm text-slate-300">Linked via accounting tax rules</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
