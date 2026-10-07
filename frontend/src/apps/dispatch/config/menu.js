import {
    BarChart3, Calendar, Layers, MapPin,
    Settings, Tag, Tags
} from 'lucide-react';

export const field_serviceMenu = [
        {
            title: 'My Tasks',
            items: [
                { label: 'Map', icon: MapPin, path: '/admin/field-service/my-tasks/map' },
                { label: 'Schedule', icon: Calendar, path: '/admin/field-service/my-tasks/schedule' },
            ]
        },
        {
            title: 'All Tasks',
            items: [
                { label: 'Map', icon: MapPin, path: '/admin/field-service/all-tasks/map' },
                { label: 'Schedule', icon: Calendar, path: '/admin/field-service/all-tasks/schedule' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Tasks Analysis', icon: BarChart3, path: '/admin/field-service/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/field-service/settings' },
                { label: 'Stages', icon: Layers, path: '/admin/field-service/stages' },
                { label: 'Tags', icon: Tag, path: '/admin/field-service/tags' },
            ]
        }
    ];
