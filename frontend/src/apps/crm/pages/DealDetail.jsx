import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecordFormLayout from '../../../core/components/shared/forms/RecordFormLayout';
import crmService from '../api/crmService';
import { toast } from 'react-hot-toast';
import { Loader2, DollarSign, Calendar, Check, X } from 'lucide-react';

export default function DealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [deal, setDeal] = useState({
    title: '',
    amount: '',
    probability: '',
    expected_close_date: '',
    client: null,
    priority: 'medium',
    status: 'draft'
  });
  
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showLostReasonModal, setShowLostReasonModal] = useState(false);
  const [lostReasons, setLostReasons] = useState([]);
  const [selectedLostReason, setSelectedLostReason] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stagesRes, lostRes] = await Promise.all([
          crmService.getStages(),
          crmService.getLostReasons()
        ]);
        setStages(stagesRes.data?.results || stagesRes.data || []);
        setLostReasons(lostRes.data?.results || lostRes.data || []);

        if (!isNew) {
          const dealRes = await crmService.getDeal(id);
          setDeal(dealRes.data);
        }
      } catch (err) {
        toast.error('Failed to load deal details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeal(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isNew) {
        const res = await crmService.createDeal(deal);
        toast.success('Deal created successfully');
        navigate(`/crm/deals/${res.data.id}`);
      } else {
        await crmService.updateDeal(id, deal);
        toast.success('Deal updated successfully');
      }
    } catch (err) {
      toast.error('Failed to save deal');
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (stageId) => {
    try {
      await crmService.setDealStage(id, stageId);
      const updatedStage = stages.find(s => s.id === stageId);
      setDeal(prev => ({ 
        ...prev, 
        stage: stageId,
        status: updatedStage?.is_won ? 'won' : (updatedStage?.is_lost ? 'lost' : prev.status)
      }));
      toast.success('Stage updated');
    } catch (err) {
      toast.error('Failed to update stage');
    }
  };

  const handleMarkWon = async () => {
    try {
      await crmService.markDealWon(id);
      const res = await crmService.getDeal(id); // reload to get new stage
      setDeal(res.data);
      toast.success('Deal won!');
    } catch (err) {
      toast.error('Failed to mark won');
    }
  };

  const handleMarkLost = async () => {
    if (!selectedLostReason) {
      toast.error('Please select a reason');
      return;
    }
    try {
      await crmService.markDealLost(id, selectedLostReason);
      const res = await crmService.getDeal(id);
      setDeal(res.data);
      setShowLostReasonModal(false);
      toast.success('Deal marked as lost');
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
    { label: 'Pipeline', href: '/crm/pipeline' },
    { label: isNew ? 'New Deal' : deal.title || 'Unnamed Deal' }
  ];

  const currentStageId = typeof deal.stage === 'object' ? deal.stage?.id : deal.stage;
  
  // Format stages for StatusBar
  const statusBarStages = stages.map(s => ({
    key: s.id,
    label: s.name,
    color: s.color
  }));

  const actions = [];
  if (!isNew) {
    if (deal.status !== 'won' && deal.status !== 'lost') {
      actions.push({ label: 'Mark Won', icon: <Check className="w-4 h-4" />, variant: 'success', onClick: handleMarkWon });
      actions.push({ label: 'Mark Lost', icon: <X className="w-4 h-4" />, variant: 'danger', onClick: () => setShowLostReasonModal(true) });
    }
  }
  actions.push({ label: 'Save', variant: 'primary', onClick: handleSave });

  return (
    <>
      <RecordFormLayout
        title={isNew ? 'New Deal' : deal.title}
        breadcrumbs={breadcrumbs}
        stages={!isNew ? statusBarStages : []}
        currentStage={currentStageId}
        onStageChange={!isNew ? handleStageChange : undefined}
        actions={actions}
        chatterModel={!isNew ? "crm.Deal" : null}
        chatterObjectId={!isNew ? id : null}
      >
        {deal.status === 'won' && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 font-medium flex items-center">
            <Check className="w-5 h-5 mr-2" />
            This deal is Closed Won!
          </div>
        )}
        {deal.status === 'lost' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-medium flex items-center">
            <X className="w-5 h-5 mr-2" />
            This deal is Closed Lost.
          </div>
        )}

        <form className="space-y-6">
          {/* Title Row */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Deal Title</label>
            <input 
              type="text" 
              name="title"
              value={deal.title || ''}
              onChange={handleChange}
              placeholder="e.g., Software License Upgrade"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-lg text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Expected Revenue</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-slate-500" />
                </div>
                <input 
                  type="number" 
                  name="amount"
                  value={deal.amount || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 p-2.5 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Probability */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Probability (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="probability"
                  min="0" max="100"
                  value={deal.probability || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">%</span>
                </div>
              </div>
            </div>

            {/* Expected Close Date */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Expected Close Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="w-4 h-4 text-slate-500" />
                </div>
                <input 
                  type="date" 
                  name="expected_close_date"
                  value={deal.expected_close_date ? deal.expected_close_date.split('T')[0] : ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 p-2.5 text-slate-200 focus:border-blue-500 outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
              <select 
                name="priority"
                value={deal.priority || 'medium'}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </form>
      </RecordFormLayout>

      {/* Lost Reason Modal */}
      {showLostReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Mark Deal as Lost</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Select Reason</label>
              <select 
                value={selectedLostReason}
                onChange={(e) => setSelectedLostReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-blue-500 outline-none"
              >
                <option value="">-- Choose a reason --</option>
                {lostReasons.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowLostReasonModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleMarkLost}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Confirm Lost
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
