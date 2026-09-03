import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecordFormLayout from '@/core/components/shared/forms/RecordFormLayout';
import mrpService from '../../api/mrpService';
import { toast } from 'react-hot-toast';
import { Loader2, Box, Layers } from 'lucide-react';

export default function BomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [bom, setBom] = useState({
    product_name: '',
    product_id: '',
    code: '',
    quantity: 1.0,
    type: 'normal',
    routing: '',
    is_active: true,
    lines: []
  });
  
  const [routings, setRoutings] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const routingsRes = await mrpService.getRoutings();
        setRoutings(routingsRes.results || routingsRes || []);

        if (!isNew) {
          const res = await mrpService.getBOM(id);
          setBom(res.data || res);
        }
      } catch (err) {
        toast.error('Failed to load BOM details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBom(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isNew) {
        // Mock save for now since createBOM might not exist yet in API
        toast.success('BOM created (mock)');
        navigate('/mrp/boms');
      } else {
        // Mock update
        toast.success('BOM updated (mock)');
      }
    } catch (err) {
      toast.error('Failed to save BOM');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Manufacturing', href: '/mrp/overview' },
    { label: 'BOMs', href: '/mrp/boms' },
    { label: isNew ? 'New BOM' : bom.product_name || bom.code || 'BOM' }
  ];

  const actions = [
    { label: 'Save', variant: 'primary', onClick: handleSave }
  ];

  return (
    <RecordFormLayout
      title={isNew ? 'New Bill of Material' : bom.product_name || bom.code || 'BOM'}
      breadcrumbs={breadcrumbs}
      actions={actions}
      chatterModel={!isNew ? "mrp.bom" : null}
      chatterObjectId={!isNew ? id : null}
    >
      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
            <input 
              type="text" 
              name="product_name"
              value={bom.product_name || ''}
              onChange={handleChange}
              placeholder="e.g., Wooden Desk"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Product ID (Inventory Ref) */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Product ID (Inventory)</label>
            <input 
              type="number" 
              name="product_id"
              value={bom.product_id || ''}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Reference/Code */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Reference Code</label>
            <input 
              type="text" 
              name="code"
              value={bom.code || ''}
              onChange={handleChange}
              placeholder="e.g., BOM-001"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Quantity</label>
            <input 
              type="number" 
              name="quantity"
              value={bom.quantity || 1}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          {/* BOM Type */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">BOM Type</label>
            <select 
              name="type"
              value={bom.type || 'normal'}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            >
              <option value="normal">Manufacture this product</option>
              <option value="phantom">Kit / Phantom</option>
            </select>
          </div>

          {/* Routing */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Routing</label>
            <select 
              name="routing"
              value={bom.routing || ''}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            >
              <option value="">-- No Routing --</option>
              {routings.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          
          {/* Active Status */}
          <div className="flex items-center space-x-2 pt-6">
             <input 
              type="checkbox"
              name="is_active"
              checked={bom.is_active}
              onChange={handleChange}
              className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-blue-500 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-slate-400">Active</label>
          </div>
        </div>

        {/* BOM Lines */}
        {!isNew && (
          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-slate-400" /> 
              Components
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-800/50 text-slate-300 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-medium">Component</th>
                    <th className="px-6 py-3 font-medium">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {bom.lines && bom.lines.length > 0 ? (
                    bom.lines.map((line) => (
                      <tr key={line.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-200">
                          {line.component_name || `Item #${line.component_id}`}
                        </td>
                        <td className="px-6 py-4">{line.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-6 py-8 text-center text-slate-500">
                        No components defined.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </form>
    </RecordFormLayout>
  );
}
