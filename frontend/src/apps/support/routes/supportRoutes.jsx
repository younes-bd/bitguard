import { Route } from 'react-router-dom';
import SupportDashboard from '../pages/dashboards/SupportDashboard';
import SlaBreachLog from '../pages/lists/SlaBreachLog';
import EscalationList from '../pages/lists/EscalationList';
import KnowledgeBase from '../pages/features/KnowledgeBase';
import TicketList from '../pages/lists/TicketList';
import TicketDetails from '../pages/details/TicketDetails';
import TicketCreate from '../pages/features/TicketCreate';
import SupportSettings from '../pages/settings/SupportSettings';
import CustomerTickets from '../pages/lists/CustomerTickets';
import SlaLiveDashboard from '../pages/dashboards/SlaLiveDashboard';

export const supportRoutes = (
    <>
        <Route path="overview" element={<SupportDashboard />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="tickets/:id" element={<TicketDetails />} />
        <Route path="my-tickets" element={<CustomerTickets />} />
        <Route path="tickets/create" element={<TicketCreate />} />
        <Route path="sla-breaches" element={<SlaBreachLog />} />
        <Route path="escalations" element={<EscalationList />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="sla-live" element={<SlaLiveDashboard />} />
        <Route path="settings" element={<SupportSettings />} />
    </>
);

