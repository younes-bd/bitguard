import React from 'react';
import { Users, GitCommit, GitPullRequest } from 'lucide-react';

export default function OrgChart() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Users className="text-blue-500" /> Organization Chart
                </h1>
                <p className="text-sm text-slate-400 mt-1">Company structure and reporting lines.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex justify-center items-center min-h-[600px] overflow-auto">
                <div className="flex flex-col items-center">
                    {/* CEO */}
                    <div className="bg-slate-800 border-2 border-blue-500 rounded-xl p-4 w-64 text-center z-10 relative shadow-xl shadow-blue-500/10">
                        <div className="w-16 h-16 mx-auto bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-bold mb-3 border border-blue-500/50">
                            JD
                        </div>
                        <h3 className="text-lg font-bold text-white">John Doe</h3>
                        <p className="text-blue-400 text-sm font-medium">Chief Executive Officer</p>
                    </div>

                    <div className="w-px h-8 bg-slate-700"></div>
                    <div className="w-[600px] h-px bg-slate-700"></div>

                    <div className="flex justify-between w-[600px]">
                        <div className="w-px h-8 bg-slate-700"></div>
                        <div className="w-px h-8 bg-slate-700"></div>
                        <div className="w-px h-8 bg-slate-700"></div>
                    </div>

                    <div className="flex justify-between w-[700px] gap-8">
                        {/* CTO */}
                        <div className="flex flex-col items-center">
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 w-52 text-center">
                                <div className="w-12 h-12 mx-auto bg-slate-700 text-slate-300 rounded-full flex items-center justify-center font-bold mb-2">
                                    AS
                                </div>
                                <h3 className="font-bold text-white">Alice Smith</h3>
                                <p className="text-slate-400 text-xs">Chief Technology Officer</p>
                            </div>
                            <div className="w-px h-8 bg-slate-700"></div>
                            <div className="flex gap-4">
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 w-40 text-center">
                                    <p className="text-sm font-bold text-slate-300">Engineering</p>
                                    <p className="text-xs text-slate-500 mt-1">12 Employees</p>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 w-40 text-center">
                                    <p className="text-sm font-bold text-slate-300">IT Ops</p>
                                    <p className="text-xs text-slate-500 mt-1">8 Employees</p>
                                </div>
                            </div>
                        </div>

                        {/* COO */}
                        <div className="flex flex-col items-center">
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 w-52 text-center">
                                <div className="w-12 h-12 mx-auto bg-slate-700 text-slate-300 rounded-full flex items-center justify-center font-bold mb-2">
                                    RJ
                                </div>
                                <h3 className="font-bold text-white">Robert Johnson</h3>
                                <p className="text-slate-400 text-xs">Chief Operating Officer</p>
                            </div>
                            <div className="w-px h-8 bg-slate-700"></div>
                            <div className="flex gap-4">
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 w-40 text-center">
                                    <p className="text-sm font-bold text-slate-300">HR</p>
                                    <p className="text-xs text-slate-500 mt-1">3 Employees</p>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 w-40 text-center">
                                    <p className="text-sm font-bold text-slate-300">Finance</p>
                                    <p className="text-xs text-slate-500 mt-1">5 Employees</p>
                                </div>
                            </div>
                        </div>

                        {/* CRO */}
                        <div className="flex flex-col items-center">
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 w-52 text-center">
                                <div className="w-12 h-12 mx-auto bg-slate-700 text-slate-300 rounded-full flex items-center justify-center font-bold mb-2">
                                    MW
                                </div>
                                <h3 className="font-bold text-white">Mary Williams</h3>
                                <p className="text-slate-400 text-xs">Chief Revenue Officer</p>
                            </div>
                            <div className="w-px h-8 bg-slate-700"></div>
                            <div className="flex gap-4">
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 w-40 text-center">
                                    <p className="text-sm font-bold text-slate-300">Sales</p>
                                    <p className="text-xs text-slate-500 mt-1">15 Employees</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
