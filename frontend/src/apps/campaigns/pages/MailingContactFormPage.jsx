import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignsService } from '../api/campaignsService';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const MailingContactFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mailingLists, setMailingLists] = useState([]);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    opt_out: false,
    lists: []
  });

  useEffect(() => {
    // Load available mailing lists
    campaignsService.getLists()
      .then(res => setMailingLists(Array.isArray(res.data?.results || res.data) ? (res.data?.results || res.data) : []))
      .then(() => {
        if (!isNew) {
          return campaignsService.getContact(id);
        }
      })
      .then(res => {
        if (res) {
          setFormData({
            email: res.data.email || '',
            name: res.data.name || '',
            opt_out: res.data.opt_out ?? false,
            lists: res.data.lists || []
          });
        }
      })
      .catch(err => {
        toast.error('Failed to load data');
        if (!isNew) navigate('..');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleListToggle = (listId) => {
    setFormData(prev => {
      const isSelected = prev.lists.includes(listId);
      return {
        ...prev,
        lists: isSelected 
          ? prev.lists.filter(id => id !== listId)
          : [...prev.lists, listId]
      };
    });
  };

  const handleSave = async () => {
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        await campaignsService.createContact(formData);
        toast.success('Contact created');
        navigate('..');
      } else {
        await campaignsService.updateContact(id, formData);
        toast.success('Contact updated');
      }
    } catch (e) {
      toast.error('Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await campaignsService.deleteContact(id);
      toast.success('Contact deleted');
      navigate('..');
    } catch (e) {
      toast.error('Failed to delete contact');
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('..')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isNew ? 'New Contact' : formData.email}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && (
            <button 
              onClick={handleDelete}
              className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
              title="Delete Contact"
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
            {saving ? 'Saving...' : 'Save Contact'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Contact Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="opt_out"
                checked={formData.opt_out}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-red-600 focus:ring-red-600 focus:ring-offset-slate-950"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-red-400">Opted Out</span>
                <span className="text-xs text-slate-500">Do not send emails to this contact</span>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-slate-400 mb-4">Subscribed Lists</h2>
          
          {mailingLists.length === 0 ? (
            <p className="text-slate-500 text-sm">No mailing lists available.</p>
          ) : (
            <div className="space-y-3">
              {mailingLists.map(list => (
                <label key={list.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input 
                    type="checkbox"
                    checked={formData.lists.includes(list.id)}
                    onChange={() => handleListToggle(list.id)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900"
                  />
                  <span className="text-white text-sm">{list.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MailingContactFormPage;
