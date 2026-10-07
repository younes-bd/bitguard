import React from 'react';
import SettingsRenderer from '@/apps/system/components/settings/SettingsRenderer';

export default function JourneysSettingsPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <SettingsRenderer schemaKey="journeys" title="Journeys Settings" />
        </div>
    );
}
