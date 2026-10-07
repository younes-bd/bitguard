import React from 'react';
import SettingsRenderer from '@/apps/system/components/settings/SettingsRenderer';

export default function PosSettingsPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <SettingsRenderer schemaKey="pos" title="Point of Sale Settings" />
        </div>
    );
}
