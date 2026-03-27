import { Route } from 'react-router-dom';
import SupportDashboard from '../pages/SupportDashboard';
import SlaBreachLog from '../pages/SlaBreachLog';
import EscalationList from '../pages/EscalationList';
import KnowledgeBase from '../pages/KnowledgeBase';
import TicketList from '../pages/TicketList';
import SupportSettings from '../pages/SupportSettings';

export const supportRoutes = (
    <>
        <Route path="tickets" element={<TicketList />} />
        <Route path="sla-breaches" element={<SlaBreachLog />} />
        <Route path="escalations" element={<EscalationList />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="settings" element={<SupportSettings />} />
    </>
);

