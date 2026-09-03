import re

file_path = "src/apps/board/routes/EnterpriseRouter.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

imports = """
// Auto-generated Dashboard Imports
import InvoicingDashboard from '../../accounting/pages/dashboards/InvoicingDashboard';
import ExpensesDashboard from '../../hrm/pages/dashboards/ExpensesDashboard';
import MrpDashboard from '../../mrp/pages/dashboards/MrpDashboard';
import FleetDashboard from '../../fleet/pages/dashboards/FleetDashboard';
import PosDashboard from '../../pos/pages/dashboards/PosDashboard';
import RentalDashboard from '../../rental/pages/dashboards/RentalDashboard';
import FieldServiceDashboard from '../../services/pages/dashboards/FieldServiceDashboard';
import AppointmentsDashboard from '../../services/pages/dashboards/AppointmentsDashboard';
import PlmDashboard from '../../mrp_plm/pages/dashboards/PlmDashboard';
import QualityDashboard from '../../quality_control/pages/dashboards/QualityDashboard';
import SpreadsheetDashboard from '../../edms/pages/dashboards/SpreadsheetDashboard';
import SocialDashboard from '../../marketing/pages/dashboards/SocialDashboard';
import SmsDashboard from '../../marketing/pages/dashboards/SmsDashboard';
import EventsDashboard from '../../marketing/pages/dashboards/EventsDashboard';
import SurveysDashboard from '../../marketing/pages/dashboards/SurveysDashboard';
import AppraisalsDashboard from '../../hrm/pages/dashboards/AppraisalsDashboard';
import ReferralsDashboard from '../../hrm/pages/dashboards/ReferralsDashboard';
import ElearningDashboard from '../../cms/pages/dashboards/ElearningDashboard';
import LiveChatDashboard from '../../discuss/pages/dashboards/LiveChatDashboard';
import KnowledgeDashboard from '../../edms/pages/dashboards/KnowledgeDashboard';
import WhatsAppDashboard from '../../discuss/pages/dashboards/WhatsAppDashboard';

export const EnterpriseRoutes = () => {
"""

content = content.replace("export const EnterpriseRoutes = () => {", imports)

mappings = {
    "invoicing": "InvoicingDashboard",
    "expenses": "ExpensesDashboard",
    "mrp": "MrpDashboard",
    "field-service": "FieldServiceDashboard",
    "appointments": "AppointmentsDashboard",
    "rental": "RentalDashboard",
    "spreadsheet": "SpreadsheetDashboard",
    "quality_control": "QualityDashboard",
    "mrp_plm": "PlmDashboard",
    "appraisals": "AppraisalsDashboard",
    "referrals": "ReferralsDashboard",
    "social": "SocialDashboard",
    "sms": "SmsDashboard",
    "events": "EventsDashboard",
    "surveys": "SurveysDashboard",
    "elearning": "ElearningDashboard",
    "livechat": "LiveChatDashboard",
    "knowledge": "KnowledgeDashboard",
    "whatsapp": "WhatsAppDashboard",
    "pos": "PosDashboard",
    "fleet": "FleetDashboard"
}

for path, component in mappings.items():
    # Find the single line route
    pattern = rf'<Route path="{path}" element={{(<ModuleLayout[^>]+/>)}} />'
    replacement = f'<Route path="{path}" element={{\\1}}>\n                <Route index element={{<{component} />}} />\n            </Route>'
    content = re.sub(pattern, replacement, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("EnterpriseRouter.jsx updated successfully!")
