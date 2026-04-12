import { Route } from 'react-router-dom';
import SupportDashboard from '../pages/SupportDashboard';
import SlaBreachLog from '../pages/SlaBreachLog';
import EscalationList from '../pages/EscalationList';
import KnowledgeBase from '../pages/KnowledgeBase';
import TicketList from '../pages/TicketList';
import TicketCreate from '../pages/TicketCreate';
import SupportSettings from '../pages/SupportSettings';

export const supportRoutes = (
    <>
        <Route path="overview" element={<SupportDashboard />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="tickets/create" element={<TicketCreate />} />
        <Route path="sla-breaches" element={<SlaBreachLog />} />
        <Route path="escalations" element={<EscalationList />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="settings" element={<SupportSettings />} />
    </>
);

