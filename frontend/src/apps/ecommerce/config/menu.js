import {
    Activity, Award, Box, CreditCard,
    Settings, ShoppingCart, Tags, Trash2,
    Truck
} from 'lucide-react';

export const ecommerceMenu = [
        {
            title: 'eCommerce',
            items: [
                { label: 'Orders', icon: ShoppingCart, path: '/admin/ecommerce/orders' },
                { label: 'Unpaid Orders', icon: CreditCard, path: '/admin/ecommerce/unpaid-orders' },
                { label: 'Abandoned Carts', icon: Trash2, path: '/admin/ecommerce/abandoned-carts' },
                { label: 'Products', icon: Box, path: '/admin/ecommerce/products' },
                { label: 'eCommerce Categories', icon: Tags, path: '/admin/ecommerce/categories' },
                { label: 'Discount & Loyalty', icon: Award, path: '/admin/ecommerce/loyalty' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'eCommerce', icon: Activity, path: '/admin/ecommerce/tracking' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/ecommerce/settings' },
                { label: 'Payment Providers', icon: CreditCard, path: '/admin/ecommerce/payment-providers' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/ecommerce/shipping' },
            ]
        }
    ];
