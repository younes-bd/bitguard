import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecordFormLayout from '../../../core/components/shared/forms/RecordFormLayout';
import crmService from '../api/crmService';
import { toast } from 'react-hot-toast';
import { Loader2, User, Building, Mail, Phone, ArrowRightCircle, X, Check } from 'lucide-react';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [lead, setLead] = useState({
    title: '',
    first_name: '',
    last_name: '',
    company: '',
    email: '',
    phone: '',
    source: '',
    status: 'new',
    value: '',
    probability: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!isNew) {
          const res = await crmService.getLead(id);
          setLead(res.data);
        }
      } catch (err) {
        toast.error('Failed to load lead details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isNew) {
        const res = await crmService.createLead(lead);
        toast.success('Lead created successfully');
        navigate(`/crm/leads/${res.data.id}`);
      } else {
        await crmService.updateLead(id, lead);
        toast.success('Lead updated successfully');
      }
    } catch (err) {
      toast.error('Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  const handleConvert = async () => {
    try {
      const res = await crmService.convertLead(id);
      toast.success('Lead converted to Deal successfully!');
      // Navigate to the newly created deal
      navigate(`/crm/deals/${res.data.id}`);
    } catch (err) {
      toast.error('Failed to convert lead');
    }
  };

  const handleMarkLost = async () => {
    try {
      await crmService.markLeadLost(id);
      const res = await crmService.getLead(id);
      setLead(res.data);
      toast.success('Lead marked as lost');
    } catch (err) {
      toast.error('Failed to mark lost');
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
    { label: 'Leads', href: '/crm/leads' },
    { label: isNew ? 'New Lead' : lead.title || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unnamed Lead' }
  ];

  const actions = [];
  if (!isNew && lead.status !== 'converted' && lead.status !== 'lost') {
    actions.push({ label: 'Convert to Deal', icon: <ArrowRightCircle className="w-4 h-4" />, variant: 'success', onClick: handleConvert });
    actions.push({ label: 'Mark Lost', icon: <X className="w-4 h-4" />, variant: 'danger', onClick: handleMarkLost });
  }
  actions.push({ label: 'Save', variant: 'primary', onClick: handleSave });

  return (
    <RecordFormLayout
      title={isNew ? 'New Lead' : lead.title || 'Lead'}
      breadcrumbs={breadcrumbs}
      actions={actions}
      chatterModel={!isNew ? "crm.Lead" : null}
      chatterObjectId={!isNew ? id : null}
    >
      {lead.status === 'converted' && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 font-medium flex items-center">
          <Check className="w-5 h-5 mr-2" />
          This lead was successfully converted to a Deal.
        </div>
      )}
      {lead.status === 'lost' && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-medium flex items-center">
          <X className="w-5 h-5 mr-2" />
          This lead has been marked as Lost.
        </div>
      )}

      <form className="space-y-8">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Lead Title / Opportunity</label>
          <input 
            type="text" 
            name="title"
            value={lead.title || ''}
            onChange={handleChange}
            placeholder="e.g., Interested in Cloud Services"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 pb-2">Contact Info</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    name="first_name"
                    value={lead.first_name || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="last_name"
                  value={lead.last_name || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={lead.email || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-slate-500" />
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  value={lead.phone || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Company</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="w-4 h-4 text-slate-500" />
                </div>
                <input 
                  type="text" 
                  name="company"
                  value={lead.company || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Qualification Details */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 pb-2">Qualification</h3>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
              <select 
                name="status"
                value={lead.status || 'new'}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted to Deal</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Source</label>
              <input 
                type="text" 
                name="source"
                value={lead.source || ''}
                onChange={handleChange}
                placeholder="e.g., Website, Referral, Trade Show"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Estimated Value</label>
                <input 
                  type="number" 
                  name="value"
                  value={lead.value || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Probability (%)</label>
                <input 
                  type="number" 
                  name="probability"
                  min="0" max="100"
                  value={lead.probability || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="pt-4 border-t border-slate-800">
          <label className="block text-sm font-medium text-slate-400 mb-2">Internal Notes / Description</label>
          <textarea 
            name="description"
            value={lead.description || ''}
            onChange={handleChange}
            rows={4}
            placeholder="Add background info or notes about this lead..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
          />
        </div>
      </form>
    </RecordFormLayout>
  );
}
