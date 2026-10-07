import React from 'react';
import SettingsRenderer from '@/apps/system/components/settings/SettingsRenderer';

export default function FleetSettingsPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <SettingsRenderer schemaKey="fleet" title="Fleet Settings" />
        </div>
    );
}
