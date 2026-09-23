import React from 'react';
import { Route } from 'react-router-dom';
import ReportsList from '../pages/lists/ReportsListPage';
import ReportTagsList from '../pages/lists/ReportTagsListPage';
import PrintFormats from '../pages/settings/PrintFormatsPage';

export default [
    <Route key="reports" path="reports" element={<ReportsList />} />,
    <Route key="report-tags" path="report-tags" element={<ReportTagsList />} />,
    <Route key="print-formats" path="print-formats" element={<PrintFormats />} />
];
