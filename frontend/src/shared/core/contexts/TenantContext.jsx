import React, { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
    // Mock tenant data since backend might not be ready
    const [tenant, setTenant] = useState({
        name: "Demo Tenant",
        bundle: { products: ['crm', 'erp', 'store', 'soc', 'identity'] }
    });
    const [permissions, setPermissions] = useState([]);

    const hasProduct = (productCode) => {
        if (!tenant || !tenant.bundle) return true;
        return tenant.bundle.products.includes(productCode);
    };

    const hasPermission = () => true;

    return (
        <TenantContext.Provider value={{ tenant, unix_permissions: permissions, hasProduct, hasPermission }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
