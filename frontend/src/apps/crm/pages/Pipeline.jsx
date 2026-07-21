import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '../../../core/components/shared/views/KanbanBoard';
import crmService from '../api/crmService';
import { toast } from 'react-hot-toast';
import { Calendar, DollarSign, User, Building } from 'lucide-react';

export default function Pipeline() {
  const navigate = useNavigate();
  const [stages, setStages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stagesRes, dealsRes] = await Promise.all([
        crmService.getStages(),
        crmService.getDeals()
      ]);
      setStages(stagesRes.data?.results || stagesRes.data || []);
      setDeals(dealsRes.data?.results || dealsRes.data || []);
    } catch (err) {
      toast.error('Failed to load pipeline data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCardMove = async (cardId, fromStageId, toStageId) => {
    if (fromStageId === toStageId) return;

    // Optimistic update
    const previousDeals = [...deals];
    setDeals(deals.map(deal => 
      deal.id === cardId ? { ...deal, stage: toStageId } : deal
    ));

    try {
      await crmService.setDealStage(cardId, toStageId);
      toast.success('Deal moved');
    } catch (err) {
      toast.error('Failed to move deal');
      setDeals(previousDeals); // Revert on failure
    }
  };

  // Group deals by stage
  const columns = useMemo(() => {
    if (!stages.length) return [];
    
    return stages.map(stage => ({
      id: stage.id,
      label: stage.name,
      color: stage.color || '#3b82f6',
      cards: deals.filter(deal => deal.stage === stage.id || (typeof deal.stage === 'object' && deal.stage?.id === stage.id))
    }));
  }, [stages, deals]);

  const renderDealCard = (deal) => {
    // Determine priority color
    let priorityColor = 'text-slate-400';
    if (deal.priority === 'high') priorityColor = 'text-red-400';
    if (deal.priority === 'medium') priorityColor = 'text-amber-400';

    return (
      <div 
        onClick={() => navigate(`/crm/deals/${deal.id}`)}
        className="bg-slate-900 border border-slate-700/50 hover:border-blue-500/50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-slate-200 text-sm group-hover:text-blue-400 transition-colors line-clamp-2">
            {deal.title}
          </h4>
        </div>
        
        <div className="text-sm font-semibold text-emerald-400 mb-2 flex items-center">
          <DollarSign className="w-3.5 h-3.5 mr-0.5" />
          {Number(deal.amount || 0).toLocaleString()}
        </div>

        <div className="space-y-1.5 mb-3">
          {deal.client && (
            <div className="flex items-center text-xs text-slate-400">
              <Building className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span className="truncate">{typeof deal.client === 'object' ? deal.client.name : 'Client Attached'}</span>
            </div>
          )}
          {deal.expected_close_date && (
            <div className="flex items-center text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              {new Date(deal.expected_close_date).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-800/50 mt-2">
          <div className="flex items-center space-x-1">
            {/* Priority Indicator */}
            <div className={`text-[10px] uppercase font-bold tracking-wider ${priorityColor}`}>
              {deal.priority || 'Low'}
            </div>
          </div>
          {/* Avatar Placeholder */}
          <div 
            className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-medium"
            title="Assigned To"
          >
            <User className="w-3 h-3" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-950">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Pipeline</h1>
          <p className="text-sm text-slate-400 mt-1">Drag and drop deals across stages</p>
        </div>
        <button 
          onClick={() => navigate('/crm/deals/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-900/20"
        >
          New Deal
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <KanbanBoard 
          columns={columns}
          cardRenderer={renderDealCard}
          onCardMove={handleCardMove}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
