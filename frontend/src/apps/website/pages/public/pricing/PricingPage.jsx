import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '@/core/components/shared/PageMeta';
import { useTheme } from '@/core/context/ThemeProvider';

const PricingPage = () => {
    const { isDark } = useTheme();
    const [billingCycle, setBillingCycle] = useState('annual');

    const pricingTiers = [
        {
            name: "Essential",
            badge: null,
            description: "Core IT management and baseline security for small teams.",
            priceMonthly: 99,
            priceAnnual: 79,
            priceSuffix: "per user / month",
            features: [
                "24/7 Monitoring & Alerts",
                "Next-Gen Antivirus (NGAV)",
                "Remote Helpdesk Support (8x5)",
                "Patch Management",
                "Basic Cloud Backup (1TB)"
            ],
            ctaText: "Get Started",
            ctaLink: "/contact",
            popular: false
        },
        {
            name: "Advanced",
            badge: "Most Popular",
            description: "Comprehensive managed IT and SOC services for growing businesses.",
            priceMonthly: 149,
            priceAnnual: 119,
            priceSuffix: "per user / month",
            features: [
                "Everything in Essential, plus:",
                "24/7/365 SOC Monitoring",
                "Endpoint Detection & Response (EDR)",
                "Unlimited Remote Helpdesk (24/7)",
                "Compliance Reporting (SOC 2/HIPAA)",
                "Security Awareness Training",
                "vCIO Strategic Planning"
            ],
            ctaText: "Start Free Trial",
            ctaLink: "/contact",
            popular: true
        },
        {
            name: "Enterprise",
            badge: "Custom",
            description: "Dedicated infrastructure, advanced threat hunting, and compliance engineering.",
            priceMonthly: "Custom",
            priceAnnual: "Custom",
            priceSuffix: "contact for pricing",
            features: [
                "Everything in Advanced, plus:",
                "Dedicated Account Architect",
                "On-Premise Infrastructure Support",
                "Advanced Threat Hunting (XDR)",
                "Penetration Testing (Annual)",
                "Custom API Integrations",
                "15-Minute Critical Incident SLA"
            ],
            ctaText: "Contact Sales",
            ctaLink: "/contact",
            popular: false
        }
    ];

    return (
        <div className={`min-h-screen pt-24 pb-20 transition-colors duration-300 ${isDark ? 'bg-[#0a0f1c]' : 'bg-slate-50'}`}>
            <PageMeta 
                title="Pricing | BitGuard Managed IT & Security" 
                description="Transparent, per-user pricing for enterprise-grade managed IT and cybersecurity services. Choose the right plan for your organization's needs."
            />

            {/* Header Section */}
            <div className="container mx-auto px-4 relative z-10 text-center mb-16">
                <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">Pricing Plans</span>
                <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight">
                    Enterprise Security,<br/>Predictable Pricing.
                </h1>
                <p className="text-lg md:text-xl dark:text-slate-400 text-slate-600 max-w-2xl mx-auto mb-12">
                    No hidden fees, no complex licensing. Just simple, per-user pricing that scales with your organization.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={`text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'dark:text-white text-slate-900' : 'dark:text-slate-500 text-slate-400'}`}>Monthly</span>
                    <button 
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                        className="relative w-16 h-8 rounded-full bg-blue-600/20 dark:bg-blue-500/20 flex items-center p-1 cursor-pointer border-none"
                        aria-label="Toggle Billing Cycle"
                    >
                        <div className={`w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 shadow-md transform transition-transform duration-300 ${billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-0'}`}></div>
                    </button>
                    <span className={`text-sm font-semibold transition-colors flex items-center gap-2 ${billingCycle === 'annual' ? 'dark:text-white text-slate-900' : 'dark:text-slate-500 text-slate-400'}`}>
                        Annually 
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">Save 20%</span>
                    </span>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingTiers.map((tier, i) => (
                        <div key={i} className={`relative rounded-3xl p-8 transition-all duration-500 flex flex-col ${
                            tier.popular 
                            ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl scale-100 md:scale-105 z-10 border border-blue-500/50' 
                            : 'dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-xl'
                        }`}>
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg border border-white/20">
                                        {tier.badge}
                                    </span>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-2xl font-bold mb-3 ${tier.popular ? 'text-white' : 'dark:text-white text-slate-900'}`}>{tier.name}</h3>
                                <p className={`text-sm leading-relaxed min-h-[40px] ${tier.popular ? 'text-blue-100' : 'dark:text-slate-400 text-slate-600'}`}>{tier.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-end gap-2 mb-2">
                                    {typeof tier.priceMonthly === 'number' ? (
                                        <>
                                            <span className={`text-5xl font-black tracking-tighter ${tier.popular ? 'text-white' : 'dark:text-white text-slate-900'}`}>
                                                ${billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly}
                                            </span>
                                        </>
                                    ) : (
                                        <span className={`text-4xl font-black tracking-tighter ${tier.popular ? 'text-white' : 'dark:text-white text-slate-900'}`}>
                                            Custom
                                        </span>
                                    )}
                                </div>
                                <span className={`text-sm font-semibold ${tier.popular ? 'text-blue-200' : 'dark:text-slate-500 text-slate-400'}`}>
                                    {tier.priceSuffix}
                                </span>
                            </div>

                            <div className="flex-1">
                                <ul className="space-y-4 mb-8 m-0 p-0 list-none">
                                    {tier.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <i className={`bi bi-check-circle-fill mt-0.5 ${tier.popular ? 'text-emerald-400' : 'text-blue-500'}`}></i>
                                            <span className={`text-sm ${tier.popular ? 'text-blue-50' : 'dark:text-slate-300 text-slate-700'}`}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link 
                                to={tier.ctaLink} 
                                className={`block w-full text-center py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all no-underline ${
                                    tier.popular
                                    ? 'bg-white text-blue-600 hover:bg-slate-50 shadow-lg hover:shadow-xl'
                                    : 'dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-white text-slate-900'
                                }`}
                            >
                                {tier.ctaText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Enterprise Logos Section */}
            <div className="container mx-auto px-4 mt-24 mb-16 text-center max-w-4xl">
                <p className="text-slate-400 font-bold uppercase tracking-widest mb-8 text-xs">Our Technology Partners</p>
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-microsoft text-blue-500"></i> Microsoft Solutions Partner</div>
                    <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-cloud text-amber-500"></i> AWS Advanced Tier</div>
                    <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-shield-lock text-red-500"></i> CrowdStrike Elevate</div>
                    <div className="px-6 py-3 border dark:border-slate-700 border-slate-300 rounded-lg text-sm md:text-base font-bold dark:text-slate-300 text-slate-700 whitespace-nowrap flex items-center gap-2"><i className="bi bi-router text-emerald-500"></i> Cisco Gold Integrator</div>
                </div>
            </div>

            {/* Feature Comparison Table (Simplified) */}
            <div className="container mx-auto px-4 mt-24 max-w-5xl overflow-x-auto">
                <h3 className="text-3xl font-bold text-center dark:text-white text-slate-900 mb-12 tracking-tight">Compare Plan Features</h3>
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr>
                            <th className="py-4 px-6 border-b dark:border-slate-800 border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-xs w-1/3">Features</th>
                            <th className="py-4 px-6 border-b dark:border-slate-800 border-slate-200 text-slate-900 dark:text-white font-bold text-lg text-center">Essential</th>
                            <th className="py-4 px-6 border-b dark:border-slate-800 border-slate-200 text-blue-600 dark:text-blue-400 font-bold text-lg text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                                Advanced
                            </th>
                            <th className="py-4 px-6 border-b dark:border-slate-800 border-slate-200 text-slate-900 dark:text-white font-bold text-lg text-center">Enterprise</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm dark:text-slate-300 text-slate-700">
                        {[
                            { name: "24/7 Monitoring", tiers: [true, true, true] },
                            { name: "Remote Helpdesk", tiers: ["8x5", "24/7", "24/7 Priority"] },
                            { name: "Endpoint Protection", tiers: ["NGAV", "EDR", "XDR"] },
                            { name: "Compliance Reporting", tiers: [false, "Standard", "Custom"] },
                            { name: "Dedicated Architect", tiers: [false, false, true] },
                            { name: "SLA Response Time", tiers: ["4 Hours", "1 Hour", "15 Mins"] },
                        ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-4 px-6 border-b dark:border-slate-800 border-slate-100 font-medium">{row.name}</td>
                                {row.tiers.map((val, i) => (
                                    <td key={i} className={`py-4 px-6 border-b dark:border-slate-800 border-slate-100 text-center ${i === 1 ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                        {typeof val === 'boolean' ? (
                                            val ? <i className="bi bi-check-lg text-emerald-500 text-lg"></i> : <i className="bi bi-dash text-slate-400 text-lg"></i>
                                        ) : (
                                            <span className="font-semibold">{val}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Guarantee and FAQ Section */}
            <div className="container mx-auto px-4 mt-32 max-w-4xl">
                {/* Guarantee */}
                <div className="dark:bg-slate-800/50 bg-slate-50 border dark:border-slate-700 border-slate-200 rounded-2xl p-8 md:p-12 mb-20 text-center relative overflow-hidden">
                    <i className="bi bi-shield-check text-8xl absolute -right-4 -bottom-4 text-blue-500/10"></i>
                    <h3 className="text-3xl font-bold dark:text-white text-slate-900 mb-4 tracking-tight">Our Zero-Risk Guarantee</h3>
                    <p className="dark:text-slate-400 text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">We are so confident in our platform that we offer a 90-day money-back guarantee. If you aren't completely satisfied with our service, we'll refund your entire investment, no questions asked.</p>
                </div>

                {/* FAQ */}
                <h3 className="text-3xl font-bold text-center dark:text-white text-slate-900 mb-12 tracking-tight">Pricing FAQ</h3>
                <div className="space-y-6">
                    <div className="dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 p-6 rounded-xl shadow-sm">
                        <h4 className="font-bold text-lg dark:text-white text-slate-900 mb-2">Are there any hidden onboarding fees?</h4>
                        <p className="dark:text-slate-400 text-slate-600">No. Our pricing is completely transparent. Onboarding and migration costs are included in the Advanced and Enterprise plans.</p>
                    </div>
                    <div className="dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 p-6 rounded-xl shadow-sm">
                        <h4 className="font-bold text-lg dark:text-white text-slate-900 mb-2">Can we change our plan later?</h4>
                        <p className="dark:text-slate-400 text-slate-600">Absolutely. You can scale up or down at any time. Changes will be prorated in your next billing cycle.</p>
                    </div>
                    <div className="dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 p-6 rounded-xl shadow-sm">
                        <h4 className="font-bold text-lg dark:text-white text-slate-900 mb-2">Do you offer discounts for non-profits?</h4>
                        <p className="dark:text-slate-400 text-slate-600">Yes, we provide a 20% discount on all plans for registered 501(c)(3) organizations. Contact sales for details.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 mt-32 text-center max-w-3xl">
                <div className="dark:bg-slate-800 bg-blue-50 border dark:border-slate-700 border-blue-100 rounded-3xl p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[50px] -mr-20 -mt-20"></div>
                    <h2 className="text-3xl font-bold dark:text-white text-slate-900 mb-4 relative z-10">Need a custom enterprise solution?</h2>
                    <p className="dark:text-slate-400 text-slate-600 mb-8 relative z-10 text-lg">Our engineering team can design a bespoke architecture and security posture for your organization.</p>
                    <Link to="/contact" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/20 relative z-10 no-underline">
                        Contact Sales Team
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
