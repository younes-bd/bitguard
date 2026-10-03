
import React, { Suspense } from 'react';

const componentModules = import.meta.glob('../../apps/*/config/components.js', { eager: true });
const registry = {};

Object.values(componentModules).forEach(mod => {
    if (mod.getComponents) {
        Object.assign(registry, mod.getComponents());
    }
});

export const SuspenseComponent = ({ name, fallback = null, ...props }) => {
    const Component = registry[name];
    
    if (!Component) {
        return fallback || (
            <div className="p-4 text-sm text-slate-500 bg-slate-900 rounded-lg border border-dashed border-slate-800 text-center">
                Module component <strong>{name}</strong> is not available. Please install the required app.
            </div>
        );
    }

    return (
        <Suspense fallback={fallback || <div className="animate-pulse h-20 bg-slate-800 rounded-lg"></div>}>
            <Component {...props} />
        </Suspense>
    );
};
