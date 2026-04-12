import React, { useState, useEffect } from 'react';
import { Puzzle, Check, ExternalLink, Loader2 } from 'lucide-react';
import marketingService from '../../../core/api/marketingService';

const MOCK_INTEGRATIONS = [
    { name: 'Google Analytics', description: 'Track website traffic and campaign attribution', connected: true, icon: '📊' },
    { name: 'Mailchimp', description: 'Email marketing automation and subscriber management', connected: false, icon: '📧' },
    { name: 'HubSpot', description: 'Inbound marketing and lead scoring', connected: false, icon: '🟠' },
    { name: 'Facebook Ads', description: 'Social media advertising and retargeting', connected: true, icon: '📘' },
    { name: 'Google Ads', description: 'Search and display advertising campaigns', connected: false, icon: '🔍' },
    { name: 'LinkedIn Ads', description: 'B2B advertising and sponsored content', connected: false, icon: '🔗' },
    { name: 'Zapier', description: 'Workflow automation between marketing tools', connected: true, icon: '⚡' },
    { name: 'Slack', description: 'Team notifications for campaign events', connected: true, icon: '💬' },
];

const MarketingIntegrations = () => {
    const [integrations, setIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const data = await marketingService.getIntegrations();
                setIntegrations(data.length > 0 ? data : MOCK_INTEGRATIONS);
            } catch (error) {
                console.error("API Error, using fallback:", error);
                setIntegrations(MOCK_INTEGRATIONS);
            } finally {
                setLoading(false);
            }
        };
        fetchIntegrations();
    }, []);

    const handleConnect = async (name) => {
        try {
            // Optimistic UI update
            setIntegrations(prev => prev.map(i => i.name === name ? { ...i, connected: true } : i));
            await marketingService.toggleIntegration(name);
        } catch (error) {
            console.error("Toggle Error:", error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-yellow-400" size={32} />
        </div>
    );

    return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <Puzzle className="text-yellow-400" size={28} />
                Integrations
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Connect your marketing tools and advertising platforms</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map(integration => (
                <div key={integration.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex items-start gap-4">
                    <span className="text-3xl">{integration.icon}</span>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-semibold">{integration.name}</h3>
                            {integration.connected ? (
                                <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                    <Check size={12} /> Connected
                                </span>
                            ) : (
                                <button 
                                    onClick={() => handleConnect(integration.name)}
                                    className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-xs font-bold transition-colors"
                                >
                                    <ExternalLink size={12} /> Connect
                                </button>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm">{integration.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};

export default MarketingIntegrations;
