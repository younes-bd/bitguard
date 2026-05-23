import React, { useState, useEffect } from 'react';
import { 
    Tag, Search, Filter, ShieldCheck, Cpu, Monitor, HelpCircle, 
    ChevronRight, Loader2, XCircle, FileText, Send, CheckCircle2, User
} from 'lucide-react';
import itsmService from '../../../core/api/itsmService';
import { toast } from 'react-hot-toast';

export default function ITServiceCatalog() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedService, setSelectedService] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    
    // Dynamic Form State
    const [formData, setFormData] = useState({});

    const fetchServices = () => {
        setLoading(true);
        itsmService.getServiceItems()
            .then(data => {
                setServices(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to sync service catalog');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const categories = [
        { id: 'all', label: 'All Services', icon: Tag },
        { id: 'Identity', label: 'Access & Identity', icon: ShieldCheck },
        { id: 'Cloud', label: 'Cloud & Infrastructure', icon: Cpu },
        { id: 'Hardware', label: 'Office Devices', icon: Monitor },
        { id: 'Support', label: 'General Support', icon: HelpCircle }
    ];

    const filteredServices = services.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              s.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getIconComponent = (iconName) => {
        switch (iconName) {
            case 'ShieldCheck': return <ShieldCheck className="text-violet-400 w-6 h-6" />;
            case 'Cpu': return <Cpu className="text-emerald-400 w-6 h-6" />;
            case 'Monitor': return <Monitor className="text-blue-400 w-6 h-6" />;
            default: return <HelpCircle className="text-amber-400 w-6 h-6" />;
        }
    };

    const handleOpenForm = (service) => {
        setSelectedService(service);
        // Initialize form fields based on category
        if (service.category === 'Identity') {
            setFormData({ requestType: 'Access Permissions', targetSystem: 'Active Directory', username: '', justification: '' });
        } else if (service.category === 'Cloud') {
            setFormData({ environment: 'Development', specs: '2 CPU / 8GB RAM', purpose: '', specifications: '' });
        } else if (service.category === 'Hardware') {
            setFormData({ deviceType: 'Laptop', shippingAddress: '', justification: '' });
        } else {
            setFormData({ priority: 'medium', details: '' });
        }
    };

    const handleFormChange = (key, val) => {
        setFormData(prev => ({ ...prev, [key]: val }));
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await itsmService.createServiceRequest({
                service_item: selectedService.id,
                form_data: formData
            });
            toast.success(`IT Service Request for '${selectedService.name}' submitted successfully!`);
            setSelectedService(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to submit service request');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading && services.length === 0) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-indigo-400" size={40} />
            <p className="text-slate-400 font-medium font-['Inter']">Loading IT Service Catalog...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                    <Tag className="text-indigo-500 w-10 h-10" /> 
                    IT Service Catalog
                </h1>
                <p className="text-slate-400 mt-2 font-['Inter'] text-lg">Standardized internal and client-facing IT request workflows with automatic SLA assignment.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Category Sidebar */}
                <div className="md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const active = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap text-sm border ${
                                    active 
                                        ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 shadow-md shadow-indigo-500/5' 
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <Icon size={18} />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Right: Search & Grid */}
                <div className="flex-1 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search available IT services..."
                            className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-['Inter']"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {filteredServices.length === 0 ? (
                        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-20 text-center">
                            <HelpCircle size={48} className="mx-auto text-slate-700 mb-4 animate-pulse" />
                            <h3 className="text-xl font-bold text-slate-400 mb-2">No Services Found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">Try selecting a different category or clearing your search filter.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((service) => (
                                <div 
                                    key={service.id}
                                    onClick={() => handleOpenForm(service)}
                                    className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-lg hover:shadow-indigo-500/5 relative overflow-hidden"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="p-3 rounded-xl bg-slate-800 group-hover:bg-indigo-500/10 transition-colors duration-300">
                                                {getIconComponent(service.icon)}
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {service.sla_tier_name && (
                                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                                                        {service.sla_tier_name}
                                                    </span>
                                                )}
                                                {service.approval_required && (
                                                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                                                        Approval Required
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors font-['Outfit']">{service.name}</h3>
                                            <p className="text-slate-400 text-sm line-clamp-3 mt-2 font-['Inter'] leading-relaxed">{service.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-6 border-t border-slate-800/50 pt-4">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                            <User size={12} className="text-slate-600" /> {service.service_owner_name || 'Service Desk'}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                                            <span>Request</span>
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Service Request Slide-out / Modal Drawer */}
            {selectedService && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                                    {getIconComponent(selectedService.icon)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white uppercase font-['Outfit']">{selectedService.name}</h2>
                                    <p className="text-slate-400 text-sm font-['Inter'] mt-1">IT Service Catalog Request Form</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedService(null)} className="text-slate-500 hover:text-white transition-colors">
                                <XCircle size={28} />
                            </button>
                        </div>

                        {/* Drawer Form Body */}
                        <form onSubmit={handleSubmitRequest} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar font-['Inter']">
                            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 text-slate-300 text-sm leading-relaxed mb-4">
                                {selectedService.description}
                            </div>

                            {/* Dynamically Rendered Category Inputs */}
                            {selectedService.category === 'Identity' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Request Type</label>
                                        <select 
                                            value={formData.requestType} 
                                            onChange={(e) => handleFormChange('requestType', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            <option value="Access Permissions">Access Permissions</option>
                                            <option value="New Account">New Account Creation</option>
                                            <option value="Role Elevation">Temporary Role Elevation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Target System</label>
                                        <select 
                                            value={formData.targetSystem} 
                                            onChange={(e) => handleFormChange('targetSystem', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            <option value="Active Directory">Active Directory (Domain)</option>
                                            <option value="GitHub">GitHub Organization</option>
                                            <option value="Jira">Atlassian Jira / Confluence</option>
                                            <option value="AWS Console">AWS Management Console</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Target Username / Identifier</label>
                                        <input 
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={(e) => handleFormChange('username', e.target.value)}
                                            placeholder="e.g. john.doe@bitguard.com"
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Business Justification</label>
                                        <textarea
                                            required
                                            value={formData.justification}
                                            onChange={(e) => handleFormChange('justification', e.target.value)}
                                            rows={3}
                                            placeholder="Please describe why this system access is required."
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                            )}

                            {selectedService.category === 'Cloud' && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Environment</label>
                                            <select 
                                                value={formData.environment} 
                                                onChange={(e) => handleFormChange('environment', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            >
                                                <option value="Development">Development (Sandbox)</option>
                                                <option value="Staging">Staging (UAT)</option>
                                                <option value="Production">Production (Highly Regulated)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Requested Specifications</label>
                                            <select 
                                                value={formData.specs} 
                                                onChange={(e) => handleFormChange('specs', e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            >
                                                <option value="2 CPU / 8GB RAM">Standard: 2 vCPU / 8GB RAM</option>
                                                <option value="4 CPU / 16GB RAM">Large: 4 vCPU / 16GB RAM</option>
                                                <option value="8 CPU / 32GB RAM">Compute Intensive: 8 vCPU / 32GB RAM</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Associated Project Name</label>
                                        <input 
                                            type="text"
                                            required
                                            value={formData.purpose}
                                            onChange={(e) => handleFormChange('purpose', e.target.value)}
                                            placeholder="e.g. NextGen API Infrastructure"
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Technical Specifications & Packages</label>
                                        <textarea
                                            value={formData.specifications}
                                            onChange={(e) => handleFormChange('specifications', e.target.value)}
                                            rows={3}
                                            placeholder="Provide detail on operating system, required database models, or network ports."
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                            )}

                            {selectedService.category === 'Hardware' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Device Type</label>
                                        <select 
                                            value={formData.deviceType} 
                                            onChange={(e) => handleFormChange('deviceType', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            <option value="Laptop">Developer Workstation (MacBook/ThinkPad)</option>
                                            <option value="Monitor">4K Professional Monitor</option>
                                            <option value="Keyboard">Mechanical Keyboard & Mouse</option>
                                            <option value="Accessories">Cables / Dongles / Adapters</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Delivery & Shipping Address</label>
                                        <textarea
                                            required
                                            value={formData.shippingAddress}
                                            onChange={(e) => handleFormChange('shippingAddress', e.target.value)}
                                            rows={3}
                                            placeholder="Input complete shipping coordinates for equipment provisioning..."
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Business Justification</label>
                                        <textarea
                                            required
                                            value={formData.justification}
                                            onChange={(e) => handleFormChange('justification', e.target.value)}
                                            rows={2}
                                            placeholder="Provide reason for equipment replacement or new allocation..."
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                            )}

                            {selectedService.category === 'Support' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Impact & Priority</label>
                                        <select 
                                            value={formData.priority} 
                                            onChange={(e) => handleFormChange('priority', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            <option value="low">Low Impact (No work block)</option>
                                            <option value="medium">Medium Impact (Standard operational request)</option>
                                            <option value="high">High Impact (Severe operational degradation)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Request Details</label>
                                        <textarea
                                            required
                                            value={formData.details}
                                            onChange={(e) => handleFormChange('details', e.target.value)}
                                            rows={4}
                                            placeholder="Detail the standard support service you require..."
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Drawer Footer Buttons */}
                            <div className="p-6 bg-slate-950 border-t border-slate-800 -mx-8 -mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {selectedService.sla_tier_name && (
                                        <span className="text-slate-500 text-xs font-semibold">
                                            SLA Commitment: <strong className="text-slate-400">{selectedService.sla_tier_name}</strong>
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedService(null)} 
                                        className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={formLoading}
                                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 text-sm"
                                    >
                                        {formLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                        <span>Submit IT Request</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
