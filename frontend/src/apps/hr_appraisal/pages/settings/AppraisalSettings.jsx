import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const AppraisalSettings = () => {
    return (
        <div className="p-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <LayoutDashboard className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Appraisal Settings</h2>
                <p className="text-slate-500 max-w-md">
                    This module is currently under active development. Core functionality will be available in the next release.
                </p>
            </div>
        </div>
    );
};

export default AppraisalSettings;
