import {
    Award, Book, BookOpen, DollarSign,
    FileText, Layers, MessageSquare, Settings,
    Star, Tags
} from 'lucide-react';

export const learningMenu = [
        {
            title: 'Courses',
            items: [
                { label: 'Courses', icon: Book, path: '/admin/learning/courses' },
                { label: 'Contents', icon: FileText, path: '/admin/learning/contents' },
                { label: 'Forums', icon: MessageSquare, path: '/admin/learning/forums' },
                { label: 'Certifications', icon: Award, path: '/admin/learning/certifications' },
                { label: 'Reviews', icon: Star, path: '/admin/learning/reviews' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Courses', icon: BookOpen, path: '/admin/learning/reports/courses' },
                { label: 'Contents', icon: FileText, path: '/admin/learning/reports/contents' },
                { label: 'Revenues', icon: DollarSign, path: '/admin/learning/reports/revenues' },
                { label: 'Certifications', icon: Award, path: '/admin/learning/reports/certifications' },
                { label: 'Reviews', icon: Star, path: '/admin/learning/reports/reviews' },
                { label: 'Forums', icon: MessageSquare, path: '/admin/learning/reports/forums' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/learning/settings' },
                { label: 'Course Groups', icon: Layers, path: '/admin/learning/course-groups' },
                { label: 'Content Tags', icon: Tags, path: '/admin/learning/content-tags' },
            ]
        }
    ];
