import React, { useState, useEffect } from 'react';
import { scheduledActionService } from '@/apps/base/api/scheduledActionService';
import { baseService } from '@/apps/base/api/baseService';
import { Loader2, Play, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../../core/api/client';


// Inline simple UI components to match existing settings pages perfectly
const Label = ({ children, className }) => <label className={`font-medium ${className}`}>{children}</label>;

const Switch = ({ checked, onCheckedChange, disabled }) => (
    <button 
        type="button"
        onClick={() => !disabled && onCheckedChange(!checked)}
        disabled={disabled}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-emerald-600' : 'bg-slate-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
);

const SettingRow = ({ title, description, children, footer }) => (
    <div className="flex flex-col py-2 border-b border-slate-800/50 last:border-0">
        <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-8">
                <Label className="text-base text-white flex items-center gap-2">
                    <Zap size={14} className="text-yellow-500" />
                    {title}
                </Label>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
            <div className="flex items-center gap-4">
                {children}
            </div>
        </div>
        {footer && <div className="mt-2 pl-6">{footer}</div>}
    </div>
);

export default function SmartAutomationToggle({ configKey }) {
    const [config, setConfig] = useState(null);
    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [running, setRunning] = useState(false);
    const [errorState, setErrorState] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch the registry
                const regRes = await baseService.getScheduledRegistry();
                const rawData = regRes.data;
                const configs = Array.isArray(rawData) ? rawData : (rawData?.results || rawData?.data || []);
                const matchedConfig = configs.find(c => c.key === configKey);
                
                if (matchedConfig) {
                    setConfig(matchedConfig);
                    // Fetch scheduled actions
                    const actionsRes = await scheduledActionService.getScheduledActions();
                    const allActions = Array.isArray(actionsRes.data) ? actionsRes.data : (actionsRes.data?.results || actionsRes.data?.data || []);
                    
                    const matchedAction = allActions.find(a => a.blueprint_key === matchedConfig.key);
                    setAction(matchedAction || null);
                } else {
                    setErrorState(`Key not found in registry: ${configKey}`);
                }
            } catch (err) {
                console.error("Failed to load smart automation config", err);
                setErrorState(err.response?.status === 404 ? 'Backend API 404: Did you restart Django?' : `API Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [configKey]);

    const handleToggle = async (checked) => {
        if (!config) return;
        setToggling(true);
        try {
            if (action) {
                // We have an existing action, just toggle it
                await scheduledActionService.toggleScheduledAction(action.id, checked);
                setAction(prev => ({ ...prev, is_active: checked }));
            } else if (checked) {
                // Action doesn't exist, create it
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
                const res = await scheduledActionService.createScheduledAction(payload);
                setAction(res.data);
            }
            toast.success(`Automation ${checked ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error('Failed to toggle automation', error);
            if (error.response?.status === 400) {
                toast.error('This automation is already registered or there is a conflict.');
            } else {
                toast.error('Error updating automation. Check console.');
            }
        } finally {
            setToggling(false);
        }
    };

    const handleRunNow = async () => {
        if (!action) return;
        setRunning(true);
        try {
            await scheduledActionService.runScheduledAction(action.id);
            toast.success('Automation triggered successfully');
            
            // Refresh the action to update last_run
            const actionsRes = await scheduledActionService.getScheduledActions();
            const allActions = Array.isArray(actionsRes.data) ? actionsRes.data : (actionsRes.data?.results || actionsRes.data?.data || []);
            const matchedAction = allActions.find(a => a.id === action.id);
            if (matchedAction) setAction(matchedAction);

        } catch (error) {
            console.error('Failed to run action', error);
            toast.error('Failed to run action. Check console.');
        } finally {
            setRunning(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                <div className="space-y-0.5">
                    <div className="h-5 w-48 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-4 w-64 bg-slate-800 rounded animate-pulse mt-2"></div>
                </div>
                <Loader2 size={20} className="animate-spin text-slate-500" />
            </div>
        );
    }

    if (errorState) {
        return (
            <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-400 rounded-lg text-sm my-4 font-mono">
                [SmartAutomationToggle]: {errorState}
            </div>
        );
    }

    if (!config) {
        // Fallback
        return null; 
    }

    const isActive = action ? action.is_active : false;

    const footer = isActive && action ? (
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
            <span className="font-mono">
                Runs every {config.interval_number} {config.interval_type}
            </span>
            <span>•</span>
            <span>
                Last run: {action.last_run ? new Date(action.last_run).toLocaleString() : 'Never'}
            </span>
            <button 
                onClick={handleRunNow}
                disabled={running}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors ml-2 disabled:opacity-50"
            >
                {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                Run Now
            </button>
        </div>
    ) : null;

    return (
        <SettingRow 
            title={config.title} 
            description={config.desc}
            footer={footer}
        >
            <Switch
                checked={isActive}
                onCheckedChange={handleToggle}
                disabled={toggling}
            />
        </SettingRow>
    );
}


