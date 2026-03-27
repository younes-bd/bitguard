import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, CreditCard } from 'lucide-react';

const SalesDashboard = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-white">Sales Overview</h1>
            <p className="text-slate-400">Monitor your sales performance and revenue.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stats Cards */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-white mt-2">$45,231.89</h3>
                        </div>
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <DollarSign size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Active Subscriptions</p>
                            <h3 className="text-2xl font-bold text-white mt-2">+2350</h3>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Sales</p>
                            <h3 className="text-2xl font-bold text-white mt-2">+12,234</h3>
                        </div>
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <ShoppingCart size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Active Now</p>
                            <h3 className="text-2xl font-bold text-white mt-2">+573</h3>
                        </div>
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <CreditCard size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <p className="text-slate-500">Sales Chart Visualization - Coming Soon</p>
            </div>
        </div>
    );
};

export default SalesDashboard;
