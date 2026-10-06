import {
    BarChart3, Building2, Clock, FileText,
    Settings, Truck, Wrench
} from 'lucide-react';

export const fleetMenu = [
        {
            title: 'Fleet',
            items: [
                { label: 'Vehicles', icon: Truck, path: '/admin/fleet' },
                { label: 'Odometers', icon: Clock, path: '/admin/fleet/odometer' }
            ]
        },
        {
            title: 'Contracts',
            items: [
                { label: 'Contracts', icon: FileText, path: '/admin/fleet/contracts' }
            ]
        },
        {
            title: 'Services',
            items: [
                { label: 'Services', icon: Wrench, path: '/admin/fleet/services' }
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Costs Analysis', icon: BarChart3, path: '/admin/fleet/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/fleet/settings' },
                { label: 'Manufacturers', icon: Building2, path: '/admin/fleet/manufacturers' },
                { label: 'Vehicle Models', icon: Truck, path: '/admin/fleet/models' }
            ]
        }
    ];
