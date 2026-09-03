import os

pages = {
    "PortalAccount": "My Details",
    "PortalQuotes": "Quotations",
    "PortalTasks": "Tasks",
    "PortalTimesheets": "Timesheets",
    "PortalPurchases": "Purchase Orders",
    "PortalLeads": "Opportunities"
}

template = """import React from 'react';
import { Card } from 'lucide-react';

const _NAME_ = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">_TITLE_</h1>
                    <p className="text-gray-500 mt-1">Manage your _TITLE_LOWER_</p>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 text-center text-gray-500">
                    <p>No _TITLE_LOWER_ found.</p>
                </div>
            </div>
        </div>
    );
};

export default _NAME_;
"""

out_dir = os.path.join(os.getcwd(), "src", "apps", "portal", "pages", "lists")

for name, title in pages.items():
    file_path = os.path.join(out_dir, f"{name}.jsx")
    content = template.replace("_NAME_", name).replace("_TITLE_LOWER_", title.lower()).replace("_TITLE_", title)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {name}.jsx")
