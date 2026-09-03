import React, { useState } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductSettings() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    enableVariants: true,
    enableUOM: false,
    enablePackaging: false,
    enableSerialTracking: true,
    defaultCostMethod: 'standard',
    enableEcommerce: true,
    autoGenerateSKU: false,
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call to settings service
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast.success('Product settings saved successfully');
  };

  const SettingToggle = ({ label, desc, field }) => (
    <div className="flex items-start justify-between py-4 border-b border-slate-700/50 last:border-0">
      <div>
        <h3 className="text-sm font-medium text-white">{label}</h3>
        <p className="text-xs text-slate-400 mt-1">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input 
          type="checkbox" 
          className="sr-only peer"
          checked={form[field]}
          onChange={(e) => handleChange(field, e.target.checked)}
        />
        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
      </label>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure global catalog and product behaviors</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
        <div className="text-sm text-blue-200">
          Settings configured here will apply globally across the ERP. Note that changing cost methods will only affect new products.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Catalog & Variants */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-violet-400">
            <Settings className="w-5 h-5" />
            <h2 className="font-semibold text-white">Catalog Features</h2>
          </div>
          <div className="space-y-1">
            <SettingToggle 
              label="Variants" 
              desc="Sell products with different attributes (Size, Color, etc.)" 
              field="enableVariants" 
            />
            <SettingToggle 
              label="Units of Measure" 
              desc="Sell in different units of measure (e.g. Dozens vs. Units)" 
              field="enableUOM" 
            />
            <SettingToggle 
              label="Product Packaging" 
              desc="Sell products by package type (e.g. Pallet, Box)" 
              field="enablePackaging" 
            />
          </div>
        </div>

        {/* Operations */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Settings className="w-5 h-5" />
            <h2 className="font-semibold text-white">Operations & Traceability</h2>
          </div>
          <div className="space-y-1">
            <SettingToggle 
              label="Lots & Serial Numbers" 
              desc="Get full traceability from vendors to customers" 
              field="enableSerialTracking" 
            />
            <SettingToggle 
              label="eCommerce Integration" 
              desc="Sync products directly with the online storefront" 
              field="enableEcommerce" 
            />
            <SettingToggle 
              label="Auto-generate SKUs" 
              desc="Automatically assign random 8-digit SKUs to new products" 
              field="autoGenerateSKU" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
