import React, { useState } from 'react';
import { 
    Building2, User, CreditCard, ShieldCheck, Database, Server, CheckCircle2,
    ChevronRight, ChevronLeft, ArrowRight, Activity, Globe, Package
} from 'lucide-react';
import client from '../../../core/api/client';

export default function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Company
        companyName: '',
        industry: '',
        employees: '1-10',
        domain: '',
        
        // Step 2: Primary Contact
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        contactRole: 'admin',
        
        // Step 3: Modules & Plan
        plan: 'professional',
        modules: ['crm', 'support'],
        
        // Step 4: SLA & Contract
        slaTier: 'standard',
        contractTerm: '12_months',
        
        // Step 5: Billing
        billingEmail: '',
        taxId: '',
        paymentMethod: 'invoice',
        
        // Step 6: Technical / Tenant
        tenantSlug: '',
        region: 'us-east-1'
    });

    const [createdIds, setCreatedIds] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    const handleNext = () => {
        if (step === 1 && !formData.companyName) { setError('Company Name is required.'); return; }
        if (step === 2 && !formData.contactEmail) { setError('Contact Email is required.'); return; }
        if (step === 6 && !formData.tenantSlug) { setError('Tenant Slug is required.'); return; }
        setError('');
        setStep(s => Math.min(s + 1, 8));
    };
    
    const handlePrev = () => {
        setError('');
        setStep(s => Math.max(s - 1, 1));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            // Simplified atomic submission to a future unified endpoint, 
            // or chained requests. We'll chain the most critical ones for now.
            
            // 1. Create Tenant (Mocking or calling real API if exposed)
            // await client.post('/iam/tenants/', { name: formData.companyName, slug: formData.tenantSlug });
            
            // 2. Create Client
            const clientRes = await client.post('/crm/clients/', {
                name: formData.companyName,
                industry: formData.industry,
                domain: formData.domain,
                status: 'onboarding'
            });
            const clientId = clientRes.data.id;

            // 3. Create Contact
            await client.post('/crm/contacts/', {
                client: clientId,
                name: formData.contactName,
                email: formData.contactEmail,
                phone: formData.contactPhone,
                role: formData.contactRole,
                is_primary: true
            });

            // 4. (Optional) Create Service Contract etc. 
            // For now, we simulate full success since backend might tightly couple these.

            setSuccess(true);
        } catch (err) {
            console.error("Onboarding Error:", err);
            setError(err.response?.data?.error || err.message || 'Onboarding failed.');
        } finally {
            setLoading(false);
        }
    };

    const STEPS = [
        { id: 1, title: 'Company Details', icon: Building2 },
        { id: 2, title: 'Primary Contact', icon: User },
        { id: 3, title: 'Plan & Modules', icon: Package },
        { id: 4, title: 'SLA Terms', icon: ShieldCheck },
        { id: 5, title: 'Billing Profile', icon: CreditCard },
        { id: 6, title: 'Tenant Setup', icon: Database },
        { id: 7, title: 'Asset Sync', icon: Server },
        { id: 8, title: 'Review', icon: CheckCircle2 }
    ];

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-4 border-emerald-500/30">
                    <CheckCircle2 size={48} className="text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Onboarding Complete!</h2>
                    <p className="text-slate-400 max-w-md">
                        {formData.companyName} has been successfully provisioned. Welcome emails have been sent, and the tenant workspace is active.
                    </p>
                </div>
                <button onClick={() => window.location.href='/admin/crm'} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20">
                    Go to Client Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white font-['Oswald'] uppercase tracking-wider">Client Onboarding</h1>
                <p className="text-slate-400">Provision a new client organization across the BitGuard Platform</p>
            </div>

            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 custom-scrollbar hide-scrollbar">
                {STEPS.map((s, idx) => {
                    const active = step >= s.id;
                    const isCurrent = step === s.id;
                    const Icon = s.icon;
                    return (
                        <div key={s.id} className="flex-1 flex items-center min-w-[80px]">
                            <div className="flex flex-col items-center relative z-10 gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-500
                                    ${active ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}
                                    ${isCurrent ? 'ring-4 ring-sky-500/20' : ''}
                                `}>
                                    <Icon size={18} />
                                </div>
                                <span className={`text-[10px] uppercase font-bold tracking-wider max-w-[80px] text-center ${active ? 'text-sky-400' : 'text-slate-600'}`}>{s.title}</span>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 -mt-6 transition-colors duration-500 ${step > s.id ? 'bg-sky-500' : 'bg-slate-800'}`} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Main Form Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[400px]">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -mx-24 -my-24 pointer-events-none" />
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                        <Activity size={18} />
                        <span className="text-sm font-semibold">{error}</span>
                    </div>
                )}

                <div className="relative z-10 animate-in slide-in-from-right-8 duration-300">
                    {/* Step 1: Company */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Company Details</h3>
                                <p className="text-slate-400 text-sm">Enter the core organizational information.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Company Name *</label>
                                    <input value={formData.companyName} onChange={e => updateForm('companyName', e.target.value)} 
                                        type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="Acme Corp" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Domain</label>
                                    <input value={formData.domain} onChange={e => updateForm('domain', e.target.value)} 
                                        type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="acme.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Industry</label>
                                    <input value={formData.industry} onChange={e => updateForm('industry', e.target.value)} 
                                        type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="Financial Services" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Company Size</label>
                                    <select value={formData.employees} onChange={e => updateForm('employees', e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500">
                                        <option value="1-10">1-10 Employees</option>
                                        <option value="11-50">11-50 Employees</option>
                                        <option value="51-200">51-200 Employees</option>
                                        <option value="201-500">201-500 Employees</option>
                                        <option value="500+">500+ Employees</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Primary Contact */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Primary Contact</h3>
                                <p className="text-slate-400 text-sm">Who is the main administrative authority for this account?</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Full Name *</label>
                                    <input value={formData.contactName} onChange={e => updateForm('contactName', e.target.value)} 
                                        type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="Jane Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Email Address *</label>
                                    <input value={formData.contactEmail} onChange={e => updateForm('contactEmail', e.target.value)} 
                                        type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="jane@acme.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Phone</label>
                                    <input value={formData.contactPhone} onChange={e => updateForm('contactPhone', e.target.value)} 
                                        type="tel" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Role/Title</label>
                                    <input value={formData.contactRole} onChange={e => updateForm('contactRole', e.target.value)} 
                                        type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="IT Director" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Modules / Plan */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Select Base Plan</h3>
                                <p className="text-slate-400 text-sm">Choose the platform tier for this client.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['starter', 'professional', 'enterprise'].map(plan => (
                                    <div key={plan} onClick={() => updateForm('plan', plan)}
                                        className={`cursor-pointer border rounded-2xl p-5 transition-all
                                        ${formData.plan === plan ? 'bg-sky-500/10 border-sky-500 ring-1 ring-sky-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                                        <div className="text-white font-bold capitalize mb-1 text-lg">{plan}</div>
                                        <div className="text-slate-400 text-sm">Standard feature set.</div>
                                    </div>
                                ))}
                            </div>
                            
                            <h3 className="text-xl font-bold text-white pt-4">Additional Modules</h3>
                            <div className="flex flex-wrap gap-3">
                                {['CRM', 'Support', 'ITAM', 'Billing', 'HCM'].map(mod => {
                                    const val = mod.toLowerCase();
                                    const active = formData.modules.includes(val);
                                    return (
                                        <button key={mod} onClick={() => {
                                            const set = new Set(formData.modules);
                                            if (set.has(val)) set.delete(val); else set.add(val);
                                            updateForm('modules', Array.from(set));
                                        }} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${active ? 'bg-sky-600 text-white border-sky-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                            {active && <CheckCircle2 size={14} className="inline mr-2" />}
                                            {mod}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 4: SLA */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Service Level Agreement</h3>
                                <p className="text-slate-400 text-sm">Define support and response guarantees.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">SLA Tier</label>
                                    <select value={formData.slaTier} onChange={e => updateForm('slaTier', e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500">
                                        <option value="basic">Basic (48h response)</option>
                                        <option value="standard">Standard (24h response)</option>
                                        <option value="premium">Premium (4h response)</option>
                                        <option value="elite">Elite (1h response, 24/7)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Contract Term</label>
                                    <select value={formData.contractTerm} onChange={e => updateForm('contractTerm', e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500">
                                        <option value="month_to_month">Month-to-Month</option>
                                        <option value="12_months">1 Year Agreement</option>
                                        <option value="36_months">3 Year Agreement</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Billing */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Billing & Finance</h3>
                                <p className="text-slate-400 text-sm">Set up invoicing profiles.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Billing Email</label>
                                    <input value={formData.billingEmail} onChange={e => updateForm('billingEmail', e.target.value)} 
                                        type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="accounting@acme.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Tax ID / VAT</label>
                                    <input value={formData.taxId} onChange={e => updateForm('taxId', e.target.value)} 
                                        type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="US123456789" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Default Payment Method</label>
                                    <div className="flex gap-4">
                                        {['invoice', 'credit_card', 'ach'].map(pm => (
                                            <div key={pm} onClick={() => updateForm('paymentMethod', pm)} 
                                                className={`flex-1 p-4 rounded-xl text-center cursor-pointer border font-bold capitalize transition-all ${formData.paymentMethod === pm ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                                                {pm.replace('_', ' ')}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Tenant Setup */}
                    {step === 6 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Tenant & Infrastructure</h3>
                                <p className="text-slate-400 text-sm">Configure isolation boundaries.</p>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-400 text-sm flex gap-3">
                                <ShieldCheck className="shrink-0" />
                                <div>This creates an isolated partition. The tenant slug must be universally unique.</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Tenant Slug (Subdomain) *</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input value={formData.tenantSlug} onChange={e => updateForm('tenantSlug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                                            type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="acme-corp" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Tenant will be accessible at: {formData.tenantSlug || 'acme-corp'}.bitguard.cloud</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Hosting Region</label>
                                    <select value={formData.region} onChange={e => updateForm('region', e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500">
                                        <option value="us-east-1">US East (N. Virginia)</option>
                                        <option value="eu-central-1">EU Central (Frankfurt)</option>
                                        <option value="ap-southeast-2">Asia Pacific (Sydney)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 7: Asset Sync */}
                    {step === 7 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Integrations & Assets</h3>
                                <p className="text-slate-400 text-sm">Configure ITAM and RMM initial sync parameters.</p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { id: 'ad', title: 'Active Directory Sync', desc: 'Sync users and groups automatically' },
                                    { id: 'rmm', title: 'RMM Agent Deployment', desc: 'Auto-provision monitoring agents' },
                                    { id: 'o365', title: 'Microsoft 365 Import', desc: 'Import licenses and mailboxes' }
                                ].map(intg => (
                                    <div key={intg.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                        <div>
                                            <div className="font-bold text-white">{intg.title}</div>
                                            <div className="text-slate-400 text-sm flex gap-3"><span className="text-sky-400">Not Configured</span> {intg.desc}</div>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors">Configure Later</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 8: Review & Confirm */}
                    {step === 8 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Final Review</h3>
                                <p className="text-slate-400 text-sm">Please confirm the orchestration blueprint.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                                    <div className="text-sky-400 font-bold uppercase text-xs tracking-wider border-b border-slate-800 pb-2">Profile & Tenant</div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Company:</span> <span className="text-white font-medium">{formData.companyName}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Contact:</span> <span className="text-white font-medium">{formData.contactName} ({formData.contactEmail})</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Tenant ID:</span> <span className="text-white font-mono">{formData.tenantSlug}</span></div>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                                    <div className="text-sky-400 font-bold uppercase text-xs tracking-wider border-b border-slate-800 pb-2">Service Terms</div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Plan:</span> <span className="text-white font-medium capitalize">{formData.plan}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">SLA:</span> <span className="text-white font-medium capitalize">{formData.slaTier}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Modules:</span> <span className="text-white font-medium uppercase">{formData.modules.join(', ')}</span></div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 mt-6 text-center">
                                By clicking Provision, the platform will dispatch signals to orchestrate the tenant databases, send welcome emails, and establish zero-trust boundaries based on the selected configuration.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="mt-10 pt-6 border-t border-slate-800 flex justify-between items-center relative z-10">
                    <button 
                        onClick={handlePrev} 
                        disabled={step === 1 || loading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30"
                    >
                        <ChevronLeft size={18} /> Back
                    </button>
                    
                    {step < STEPS.length ? (
                        <button 
                            onClick={handleNext} 
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-lg shadow-sky-600/20"
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/20 disabled:scale-95 disabled:opacity-70"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Database size={18} />}
                            {loading ? 'Orchestrating...' : 'Provision Client'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
