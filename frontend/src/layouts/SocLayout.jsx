import React from 'react';
import { Outlet } from 'react-router-dom';

const SocLayout = () => {
    return (
        <div className="soc-layout">
            <Outlet />
        </div>
    );
};

export default SocLayout;
