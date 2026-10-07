import { Route } from 'react-router-dom';
import HelpdeskDashboard from '../pages/dashboards/HelpdeskDashboardPage';
import SlaBreachLog from '../pages/lists/SlaBreachLogPage';
import EscalationList from '../pages/lists/EscalationListPage';
import KnowledgeBase from '../pages/features/KnowledgeBasePage';
import TicketList from '../pages/lists/TicketListPage';
import TicketDetails from '../pages/details/TicketDetailsPage';
import TicketCreate from '../pages/features/TicketCreatePage';
import TicketDetail from '../pages/details/TicketDetailPage';
import CustomerTickets from '../pages/lists/CustomerTicketsPage';
import SlaLiveDashboard from '../pages/dashboards/SlaLiveDashboardPage';
import LiveChatDashboard from '../../messaging/pages/dashboards/LiveChatDashboardPage';
import Visitors from '../../messaging/pages/features/VisitorsPage';

// Configuration
import HelpdeskSettings from '../pages/settings/HelpdeskSettingsPage';
import HelpdeskTeams from '../pages/settings/HelpdeskTeamsPage';
import SlaPolicies from '../pages/settings/SlaPoliciesPage';
import HelpdeskStages from '../pages/settings/HelpdeskStagesPage';
import TicketTypes from '../pages/settings/TicketTypesPage';
import TicketTags from '../pages/settings/TicketTagsPage';

// Reports
import TicketsAnalysis from '../pages/dashboards/TicketsAnalysisPage';
import SlaStatusAnalysis from '../pages/dashboards/SlaStatusAnalysisPage';

export const helpdeskAdminRoutes = (
    <>
        <Route index element={<HelpdeskDashboard />} />
        <Route path="overview" element={<HelpdeskDashboard />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="my-tickets" element={<CustomerTickets />} />

        <Route path="messaging" element={<LiveChatDashboard />} />
        <Route path="messaging/visitors" element={<Visitors />} />

        {/* Reports */}
        <Route path="reports/tickets" element={<TicketsAnalysis />} />
        <Route path="reports/sla" element={<SlaStatusAnalysis />} />

        {/* Configuration */}
        <Route path="settings" element={<HelpdeskSettings />} />
        <Route path="teams" element={<HelpdeskTeams />} />
        <Route path="sla" element={<SlaPolicies />} />
        <Route path="stages" element={<HelpdeskStages />} />
        <Route path="types" element={<TicketTypes />} />
        <Route path="tags" element={<TicketTags />} />

        {/* Extra existing routes */}
        <Route path="sla-breaches" element={<SlaBreachLog />} />
        <Route path="escalations" element={<EscalationList />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="sla-live" element={<SlaLiveDashboard />} />
    </>
);
