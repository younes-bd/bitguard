import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/core/Sidebar';
import TopBar from '../components/shared/core/TopBar';
import { useSidebarState } from '../hooks/useSidebarState';

const ModuleLayout = ({ title, items, accentColor, backLink = "/admin" }) => {
    const [collapsed, setCollapsed] = useSidebarState();

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden font-inter">
            <Sidebar
                title={title}
                items={items}
                backLink={backLink}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300 ease-in-out ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <TopBar
                    toggleSidebar={() => setCollapsed(!collapsed)}
                    title={title}
                />
                <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ModuleLayout;
