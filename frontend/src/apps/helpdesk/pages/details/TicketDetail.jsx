import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecordFormLayout from '../../../../core/components/shared/forms/RecordFormLayout';
import helpdeskService from '../../../../core/api/helpdeskService';
import { toast } from 'react-hot-toast';
import { Loader2, Shield, User, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    ticket_type: 'incident',
    priority: 'medium',
    status: 'open',
    team: '',
    assigned_to: ''
  });
  
  const [stages, setStages] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stagesRes, teamsRes] = await Promise.all([
          helpdeskService.getStages(),
          helpdeskService.getTeams()
        ]);
        setStages(stagesRes.results || stagesRes || []);
        setTeams(teamsRes.results || teamsRes || []);

        if (!isNew) {
          const res = await helpdeskService.getTicket(id);
          setTicket(res.data || res);
        }
      } catch (err) {
        toast.error('Failed to load ticket details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isNew) {
        const res = await helpdeskService.createTicket(ticket);
        toast.success('Ticket created');
        navigate(`/helpdesk/tickets/${res.id || res.data?.id}`);
      } else {
        await helpdeskService.updateTicket(id, ticket);
        toast.success('Ticket updated');
      }
    } catch (err) {
      toast.error('Failed to save ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (stageId) => {
    try {
      await helpdeskService.setTicketStage(id, stageId);
      const updatedStage = stages.find(s => s.id === stageId);
      setTicket(prev => ({ 
        ...prev, 
        stage: stageId,
        status: updatedStage?.is_closed ? 'closed' : prev.status
      }));
      toast.success('Stage updated');
    } catch (err) {
      toast.error('Failed to update stage');
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
    { label: 'Helpdesk', href: '/helpdesk/tickets' },
    { label: isNew ? 'New Ticket' : ticket.ticket_number || ticket.title || 'Ticket' }
  ];

  const currentStageId = typeof ticket.stage === 'object' ? ticket.stage?.id : ticket.stage;
  
  // Filter stages by the ticket's team if set
  const teamStages = ticket.team 
    ? stages.filter(s => s.team === ticket.team || (typeof s.team === 'object' && s.team?.id === ticket.team))
    : stages;

  const statusBarStages = teamStages.map(s => ({
    key: s.id,
    label: s.name,
    color: s.color
  }));

  const actions = [
    { label: 'Save', variant: 'primary', onClick: handleSave }
  ];

  return (
    <RecordFormLayout
      title={isNew ? 'New Ticket' : ticket.title}
      breadcrumbs={breadcrumbs}
      stages={!isNew ? statusBarStages : []}
      currentStage={currentStageId}
      onStageChange={!isNew ? handleStageChange : undefined}
      actions={actions}
      chatterModel={!isNew ? "helpdesk.ticket" : null}
      chatterObjectId={!isNew ? id : null}
    >
      {/* SLA Alert */}
      {!isNew && ticket.sla_breached && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-medium flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          SLA has been breached for this ticket!
        </div>
      )}

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
          <input 
            type="text" 
            name="title"
            value={ticket.title || ''}
            onChange={handleChange}
            placeholder="e.g., Unable to connect to VPN"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-lg text-slate-200 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
            <select 
              name="ticket_type"
              value={ticket.ticket_type || 'incident'}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            >
              <option value="incident">Incident</option>
              <option value="problem">Problem</option>
              <option value="change_request">Change Request</option>
              <option value="service_request">Service Request</option>
              <option value="question">Question</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
            <select 
              name="priority"
              value={ticket.priority || 'medium'}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Team */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Team</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="w-4 h-4 text-slate-500" />
              </div>
              <select 
                name="team"
                value={ticket.team || ''}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 p-2.5 text-slate-200 focus:border-blue-500 outline-none"
              >
                <option value="">-- Unassigned --</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Status (Fallback if stages not used) */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
            <select 
              name="status"
              value={ticket.status || 'open'}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-blue-500 outline-none"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
          <textarea 
            name="description"
            value={ticket.description || ''}
            onChange={handleChange}
            rows={6}
            placeholder="Detailed description of the issue..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-blue-500 outline-none resize-none"
          />
        </div>
      </form>
    </RecordFormLayout>
  );
}
