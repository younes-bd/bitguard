import { Bot, Settings, Activity, Users, Plus, BarChart3, FileText } from 'lucide-react';

export const ai_agentManifest = {
    techName: 'ai_agent',
    displayName: 'AI Agent',
    commandCenterSection: 'Administration',
    commandCenterOrder: 98,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const ai_agentMenu = [
    {
        title: 'Overview',
        items: [
            { label: 'Agent Dashboard', icon: Bot,       path: '/admin/ai_agent' },
            { label: 'Execution Logs',  icon: Activity,  path: '/admin/ai_agent/logs' },
        ]
    },
    {
        title: 'Agents',
        items: [
            { label: 'All Agents',  icon: Users, path: '/admin/ai_agent/agents' },
            { label: 'New Agent',   icon: Plus,  path: '/admin/ai_agent/agents/new' },
        ]
    },
    {
        title: 'Intelligence',
        items: [
            { label: 'Usage & Costs', icon: BarChart3, path: '/admin/ai_agent/usage' },
        ]
    },
    {
        title: 'Configuration',
        items: [
            { label: 'AI Settings', icon: Settings, path: '/admin/settings/integrations' },
        ]
    },
];

