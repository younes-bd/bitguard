import {
    Activity, AlertCircle, FileText, Layers,
    MapPin, Settings, Users
} from 'lucide-react';

export const hrMenu = [
        {
            title: 'Employees',
            items: [
                { label: 'Employees', icon: Users, path: '/admin/employees/employees' },
                { label: 'Contracts', icon: FileText, path: '/admin/employees/contracts' },
            ]
        },
        {
            title: 'Departments',
            items: [
                { label: 'Departments', icon: Layers, path: '/admin/employees/org-chart' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Reports', icon: Activity, path: '/admin/employees/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/employees/settings' },
                { label: 'Work Locations', icon: MapPin, path: '/admin/employees/work-locations' },
                { label: 'Departure Reasons', icon: AlertCircle, path: '/admin/employees/departure-reasons' },
            ]
        }
    ];
