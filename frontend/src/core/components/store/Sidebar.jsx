import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BuildingStorefrontIcon,
  PaintBrushIcon,
  TagIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  TruckIcon,
  DocumentArrowDownIcon,
  ChartPieIcon,
  PuzzlePieceIcon,
  ArrowPathIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/store/dashboard', icon: BuildingStorefrontIcon },
  { name: 'Store Customization', href: '/admin/store/customization', icon: PaintBrushIcon },
  { name: 'Categories', href: '/admin/store/categories', icon: TagIcon },
  { name: 'Products', href: '/admin/store/products', icon: CubeIcon },
  { name: 'Orders', href: '/admin/store/orders', icon: ShoppingCartIcon },
  { name: 'Customer Management', href: '/admin/store/customers', icon: UsersIcon },
  { name: 'Shipping Settings', href: '/admin/store/shipping', icon: TruckIcon },
  { name: 'Landing Pages', href: '/admin/store/landing-pages', icon: DocumentArrowDownIcon },
  { name: 'Pixel & Tracking', href: '/admin/store/tracking', icon: ChartPieIcon },
  { name: 'Add-ons', href: '/admin/store/addons', icon: PuzzlePieceIcon },
  { name: 'Subscriptions', href: '/admin/store/subscriptions', icon: ArrowPathIcon },
  { name: 'Settings', href: '/admin/store/settings', icon: Cog6ToothIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  return (
    <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
      <div className="flex items-center flex-shrink-0 px-4">
        <h1 className="text-xl font-bold text-indigo-600">Commerce Engine</h1>
      </div>
      <div className="mt-8 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1 bg-white" aria-label="Sidebar">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                classNames(
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={classNames(
                      isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
