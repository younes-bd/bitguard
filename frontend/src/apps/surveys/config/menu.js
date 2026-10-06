import { FileQuestion, Settings, Users } from 'lucide-react';

export const surveysMenu = [
        {
            title: 'Surveys',
            items: [
                { label: 'Surveys', icon: FileQuestion, path: '/admin/surveys' },
                { label: 'Participations', icon: Users, path: '/admin/surveys/participations' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/surveys/settings' },
            ]
        }
    ];
