import {
    BarChart3, Box, Calendar, Clock,
    Layers, Settings, ShoppingBag, Users
} from 'lucide-react';

export const rentalMenu = [
        {
            title: 'Rental',
            items: [
                { label: 'Orders', icon: ShoppingBag, path: '/admin/rental' },
                { label: 'Schedule', icon: Calendar, path: '/admin/rental/schedule' },
                { label: 'Customers', icon: Users, path: '/admin/rental/customers' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/rental/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/rental/product-variants' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Rental', icon: BarChart3, path: '/admin/rental/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/rental/settings' },
                { label: 'Rental Delays', icon: Clock, path: '/admin/rental/delays' },
            ]
        }
    ];
