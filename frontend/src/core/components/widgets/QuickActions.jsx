import React from 'react';
import {
    UserPlus,
    Ticket,
    Shield,
    FileText,
    ShoppingBag,
    Plus
} from 'lucide-react';

const QuickAction = ({ label, icon: Icon, color }) => (
    <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 p-4 transition-all hover:bg-slate-700">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
            <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium text-slate-300">{label}</span>
    </button>
);

const QuickActions = () => {
    const actions = [
        { label: 'Add Client', icon: UserPlus, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
        { label: 'New Ticket', icon: Ticket, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
        { label: 'Deploy Agent', icon: Shield, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
        { label: 'Issue Invoice', icon: FileText, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
        { label: 'Add Product', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
        { label: 'Custom', icon: Plus, color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {actions.map((action, idx) => (
                <QuickAction key={idx} {...action} />
            ))}
        </div>
    );
};

export default QuickActions;
