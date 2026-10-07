import React from 'react';
import SettingsRenderer from '@/apps/system/components/settings/SettingsRenderer';

export default function LiveChatSettingsPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <SettingsRenderer schemaKey="messaging" title="Messaging Settings" />
        </div>
    );
}
