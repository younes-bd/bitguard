import React, { createContext, useContext, useState } from 'react';

const DeveloperModeContext = createContext(null);

export const DeveloperModeProvider = ({ children }) => {
    const [isDeveloperMode, setIsDeveloperMode] = useState(() => {
        const stored = localStorage.getItem('bitguard_dev_mode');
        return stored === 'true';
    });

    const toggleDeveloperMode = () => {
        setIsDeveloperMode(prev => {
            const nextMode = !prev;
            localStorage.setItem('bitguard_dev_mode', String(nextMode));
            
            // Optionally, we could reload the page here if we want to ensure
            // the entire application re-mounts cleanly, but React state is fine.
            return nextMode;
        });
    };

    return (
        <DeveloperModeContext.Provider value={{ isDeveloperMode, toggleDeveloperMode }}>
            {children}
        </DeveloperModeContext.Provider>
    );
};

export const useDeveloperMode = () => {
    const context = useContext(DeveloperModeContext);
    if (!context) {
        throw new Error('useDeveloperMode must be used within a DeveloperModeProvider');
    }
    return context;
};
