import React from 'react';
import SettingsRenderer from '@/apps/system/components/settings/SettingsRenderer';

export default function AiEngineSettingsPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <SettingsRenderer schemaKey="ai_engine" title="AI Engine Settings" />
        </div>
    );
}
