import os

frontend_dir = r"c:\Users\youne\Desktop\2-InfoTech\website\website13\frontend\src\apps"

apps = {
    'appointments': 'AppointmentsDashboard',
    'planning': 'PlanningDashboard',
    'field-service': 'FieldServiceDashboard'
}

for app_folder, component_name in apps.items():
    dash_dir = os.path.join(frontend_dir, app_folder, "pages", "dashboards")
    os.makedirs(dash_dir, exist_ok=True)
    
    file_path = os.path.join(dash_dir, f"{component_name}.jsx")
    with open(file_path, 'w') as f:
        f.write(f"""import React from 'react';
import {{ Calendar, Clock, MapPin, Users, Settings }} from 'lucide-react';
import ModuleLayout from '../../dashboard/components/shared/ModuleLayout';

const {component_name} = () => {{
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{component_name.replace('Dashboard', '')} Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Pending</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">In Progress</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Completed</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}};

export default {component_name};
""")

print("Frontend scaffolding complete.")
