import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignsService } from '../api/campaignsService';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Send, Calendar, Users } from 'lucide-react';

const CampaignFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [mailingLists, setMailingLists] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body_html: '',
    mailing_list: ''
  });

  const [campaignState, setCampaignState] = useState('draft');
  const [sentStats, setSentStats] = useState({ count: 0, date: null });

  useEffect(() => {
    // Load mailing lists
    campaignsService.getLists().then(res => setMailingLists(Array.isArray(res.data?.results || res.data) ? (res.data?.results || res.data) : []));

    if (!isNew) {
      campaignsService.getItem(id)
        .then(res => {
          setFormData({
            name: res.data.name || '',
            subject: res.data.subject || '',
            body_html: res.data.body_html || '',
            mailing_list: res.data.mailing_list || ''
          });
          setCampaignState(res.data.state);
          setSentStats({
            count: res.data.sent_count,
            date: res.data.sent_date
          });
        })
        .catch(err => {
          toast.error('Failed to load campaign');
          navigate('..');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isNew) {
        const res = await campaignsService.createItem(formData);
        toast.success('Campaign created');
        navigate(`../${res.data.id}`, { replace: true });
      } else {
        await campaignsService.updateItem(id, formData);
        toast.success('Campaign saved');
      }
    } catch (e) {
      toast.error('Failed to save campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!formData.mailing_list) {
      toast.error('Please select a mailing list first.');
      return;
    }
    
    // Save first if there are unsaved changes
    await handleSave();

    try {
      setSaving(true);
      const res = await campaignsService.sendCampaign(id);
      setCampaignState(res.data.state);
      setSentStats({ count: res.data.sent_count, date: res.data.sent_date });
      toast.success('Campaign sent successfully!');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to send campaign');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;

  const isReadOnly = campaignState === 'sent' || campaignState === 'sending';

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('..')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {isNew ? 'New Campaign' : formData.name}
              {!isNew && (
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full uppercase tracking-wider
                  ${campaignState === 'draft' ? 'bg-slate-800 text-slate-300' : 
                    campaignState === 'sent' ? 'bg-emerald-500/10 text-emerald-400' : 
                    'bg-amber-500/10 text-amber-400'}`}>
                  {campaignState}
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isReadOnly && (
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          )}
          
          {!isNew && !isReadOnly && (
            <button 
              onClick={handleSend}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all font-medium"
            >
              <Send size={16} />
              Send Now
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium text-white mb-4">Campaign Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Internal Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  placeholder="e.g. Black Friday 2026 Promo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  placeholder="Subject line for the recipients"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col min-h-[400px]">
            <h2 className="text-lg font-medium text-white mb-4">Email Body (HTML)</h2>
            <textarea 
              name="body_html"
              value={formData.body_html}
              onChange={handleChange}
              disabled={isReadOnly}
              className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-300 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50"
              placeholder="<h1>Hello World!</h1>"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Users size={18} className="text-slate-400" />
              Recipients
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Mailing List</label>
              <select
                name="mailing_list"
                value={formData.mailing_list || ''}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">-- Select a List --</option>
                {mailingLists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>
          </div>

          {campaignState === 'sent' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <h2 className="text-lg font-medium text-emerald-400 mb-4">Delivery Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Sent Date</span>
                  <span className="text-white font-medium">{new Date(sentStats.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Sent</span>
                  <span className="text-white font-medium">{sentStats.count}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignFormPage;
