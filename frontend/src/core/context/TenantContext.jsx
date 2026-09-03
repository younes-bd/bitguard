import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../hooks/useAuth';
import AuthLoader from '../guards/AuthLoader';
import { baseURL } from '../api/client';

const apiOrigin = new URL(baseURL, window.location.origin).origin;

const normalizeLogo = (logoPath) => {
    if (!logoPath) return null;
    if (logoPath.startsWith('http')) return logoPath;
    if (logoPath.startsWith('/')) return `${apiOrigin}${logoPath}`;
    return `${apiOrigin}/${logoPath}`;
};

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState(null);
    const [memberships, setMemberships] = useState([]);
    const { isAuthenticated, user, hasPermission, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            const fetchPublicTenant = async () => {
                try {
                    const res = await client.get(`tenants/public-info/?domain=${window.location.hostname}`);
                    setTenant({
                        name: res.data.name || "Demo Tenant",
                        logo: res.data.logo ? normalizeLogo(res.data.logo) : null,
                        bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] }
                    });
                } catch (e) {
                    setTenant({
                        name: "Demo Tenant",
                        bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] }
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchPublicTenant();
            return;
        }

        if (authLoading || !user) return;

        const setupTenant = async () => {
            const userMemberships = user.memberships || [];
            setMemberships(userMemberships);

            const savedTenantId = localStorage.getItem('erp_tenant_id');
            let activeTenant = null;

            if (savedTenantId && userMemberships.length > 0) {
                activeTenant = userMemberships.find(m => m.id === savedTenantId);
            }
            
            if (!activeTenant && user.tenant) {
                activeTenant = user.tenant;
            } else if (!activeTenant && userMemberships.length > 0) {
                activeTenant = userMemberships[0];
            }

            // Fallback API call if tenant is still missing
            if (!activeTenant) {
                try {
                    const res = await client.get('tenants/current/');
                    if (res.data?.data) {
                        activeTenant = res.data.data;
                    }
                } catch (e) {
                    console.error("Failed to load current tenant from API", e);
                }
            }

            if (activeTenant) {
                if (activeTenant.logo) {
                    activeTenant.logo = normalizeLogo(activeTenant.logo);
                }
                setTenant(activeTenant);
                localStorage.setItem('erp_tenant_id', activeTenant.id);
            } else {
                setTenant({ name: "Demo Tenant", bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] } });
            }

            setLoading(false);
        };

        setupTenant();
    }, [isAuthenticated, user, authLoading]);

    const switchTenant = (tenantId) => {
        const newTenant = memberships.find(m => m.id === tenantId);
        if (newTenant) {
            if (newTenant.logo) {
                newTenant.logo = normalizeLogo(newTenant.logo);
            }
            setTenant(newTenant);
            localStorage.setItem('erp_tenant_id', tenantId);
            // Reset to dashboard when switching tenants
            navigate('/admin'); 
        }
    };

    const hasProduct = (productCode) => {
        if (import.meta.env.DEV) {
            return true; // Bypass in local dev
        }
        if (!tenant || !tenant.bundle) return false;
        return tenant.bundle.products.includes(productCode);
    };

    if (loading || authLoading) return <AuthLoader />;

    return (
        <TenantContext.Provider value={{ tenant, memberships, switchTenant, hasProduct, hasPermission }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
