import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
// import { storeApi } from '../../api/storeApi';

export default function CouponsManager() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Mock fetch from storeApi.getCoupons()
        setTimeout(() => {
            setCoupons([
                { id: 1, code: 'SUMMER25', discount_type: 'percentage', amount: '25.00', is_active: true, usage_limit: 100, times_used: 42, valid_to: '2026-09-01T00:00:00Z' },
                { id: 2, code: 'WELCOME10', discount_type: 'percentage', amount: '10.00', is_active: true, usage_limit: null, times_used: 890, valid_to: null },
                { id: 3, code: 'FLAT50', discount_type: 'fixed', amount: '50.00', is_active: false, usage_limit: 50, times_used: 50, valid_to: '2026-01-01T00:00:00Z' }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coupons & Promotions</h1>
                    <p className="text-gray-500 mt-1">Manage discount codes and promotional campaigns.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Create Coupon
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 font-medium">Code</th>
                                <th className="p-4 font-medium">Discount</th>
                                <th className="p-4 font-medium">Usage</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">Loading coupons...</td>
                                </tr>
                            ) : filteredCoupons.map(coupon => (
                                <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                                <Tag className="w-4 h-4" />
                                            </div>
                                            <span className="font-mono font-bold text-gray-900 dark:text-white tracking-wider">{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {coupon.discount_type === 'percentage' ? `${coupon.amount}%` : `$${coupon.amount}`}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <span className="text-gray-900 dark:text-white">{coupon.times_used}</span>
                                            <span className="text-gray-500"> / {coupon.usage_limit || 'âˆž'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {coupon.is_active ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                                <CheckCircle className="w-3 h-3" /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30 px-2 py-1 rounded-full">
                                                <XCircle className="w-3 h-3" /> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
