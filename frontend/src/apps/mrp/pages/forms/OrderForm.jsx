import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import mrpService from '../../../../core/api/mrpService';
import { ArrowLeft, Save } from 'lucide-react';

const OrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    product_id: 1,
    qty_producing: 1,
    state: 'draft',
  });

  useEffect(() => {
    if (isEdit) {
      mrpService.getOrder(id).then(data => {
        setFormData(data);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isEdit ? mrpService.updateOrder(id, formData) : mrpService.createOrder(formData);
    action.then(() => {
      navigate('/admin/mrp/orders');
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/mrp/orders')}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {isEdit ? 'Edit Order' : 'New Order'}
          </h1>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Reference / Name</label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
              placeholder="e.g. MO/001"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Product ID</label>
            <input 
              type="number"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity Producing</label>
            <input 
              type="number"
              name="qty_producing"
              value={formData.qty_producing}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select 
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="cancel">Cancelled</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
