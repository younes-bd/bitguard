import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState(null);
    const [memberships, setMemberships] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setTenant({
                name: "Demo Tenant",
                bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] }
            });
            setLoading(false);
            return;
        }

        import('../api/client').then(({ default: client }) => {
            client.get('iam/me/')
                .then(res => {
                    const userData = res.data?.data;
                    if (userData) {
                        const userMemberships = userData.memberships || [];
                        setMemberships(userMemberships);

                        const savedTenantId = localStorage.getItem('bitguard_tenant_id');
                        let activeTenant = null;

                        if (savedTenantId && userMemberships.length > 0) {
                            activeTenant = userMemberships.find(m => m.id === savedTenantId);
                        }
                        
                        if (!activeTenant && userData.tenant) {
                            activeTenant = userData.tenant;
                        } else if (!activeTenant && userMemberships.length > 0) {
                            activeTenant = userMemberships[0];
                        }

                        if (activeTenant) {
                            setTenant(activeTenant);
                            localStorage.setItem('bitguard_tenant_id', activeTenant.id);
                        } else {
                            setTenant({ name: "Demo Tenant", bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] } });
                        }
                    } else {
                        setTenant({ name: "Demo Tenant", bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] } });
                    }
                })
                .catch(() => {
                    setTenant({ name: "Demo Tenant", bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] } });
                })
                .finally(() => setLoading(false));
        });
    }, [isAuthenticated]);

    const switchTenant = (tenantId) => {
        const newTenant = memberships.find(m => m.id === tenantId);
        if (newTenant) {
            setTenant(newTenant);
            localStorage.setItem('bitguard_tenant_id', tenantId);
            window.location.reload(); // Reload to refresh data context
        }
    };

    const hasProduct = (productCode) => {
        if (!tenant || !tenant.bundle) return true;
        return tenant.bundle.products.includes(productCode);
    };

    const hasPermission = () => true;

    if (loading) return null;

    return (
        <TenantContext.Provider value={{ tenant, memberships, switchTenant, unix_permissions: permissions, hasProduct, hasPermission }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
