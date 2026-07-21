import React from 'react';


const PortalTimesheets = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
                    <p className="text-gray-500 mt-1">Manage your timesheets</p>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 text-center text-gray-500">
                    <p>No timesheets found.</p>
                </div>
            </div>
        </div>
    );
};

export default PortalTimesheets;
