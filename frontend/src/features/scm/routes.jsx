import React from 'react';
import { Route } from 'react-router-dom';

export const scmRoutes = (
    <>
        <Route index element={<div className="p-8 text-white"><h2>Supply Chain Dashboard</h2></div>} />
        <Route path="vendors" element={<div className="p-8 text-white"><h2>Vendors</h2></div>} />
        <Route path="inventory" element={<div className="p-8 text-white"><h2>Inventory</h2></div>} />
        <Route path="procurement" element={<div className="p-8 text-white"><h2>Procurement</h2></div>} />
    </>
);
