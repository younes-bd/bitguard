const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'src', 'apps');

const dashboards = [
    ["accounting/pages/dashboards/InvoicingDashboard.jsx", "InvoicingDashboard", "Invoicing Overview", "blue"],
    ["hrm/pages/dashboards/ExpensesDashboard.jsx", "ExpensesDashboard", "Expenses & Reports", "amber"],
    ["mrp/pages/dashboards/MrpDashboard.jsx", "MrpDashboard", "Manufacturing Operations", "rose"],
    ["fleet/pages/dashboards/FleetDashboard.jsx", "FleetDashboard", "Fleet Management", "slate"],
    ["pos/pages/dashboards/PosDashboard.jsx", "PosDashboard", "Point of Sale (POS)", "emerald"],
    ["rental/pages/dashboards/RentalDashboard.jsx", "RentalDashboard", "Rental Operations", "blue"],
    ["services/pages/dashboards/FieldServiceDashboard.jsx", "FieldServiceDashboard", "Field Service Hub", "emerald"],
    ["services/pages/dashboards/AppointmentsDashboard.jsx", "AppointmentsDashboard", "Appointments", "rose"],
    ["plm/pages/dashboards/PlmDashboard.jsx", "PlmDashboard", "PLM", "blue"],
    ["quality/pages/dashboards/QualityDashboard.jsx", "QualityDashboard", "Quality Control", "emerald"],
    ["edms/pages/dashboards/SpreadsheetDashboard.jsx", "SpreadsheetDashboard", "Spreadsheets", "emerald"],
    ["marketing/pages/dashboards/SocialDashboard.jsx", "SocialDashboard", "Social Marketing", "sky"],
    ["marketing/pages/dashboards/SmsDashboard.jsx", "SmsDashboard", "SMS Marketing", "teal"],
    ["marketing/pages/dashboards/EventsDashboard.jsx", "EventsDashboard", "Events Manager", "purple"],
    ["marketing/pages/dashboards/SurveysDashboard.jsx", "SurveysDashboard", "Surveys Manager", "emerald"],
    ["hrm/pages/dashboards/AppraisalsDashboard.jsx", "AppraisalsDashboard", "Performance Appraisals", "amber"],
    ["hrm/pages/dashboards/ReferralsDashboard.jsx", "ReferralsDashboard", "Referrals Program", "sky"],
    ["cms/pages/dashboards/ElearningDashboard.jsx", "ElearningDashboard", "eLearning Courses", "indigo"],
    ["discuss/pages/dashboards/LiveChatDashboard.jsx", "LiveChatDashboard", "Live Chat", "rose"],
    ["edms/pages/dashboards/KnowledgeDashboard.jsx", "KnowledgeDashboard", "Knowledge Base", "emerald"],
    ["discuss/pages/dashboards/WhatsAppDashboard.jsx", "WhatsAppDashboard", "WhatsApp Integrations", "emerald"]
];

dashboards.forEach(([relPath, compName, title, color]) => {
    const fullPath = path.join(BASE_DIR, relPath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const template = `import React from 'react';
import { LayoutDashboard, Sparkles, TrendingUp, Activity } from 'lucide-react';

const ${compName} = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-${color}-600 to-${color}-400 dark:from-${color}-400 dark:to-${color}-300">
            ${title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Manage your operations seamlessly with Odoo-level architecture.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-${color}-500 hover:bg-${color}-600 text-white rounded-xl shadow-lg shadow-${color}-500/30 transition-all hover:scale-105 active:scale-95 font-medium">
          <Sparkles className="w-5 h-5 mr-2" />
          Quick Action
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-${color}-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-${color}-50 dark:bg-${color}-500/10 rounded-xl">
                <Activity className="w-6 h-6 text-${color}-500 dark:text-${color}-400" />
              </div>
              <span className="flex items-center text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md text-xs font-bold">
                <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Key Metric {i}</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">1,234</p>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-${color}-50/50 to-transparent dark:from-${color}-900/20"></div>
        <div className="relative text-center space-y-4 max-w-md px-6">
          <div className="w-20 h-20 bg-${color}-100 dark:bg-${color}-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <LayoutDashboard className="w-10 h-10 text-${color}-500 dark:text-${color}-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Workspace Ready</h2>
          <p className="text-slate-500 dark:text-slate-400">
            This module has been structurally wired to the Django backend. You can now build out the data tables and forms for ${title}.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ${compName};
`;

    fs.writeFileSync(fullPath, template);
    console.log("Created", fullPath);
});

console.log("All dashboards created successfully!");
