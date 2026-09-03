import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Zap, Database, Users, FileText, AlertCircle, Package, Loader2, Play } from 'lucide-react';
import { settingsService } from '../../api/settingsService';
import toast from 'react-hot-toast';
import { useManifest } from '../../../../core/hooks/useManifest';

const AUTOMATIONS_CONFIG = [
  { 
      key: 'invoices', 
      title: 'Track Overdue Invoices', 
      desc: 'Automatically mark unpaid invoices past their due date as Overdue.', 
      model_name: 'accounting.Invoice', 
      method_name: 'process_overdue_invoices', 
      interval_number: 1, 
      interval_type: 'days', 
      icon: FileText 
  },
  { 
      key: 'audit', 
      title: 'Prune Old Audit Logs', 
      desc: 'Automatically delete system audit trail logs older than 90 days to save database space.', 
      model_name: 'core.AuditTrail', 
      method_name: 'prune_old_logs', 
      interval_number: 1, 
      interval_type: 'weeks', 
      icon: Database 
  },
  { 
      key: 'hr_contracts', 
      title: 'Check Expiring HR Contracts', 
      desc: 'Identify employee contracts expiring within 30 days.', 
      model_name: 'hr.EmployeeContract', 
      method_name: 'check_expiring_contracts', 
      interval_number: 1, 
      interval_type: 'days', 
      icon: Users 
  },
  { 
      key: 'projects', 
      title: 'Escalate Overdue Tasks', 
      desc: 'Automatically escalate active project tasks that pass their deadline to High priority.', 
      model_name: 'projects.Task', 
      method_name: 'escalate_overdue_tasks', 
      interval_number: 1, 
      interval_type: 'days', 
      icon: AlertCircle 
  },
  { 
      key: 'inventory', 
      title: 'Check Low Stock Levels', 
      desc: 'Identify products where stock levels drop below the minimum required quantity.', 
      model_name: 'ecommerce.Product', 
      method_name: 'check_low_stock', 
      interval_number: 1, 
      interval_type: 'days', 
      icon: Package 
  },
  { 
      key: 'crm', 
      title: 'Clean Stale CRM Leads', 
      desc: 'Automatically mark uncontacted inbound leads older than 60 days as Lost.', 
      model_name: 'crm.Lead', 
      method_name: 'clean_stale_leads', 
      interval_number: 1, 
      interval_type: 'weeks', 
      icon: Zap 
  },
  { 
      key: 'sale_expired', 
      title: 'Cancel Expired Quotations', 
      desc: 'Automatically cancel draft sales quotations that have passed their validity date.', 
      model_name: 'sale.SaleOrder', 
      method_name: 'cancel_expired_quotations', 
      interval_number: 1, 
      interval_type: 'days', 
      icon: AlertCircle 
  },
  { 
      key: 'purchase_delayed', 
      title: 'Flag Delayed Deliveries', 
      desc: 'Identify purchase orders where expected delivery dates have passed.', 
      model_name: 'purchase.PurchaseOrder', 
      method_name: 'flag_delayed_deliveries', 
      interval_number: 1, 
      interval_type: 'days', 
      icon: Package 
  },
  { 
      key: 'billing_recurring', 
      title: 'Process Recurring Billing', 
      desc: 'Automatically generate draft invoices for active subscriptions hitting renewal.', 
      model_name: 'billing.Subscription', 
      method_name: 'process_recurring_billing', 
      interval_number: 1, 
      interval_type: 'days', 
      icon: FileText 
  },
  { 
      key: 'billing_suspend', 
      title: 'Suspend Unpaid Subscriptions', 
      desc: 'Automatically suspend subscriptions linked to invoices overdue by 14 days.', 
      model_name: 'billing.Subscription', 
      method_name: 'suspend_unpaid_subscriptions', 
      interval_number: 1, 
      interval_type: 'days', 
      icon: Zap 
  },
  { 
      key: 'hr_accruals', 
      title: 'Process Leave Accruals', 
      desc: 'Automatically accrue PTO/vacation days for employees at the end of the month.', 
      model_name: 'hr_holidays.LeaveAllocation', 
      method_name: 'process_leave_accruals', 
      interval_number: 1, 
      interval_type: 'months', 
      icon: Users 
  },
  { 
      key: 'helpdesk_sla', 
      title: 'Escalate SLA Breaches', 
      desc: 'Escalate support tickets that breach Service Level Agreement response times.', 
      model_name: 'helpdesk.Ticket', 
      method_name: 'escalate_sla_breaches', 
      interval_number: 1, 
      interval_type: 'hours', 
      icon: AlertCircle 
  },
  { 
      key: 'accounting_journal', 
      title: 'Post Recurring Entries', 
      desc: 'Automatically post recurring financial journal entries like monthly depreciation.', 
      model_name: 'accounting.JournalEntry', 
      method_name: 'post_recurring_entries', 
      interval_number: 1, 
      interval_type: 'months', 
      icon: Database 
  },
  { 
      key: 'accounting_reminders', 
      title: 'Send Payment Reminders', 
      desc: 'Automatically send payment reminders for invoices approaching their due date.', 
      model_name: 'accounting.Invoice', 
      method_name: 'send_payment_reminders', 
      interval_number: 1, 
      interval_type: 'days', 
      icon: FileText 
  }
];

