import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { companyService } from '@/apps/core/api/companyService';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [activeCompany, setActiveCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchCompany = async () => {
            try {
                const res = await companyService.getMyCompany();
                setActiveCompany(res.data);
            } catch (error) {
                console.error("Failed to load active company context", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [isAuthenticated, user?.tenant_id]); // Refetch if tenant changes

    const resolvedConfig = useMemo(() => {
        return {
            // Localization Cascade (User -> Company -> System Default)
            language: user?.language || activeCompany?.language || 'en-us',
            timezone: user?.timezone || activeCompany?.timezone || 'UTC',
            dateFormat: user?.date_format || 'YYYY-MM-DD',
            
            // UI Theme Cascade (User -> System Default)
            theme: user?.theme_mode || 'system',
            
            // Business Rules Cascade (Company -> System Default)
            currency: activeCompany?.default_currency || null,
        };
    }, [user, activeCompany]);

    return (
        <ConfigContext.Provider value={{ config: resolvedConfig, activeCompany, loading }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);
