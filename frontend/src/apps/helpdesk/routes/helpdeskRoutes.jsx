import { Route } from 'react-router-dom';
import HelpdeskDashboard from '../pages/dashboards/HelpdeskDashboard';
import SlaBreachLog from '../pages/lists/SlaBreachLog';
import EscalationList from '../pages/lists/EscalationList';
import KnowledgeBase from '../pages/features/KnowledgeBase';
import TicketList from '../pages/lists/TicketList';
import TicketDetails from '../pages/details/TicketDetails';
import TicketCreate from '../pages/features/TicketCreate';
import TicketDetail from '../pages/details/TicketDetail';
import CustomerTickets from '../pages/lists/CustomerTickets';
import SlaLiveDashboard from '../pages/dashboards/SlaLiveDashboard';

// Configuration
import HelpdeskSettings from '../pages/settings/HelpdeskSettings';
import HelpdeskTeams from '../pages/settings/HelpdeskTeams';
import SlaPolicies from '../pages/settings/SlaPolicies';
import HelpdeskStages from '../pages/settings/HelpdeskStages';
import TicketTypes from '../pages/settings/TicketTypes';
import TicketTags from '../pages/settings/TicketTags';

// Reports
import TicketsAnalysis from '../pages/dashboards/TicketsAnalysis';
import SlaStatusAnalysis from '../pages/dashboards/SlaStatusAnalysis';

export const helpdeskRoutes = (
    <>
        <Route index element={<HelpdeskDashboard />} />
        <Route path="overview" element={<HelpdeskDashboard />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="my-tickets" element={<CustomerTickets />} />

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
