import React from 'react';


const PortalQuotes = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
                    <p className="text-gray-500 mt-1">Manage your quotations</p>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 text-center text-gray-500">
                    <p>No quotations found.</p>
                </div>
            </div>
        </div>
    );
};

export default PortalQuotes;
