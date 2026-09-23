import { Bot, Settings, Activity, Users, Plus, BarChart3, FileText } from 'lucide-react';

export const agentsMenu = [
    {
        title: 'Overview',
        items: [
            { label: 'Agent Dashboard', icon: Bot,       path: '/admin/agents' },
            { label: 'Execution Logs',  icon: Activity,  path: '/admin/agents/logs' },
        ]
    },
    {
        title: 'Agents',
        items: [
            { label: 'All Agents',  icon: Users, path: '/admin/agents/agents' },
            { label: 'New Agent',   icon: Plus,  path: '/admin/agents/agents/new' },
        ]
    },
    {
        title: 'Intelligence',
        items: [
            { label: 'Usage & Costs', icon: BarChart3, path: '/admin/agents/usage' },
        ]
    },
    {
        title: 'Configuration',
        items: [
            { label: 'AI Settings', icon: Settings, path: '/admin/settings/integrations' },
        ]
    },
];
