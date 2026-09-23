import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignsService } from '../api/campaignsService';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const MailingListFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    is_public: true,
    active: true
  });

  useEffect(() => {
    if (!isNew) {
      campaignsService.getList(id)
        .then(res => {
          setFormData({
            name: res.data.name || '',
            is_public: res.data.is_public ?? true,
            active: res.data.active ?? true
          });
        })
        .catch(err => {
          toast.error('Failed to load list');
          navigate('..');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('List name is required');
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        await campaignsService.createList(formData);
        toast.success('Mailing list created');
        navigate('..');
      } else {
        await campaignsService.updateList(id, formData);
        toast.success('Mailing list updated');
      }
    } catch (e) {
      toast.error('Failed to save mailing list');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
    try {
      await campaignsService.deleteList(id);
      toast.success('Mailing list deleted');
      navigate('..');
    } catch (e) {
      toast.error('Failed to delete list');
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('..')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isNew ? 'New Mailing List' : formData.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && (
            <button 
              onClick={handleDelete}
              className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
              title="Delete List"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all font-medium"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save List'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">List Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="e.g. Newsletter Subscribers"
          />
        </div>

        <div className="flex gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-950"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Public List</span>
              <span className="text-xs text-slate-500">Allow users to subscribe on the website</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-950"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Active</span>
              <span className="text-xs text-slate-500">List is available for new campaigns</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MailingListFormPage;
