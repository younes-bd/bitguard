import React from 'react';
import { FileText, Users, DollarSign, Clock } from 'lucide-react';

const BusinessOverview = () => {
    return (
        <div className="flex h-full flex-col gap-4">
            {/* CRM Section */}
            <div className="flex-1 rounded-xl bg-slate-800 border border-slate-700 p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Business Pipeline</h3>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        CRM
                    </span>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-3 border border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/30 text-blue-400">
                                <Users className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-300">New Leads</span>
                        </div>
                        <span className="text-lg font-bold text-white">12</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-3 border border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-900/30 text-purple-400">
                                <Clock className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-300">Deals in Progress</span>
                        </div>
                        <span className="text-lg font-bold text-white">5</span>
                    </div>

                    <div className="mt-2 text-sm text-slate-500">
                        <p>Closing soon: <span className="font-medium text-white">TechCorp Renewal ($14k)</span></p>
                    </div>
                </div>
            </div>

            {/* ERP Section */}
            <div className="flex-1 rounded-xl bg-slate-800 border border-slate-700 p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Finance</h3>
                    <span className="rounded-full bg-emerald-900/20 px-2 py-1 text-xs font-medium text-emerald-400">
                        ERP
                    </span>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-3 border border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-900/30 text-red-400">
                                <FileText className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-300">Unpaid Invoices</span>
                        </div>
                        <span className="text-lg font-bold text-red-400">$3,250</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-3 border border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/30 text-emerald-400">
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-300">Revenue (MTD)</span>
                        </div>
                        <span className="text-lg font-bold text-white">$45.2k</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessOverview;
