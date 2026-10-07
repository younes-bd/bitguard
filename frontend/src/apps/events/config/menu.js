import {
    BarChart3, Calendar, FileText, MapPin,
    Settings, Users
} from 'lucide-react';

export const eventsMenu = [
        {
            title: 'Events',
            items: [
                { label: 'Events', icon: Calendar, path: '/admin/events' },
                { label: 'Attendees', icon: Users, path: '/admin/events/attendees' },
                { label: 'Tracks', icon: MapPin, path: '/admin/events/tracks' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/events/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/events/settings' },
                { label: 'Event Templates', icon: FileText, path: '/admin/events/templates' },
            ]
        }
    ];
