import React from 'react';
import { Smartphone } from 'lucide-react';

export const barcodeManifest = {
    techName: 'barcode',
    displayName: 'Barcode',
    commandCenterSection: 'Inventory & MRP',
    commandCenterOrder: 99,
    hasSettings: false,
    icon: 'Smartphone',
};

export const barcodeMenu = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
        path: '',
        icon: Smartphone,
            }
        ]
    }
];
