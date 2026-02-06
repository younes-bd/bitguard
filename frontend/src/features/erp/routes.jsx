import React from 'react';
import { Route } from 'react-router-dom';
import ErpDashboard from './dashboards/ErpDashboard';
import ProjectList from './pages/ProjectList';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetail from './pages/ProjectDetail';
import EmployeeDirectory from './pages/EmployeeDirectory';
import FinancialsDashboard from './pages/FinancialsDashboard';
import ExpenseList from './pages/ExpenseList';
import InvoiceList from './pages/InvoiceList';
import InvoiceCreate from './pages/InvoiceCreate';
import InvoiceDetail from './pages/InvoiceDetail';
import RiskList from './pages/RiskList';
import AssetList from './pages/AssetList';

export const erpRoutes = (
    <>
        <Route path="overview" element={<ErpDashboard />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/create" element={<ProjectCreate />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="workforce" element={<EmployeeDirectory />} />
        <Route path="financials" element={<FinancialsDashboard />} />
        <Route path="expenses" element={<ExpenseList />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/create" element={<InvoiceCreate />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        <Route path="risk" element={<RiskList />} />
        <Route path="assets" element={<AssetList />} />
    </>
);

