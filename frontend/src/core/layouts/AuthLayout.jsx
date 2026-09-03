import React from 'react';
import { Outlet } from 'react-router-dom';
import { Shield, CheckCircle2 } from 'lucide-react';
import { useTenant } from '../context/TenantContext';

const AuthLayout = () => {
    // If tenant context is available (e.g. via subdomain resolution on login), use it
    // otherwise fallback to BitGuard defaults.
    const tenantCtx = useTenant();
    const tenant = tenantCtx?.tenant;

    // Fully dynamic based on tenant upload
    const brandName = tenant?.name || "BitGuard";
    const brandLogo = tenant?.logo || null;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
            {/* Left Panel: Branding / Marketing Graphic */}
            <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative flex-col justify-between overflow-hidden bg-slate-900 border-r border-slate-800">
                {/* Abstract Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="p-12 relative z-10 flex flex-col h-full">
                    {/* Header Logo */}
                    <div className="flex items-center gap-3">
                        {brandLogo ? (
                            <img src={brandLogo} alt={brandName} className="w-10 h-10 rounded-xl object-contain bg-white p-1" />
                        ) : (
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Shield size={20} className="text-white" />
                            </div>
                        )}
                        <span className="text-white font-black text-2xl tracking-tight">{brandName}</span>
                        {!tenant && (
                            <span className="text-blue-400 text-xs font-bold px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20 uppercase tracking-widest ml-1">
                                Enterprise
                            </span>
                        )}
                    </div>

                    {/* Value Proposition / Marketing Copy */}
                    <div className="mt-auto mb-auto max-w-xl">
                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                            Next-generation enterprise management.
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            A unified, modern platform combining ERP, CRM, and Security Operations into a single, seamless digital experience.
                        </p>
                        
                        <ul className="space-y-4">
                            {[
                                "Complete financial & operational control",
                                "Military-grade access management",
                                "Real-time analytics and reporting"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-slate-500 text-sm font-medium">
                        &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Panel: The actual form (Outlet) */}
            <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center bg-slate-950 relative">
                {/* Mobile Header (Hidden on Desktop) */}
                <div className="md:hidden flex items-center gap-3 p-6 absolute top-0 left-0 w-full z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                    {brandLogo ? (
                        <img src={brandLogo} alt={brandName} className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" />
                    ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Shield size={16} className="text-white" />
                        </div>
                    )}
                    <span className="text-white font-bold text-lg tracking-tight">{brandName}</span>
                </div>

                <div className="w-full h-full overflow-y-auto custom-scrollbar flex items-center justify-center">
                    {/* 
                        The Outlet renders Login.jsx or Register.jsx.
                        We ensure it takes full height. 
                    */}
                    <div className="w-full min-h-full flex flex-col justify-center items-center pt-20 pb-12 md:py-12">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
