import { Activity, Monitor, Settings, Wrench } from 'lucide-react';

export const maintenanceMenu = [
        {
            title: 'Maintenance',
            items: [
                { label: 'Equipments', icon: Monitor, path: '/admin/maintenance/assets' },
                { label: 'Maintenance Requests', icon: Wrench, path: '/admin/maintenance/requests' },
                { label: 'Reports', icon: Activity, path: '/admin/maintenance/depreciation' },
                { label: 'Configuration', icon: Settings, path: '/admin/maintenance/settings' },
            ]
        }
    ];
