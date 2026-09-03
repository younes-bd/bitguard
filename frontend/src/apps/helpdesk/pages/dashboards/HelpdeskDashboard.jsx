import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import helpdeskService from '../../api/helpdeskService';
import { toast } from 'react-hot-toast';
import { 
  AlertTriangle, CheckCircle2, Clock, 
  LifeBuoy, Search, Filter, Plus, User, FileText,
  LayoutGrid, List as ListIcon
} from 'lucide-react';
import KanbanBoard from '@/core/components/shared/views/KanbanBoard';
import DataTable from '@/core/components/shared/views/DataTable';

export default function HelpdeskDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  
  // KPIs
  const [kpis, setKpis] = useState({
    open: 0,
    inProgress: 0,
    slaBreached: 0,
    resolvedToday: 0
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [stagesRes, ticketsRes] = await Promise.all([
        helpdeskService.getStages(),
        helpdeskService.getTickets()
      ]);
      
      const stgs = stagesRes.results || stagesRes || [];
      const tkts = ticketsRes.results || ticketsRes || [];
      
      setStages(stgs);
      setTickets(tkts);

      // Calculate KPIs
      const today = new Date().toISOString().split('T')[0];
      setKpis({
        open: tkts.filter(t => t.status === 'open').length,
        inProgress: tkts.filter(t => t.status === 'in_progress').length,
        slaBreached: tkts.filter(t => t.sla_breached).length,
        resolvedToday: tkts.filter(t => t.status === 'resolved' && (t.resolved_at || '').startsWith(today)).length
      });

    } catch (err) {
      toast.error('Failed to load helpdesk data');
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
    const previousTickets = [...tickets];
    setTickets(tickets.map(t => 
      t.id === cardId ? { ...t, stage: toStageId } : t
    ));

    try {
      await helpdeskService.setTicketStage(cardId, toStageId);
      toast.success('Ticket moved successfully');
    } catch (err) {
      toast.error('Failed to move ticket');
      setTickets(previousTickets);
    }
  };

  const kanbanColumns = useMemo(() => {
    if (!stages.length) return [];
    return stages.map(stage => ({
      id: stage.id,
      label: stage.name,
      color: stage.color || '#3b82f6',
      cards: tickets.filter(t => t.stage === stage.id || t.stage?.id === stage.id)
    }));
  }, [stages, tickets]);

  const renderTicketCard = (ticket) => {
    let priorityColor = 'text-slate-400';
    if (ticket.priority === 'critical') priorityColor = 'text-red-500 font-bold';
    if (ticket.priority === 'high') priorityColor = 'text-orange-400 font-bold';
    
    return (
      <div 
        onClick={() => navigate(`/helpdesk/tickets/${ticket.id}`)}
        className={`bg-slate-900 border ${ticket.sla_breached ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-slate-700/50 hover:border-blue-500/50'} rounded-lg p-3 cursor-pointer transition-all group`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-slate-200 text-sm group-hover:text-blue-400 transition-colors line-clamp-2">
            {ticket.title}
          </h4>
        </div>
        
        <div className="text-xs text-slate-400 mb-3 flex items-center space-x-2">
          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] uppercase">{ticket.ticket_number || `TKT-${ticket.id}`}</span>
          <span className={priorityColor}>{ticket.priority?.toUpperCase()}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
          <div className="flex items-center space-x-2">
            {ticket.sla_breached ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <Clock className="w-4 h-4 text-emerald-500" />
            )}
            <span className="text-xs text-slate-500">{ticket.status}</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300" title="Assignee">
            <User className="w-3 h-3" />
          </div>
        </div>
      </div>
    );
  };

  const listColumns = [
    { key: 'ticket_number', label: 'ID' },
    { key: 'title', label: 'Title', sortable: true },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (val) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          val === 'critical' ? 'bg-red-500/10 text-red-400' :
          val === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-800 text-slate-300'
        }`}>{val?.toUpperCase()}</span>
      )
    },
    { key: 'status', label: 'Status' },
    { 
      key: 'sla_breached', 
      label: 'SLA Status',
      render: (val) => val ? <span className="text-red-400 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Breached</span> : <span className="text-emerald-400"><CheckCircle2 className="w-3 h-3 mr-1 inline"/> OK</span>
    },
    { key: 'created_at', label: 'Created', render: (val) => new Date(val).toLocaleDateString() }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-950">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <LifeBuoy className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Helpdesk Tickets</h1>
              <p className="text-sm text-slate-400 mt-1">Manage customer support requests and SLAs</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => navigate('/helpdesk/tickets/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400 font-medium mb-1">Open Tickets</div>
            <div className="text-2xl font-bold text-white">{kpis.open}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400 font-medium mb-1">In Progress</div>
            <div className="text-2xl font-bold text-blue-400">{kpis.inProgress}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="text-sm text-red-400 font-medium mb-1 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5" /> SLA Breached
            </div>
            <div className="text-2xl font-bold text-red-500">{kpis.slaBreached}</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-sm text-emerald-400 font-medium mb-1 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Resolved Today
            </div>
            <div className="text-2xl font-bold text-emerald-500">{kpis.resolvedToday}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'kanban' ? (
          <KanbanBoard 
            columns={kanbanColumns}
            cardRenderer={renderTicketCard}
            onCardMove={handleCardMove}
            isLoading={loading}
          />
        ) : (
          <div className="p-6 h-full">
            <DataTable 
              columns={listColumns}
              data={tickets}
              isLoading={loading}
              onRowClick={(row) => navigate(`/helpdesk/tickets/${row.id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
