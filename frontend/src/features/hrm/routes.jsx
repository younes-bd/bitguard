import React from 'react';
import { Route } from 'react-router-dom';

export const hrmRoutes = (
    <>
        <Route index element={<div className="p-8 text-white"><h2>HR Dashboard</h2></div>} />
        <Route path="employees" element={<div className="p-8 text-white"><h2>Employees</h2></div>} />
        <Route path="payroll" element={<div className="p-8 text-white"><h2>Payroll</h2></div>} />
        <Route path="recruitment" element={<div className="p-8 text-white"><h2>Recruitment</h2></div>} />
    </>
);
