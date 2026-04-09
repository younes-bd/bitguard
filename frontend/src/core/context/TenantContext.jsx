import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState(null);
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
            client.get('users/me/')
                .then(res => {
                    // Unwrap from standard_response: res.data.data.tenant
                    if (res.data?.data?.tenant) {
                        setTenant(res.data.data.tenant);
                    } else {
                        setTenant({
                            name: "Demo Tenant",
                            bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] }
                        });
                    }
                })
                .catch(() => {
                    setTenant({
                        name: "Demo Tenant",
                        bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] }
                    });
                })
                .finally(() => setLoading(false));
        });
    }, [isAuthenticated]);

    const hasProduct = (productCode) => {
        if (!tenant || !tenant.bundle) return true;
        return tenant.bundle.products.includes(productCode);
    };

    const hasPermission = () => true;

    if (loading) return null;

    return (
        <TenantContext.Provider value={{ tenant, unix_permissions: permissions, hasProduct, hasPermission }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
