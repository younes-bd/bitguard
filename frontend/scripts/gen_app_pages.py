import os

base_dir = "c:/Users/youne/Desktop/2-InfoTech/website/website13/frontend/src/apps"

pages = [
    # Appointments
    ("appointments/pages/features", "OnlineAppointments.jsx", "Online Appointments", "manage your online booking portal"),
    ("appointments/pages/features", "AppointmentsAnalysis.jsx", "Appointments Analysis", "analyze booking metrics and performance"),
    ("appointments/pages/features", "AppointmentsSettings.jsx", "Appointments Settings", "configure appointment types and availability"),
    
    # Planning
    ("planning/pages/features", "ScheduleByEmployee.jsx", "Schedule by Employee", "view and manage employee shifts"),
    ("planning/pages/features", "ScheduleByRole.jsx", "Schedule by Role", "manage shift coverage by job role"),
    ("planning/pages/features", "ScheduleByProject.jsx", "Schedule by Project", "allocate resources to specific projects"),
    ("planning/pages/features", "PlanningAnalysis.jsx", "Planning Analysis", "analyze resource allocation and utilization"),
    ("planning/pages/features", "PlanningSettings.jsx", "Planning Settings", "configure shifts, roles, and planning rules"),
]

template = """import React from 'react';
import {{ LayoutDashboard, Plus }} from 'lucide-react';

export default function {component_name}() {{
    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <LayoutDashboard className="text-blue-500" />
                        {title}
                    </h1>
                    <p className="text-slate-400 mt-1">{description}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <Plus size={{20}} />
                    New Action
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                    <LayoutDashboard className="text-slate-400" size={{32}} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title} Workspace</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    This section is currently under construction. {description}.
                </p>
            </div>
        </div>
    );
}}
"""

for path, file_name, title, description in pages:
    full_path = os.path.join(base_dir, path, file_name)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    component_name = file_name.replace(".jsx", "")
    content = template.format(
        component_name=component_name,
        title=title,
        description=description
    )
    
    if not os.path.exists(full_path):
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Created {full_path}")
    else:
        print(f"Skipped {full_path} (already exists)")