export default function AutomationsSettings() {
    const { installedSet } = useManifest();
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(null);
    const [running, setRunning] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchActions();
    }, []);

    const fetchActions = async () => {
        try {
            const res = await settingsService.getScheduledActions();
            setActions(Array.isArray(res.data) ? res.data : (res.data?.results || res.data?.data || []));
        } catch (error) {
            console.error('Failed to fetch scheduled actions', error);
        } finally {
            setLoading(false);
        }
    };

    
    const handleRunNow = async (id, key) => {
        setRunning(key);
        try {
            await settingsService.runScheduledAction(id);
            // Refresh
            await fetchActions();
        } catch (error) {
            console.error('Failed to run action', error);
            toast.error('Failed to run action. Check console.');
        } finally {
            setRunning(null);
        }
    };

    const handleToggle = async (config) => {
        setToggling(config.key);
        try {
            // Find if we already have this action
            const existing = actions.find(a => a.model_name === config.model_name && a.method_name === config.method_name);
            
            if (existing) {
                // Toggle it
                const newStatus = !existing.is_active;
                await settingsService.toggleScheduledAction(existing.id, newStatus);
            } else {
                // Create it
                const now = new Date();
                const payload = {
                    name: config.title,
                    model_name: config.model_name,
                    method_name: config.method_name,
                    interval_number: config.interval_number,
                    interval_type: config.interval_type,
                    next_run: now.toISOString(),
                    is_active: true
                };
                await settingsService.createScheduledAction(payload);
            }
            await fetchActions();
        } catch (error) {
            console.error('Failed to toggle automation', error);
                        if (error.response?.status === 400) {
                toast.error('This automation is already registered or there is a conflict.');
            } else {
                toast.error('Error updating automation. Check console.');
            }
        } finally {
            setToggling(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    const filteredConfig = AUTOMATIONS_CONFIG.filter(config => {
        const existingAction = actions.find(a => a.model_name === config.model_name && a.method_name === config.method_name);
        const isActive = existingAction ? existingAction.is_active : false;
        if (filter === 'active') return isActive;
        if (filter === 'inactive') return !isActive;
        return true;
    });

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-3">
                    <Zap size={32} className="text-yellow-400" />
                    <div>
                        <h2 className="text-2xl font-bold">Smart Automations</h2>
                        <p className="text-blue-200 mt-1">Put your ERP on autopilot. Enable background jobs to handle repetitive tasks automatically.</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2 border-b border-slate-200 pb-4">
                <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All</button>
                <button onClick={() => setFilter('active')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Active</button>
                <button onClick={() => setFilter('inactive')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'inactive' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : ''}`}>Inactive</button>
            </div>

            {filteredConfig.length === 0 && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed p-12 text-center flex flex-col items-center justify-center">
                    <Zap size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Automations Found</h3>
                    <p className="text-slate-500 max-w-sm">There are no automations matching your current filter.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredConfig.map((config) => {
                    const moduleName = config.model_name.split('.')[0];
                    const isInstalled = moduleName === 'core' || moduleName === 'system' || (installedSet && installedSet.has(moduleName));
                    const existingAction = actions.find(a => a.model_name === config.model_name && a.method_name === config.method_name);
                    const isActive = existingAction ? existingAction.is_active : false;
                    const Icon = config.icon;

                    return (
                        <div key={config.key} className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${!isInstalled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            {!isInstalled && (
                                <div className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                    Module Missing
                                </div>
                            )}
                            {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>}
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 text-lg">{config.title}</h3>
                                        <p className="text-xs text-slate-400 font-mono">Runs every {config.interval_number} {config.interval_type}</p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => handleToggle(config)}
                                    disabled={toggling === config.key}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isActive ? 'bg-green-500' : 'bg-slate-200'} ${toggling === config.key ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            
                            <p className="text-sm text-slate-600">
                                {config.desc}
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                {isActive && existingAction?.last_run ? (
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <Database size={12} /> Last run: {new Date(existingAction.last_run).toLocaleDateString()}
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400">Not run yet</div>
                                )}
                                
                                {isActive && existingAction && (
                                    <button 
                                        onClick={() => handleRunNow(existingAction.id, config.key)}
                                        disabled={running === config.key}
                                        className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50"
                                    >
                                        {running === config.key ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                                        Run Now
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
