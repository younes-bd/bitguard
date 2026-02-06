import { useState, useEffect } from 'react';

export const useSidebarState = () => {
    // Initialize state from local storage or default to false (expanded)
    const [collapsed, setCollapsed] = useState(() => {
        const stored = localStorage.getItem('sidebar_collapsed');
        return stored === 'true';
    });

    // Sync state changes to local storage
    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', collapsed);
    }, [collapsed]);

    return [collapsed, setCollapsed];
};
