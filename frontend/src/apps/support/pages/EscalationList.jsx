import React, { useState, useEffect } from 'react';
import { AlertOctagon, Clock, User, ArrowUpCircle, CheckCircle, UserPlus, Loader2 } from 'lucide-react';
import supportService from '../../../core/api/supportService';
import { iamService } from '../../../core/api/iamService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';

const priorityBadge = (priority) => {
    const map = {
        critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
        high: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
        medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
        low: 'bg-slate-700 text-slate-400',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[priority] ?? 'bg-slate-700 text-slate-400'}`}>
            {priority}
        </span>
    );
};

const EscalationList = () => {
    const [escalations, setEscalations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch critical/high tickets
                const data = await supportService.getTickets({ priority: 'critical', status: 'open' });
                setEscalations(Array.isArray(data) ? data : data.results || []);
                
                // Fetch users for assignment
                const usersData = await iamService.getUsers();
                setUsers(Array.isArray(usersData) ? usersData : usersData.results || []);
            } catch (error) {
                console.error("Fetch Escalations Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchEscalationsOnly = async () => {
        try {
            const data = await supportService.getTickets({ priority: 'critical', status: 'open' });
            setEscalations(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssign = async (formData) => {
        if (!selectedTicket) return;
        setActionLoading(true);
        try {
            await supportService.assignTicket(selectedTicket.id, formData.assigned_to);
            setIsAssignModalOpen(false);
            await fetchEscalationsOnly();
        } catch (error) {
            alert("Failed to assign ticket");
        } finally {
            setActionLoading(false);
        }
    };

    const ASSIGN_FIELDS = [
        { 
            name: 'assigned_to', 
            label: 'Assign To Agent', 
            type: 'select', 
            options: users.map(u => ({ value: u.id, label: u.id })), // Using ID as label since name might be missing
            required: true 
        }
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Escalations</h1>
                <p className="text-slate-400 text-sm mt-0.5">Critical and high-priority tickets requiring immediate attention</p>
            </div>

            {/* Alert Banner */}
            {escalations.filter(e => e.priority === 'critical').length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <AlertOctagon size={20} className="text-red-400 flex-shrink-0" />
                    <span className="text-red-300 text-sm font-medium">
                        {escalations.filter(e => e.priority === 'critical').length} critical escalation(s) require immediate action
                    </span>
                </div>
            )}

            <div className="space-y-3">
                {loading ? (
                    <div className="py-16 text-center text-slate-500">Loading escalations...</div>
                ) : escalations.length === 0 ? (
                    <div className="py-16 text-center text-slate-500">
                        <CheckCircle size={36} className="mx-auto mb-2 text-emerald-500/40" />
                        No active escalations
                    </div>
                ) : escalations.map(esc => (
                    <div key={esc.id} className={`bg-slate-900 border rounded-xl p-5 hover:bg-slate-800/50 transition-colors ${esc.priority === 'critical' ? 'border-red-500/30' : 'border-slate-800'}`}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <ArrowUpCircle size={18} className={esc.priority === 'critical' ? 'text-red-400 mt-0.5' : 'text-orange-400 mt-0.5'} />
                                <div>
                                    <div className="text-white font-semibold">{esc.subject}</div>
                                    <div className="flex items-center gap-4 mt-1.5">
                                        <span className="text-slate-400 text-xs">{esc.client ?? '—'}</span>
                                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                                            <User size={10} /> {esc.assigned_to ?? 'Unassigned'}
                                        </span>
                                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                                            <Clock size={10} /> {esc.created_at?.split('T')[0] ?? '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                             <div className="flex items-center gap-2 flex-shrink-0">
                                {priorityBadge(esc.priority)}
                                <button 
                                    onClick={() => { setSelectedTicket(esc); setIsAssignModalOpen(true); }}
                                    className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-semibold transition-colors px-3 py-1.5 rounded-lg border border-blue-500/20 hover:border-blue-500/40"
                                >
                                    <UserPlus size={14} />
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <GenericModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assign Escalation"
                fields={ASSIGN_FIELDS}
                onSubmit={handleAssign}
                loading={actionLoading}
            />
        </div>
    );
};

export default EscalationList;
