import {
    LayoutDashboard, ShoppingBag, FolderKanban, FileText, LifeBuoy,
    Receipt, CheckSquare, CreditCard, ShoppingCart, Clock, Target, User, Server
} from 'lucide-react';

export const portalSections = [
    {
        title: 'My Documents',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/portal' },
            { label: 'My Orders', icon: ShoppingBag, path: '/portal/orders' },
            { label: 'My Quotes', icon: FileText, path: '/portal/quotes' },
            { label: 'My Invoices', icon: Receipt, path: '/portal/invoices' },
            { label: 'My Projects', icon: FolderKanban, path: '/portal/projects' },
            { label: 'My Tasks', icon: CheckSquare, path: '/portal/tasks' },
            { label: 'My Tickets', icon: LifeBuoy, path: '/portal/tickets' },
            { label: 'My Subscriptions', icon: CreditCard, path: '/portal/subscriptions' },
            { label: 'My Purchases', icon: ShoppingCart, path: '/portal/purchase' },
            { label: 'My Timesheets', icon: Clock, path: '/portal/timesheets' },
            { label: 'My Leads', icon: Target, path: '/portal/leads' },
            { label: 'My Assets', icon: Server, path: '/portal/assets' }
        ]
    },
    {
        title: 'Account',
        items: [
            { label: 'My Details', icon: User, path: '/portal/account' },
        ]
    }
];
