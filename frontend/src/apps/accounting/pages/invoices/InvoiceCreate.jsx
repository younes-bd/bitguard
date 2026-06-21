import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../../core/api/erpService';
import { crmService } from '../../../../core/api/crmService';
import { contractsService } from '../../../../core/api/contractsService';
import { storeService } from '../../../../core/api/storeService';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, FileText, User, Tag, Briefcase, FileSignature } from 'lucide-react';
import InvoiceLineItems from '../billing/InvoiceLineItems';

const InvoiceCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        client: '',
        type: 'standard',
        project: '',
        contract: '',
        issue_date: new Date().toISOString().split('T')[0],
        payment_terms: 'net_30',
        due_date: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 30);
            return d.toISOString().split('T')[0];
        })(),
        status: 'draft',
        reference: '',
        notes: '',
        currency: 'USD',
        discount_type: 'amount',
        discount_value: 0,
        items: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsRes, projectsRes, contractsRes, productsRes] = await Promise.all([
                    crmService.getClients(),
                    erpService.getProjects(),
                    contractsService.getContracts(),
                    storeService.getProducts()
                ]);
                setClients(Array.isArray(clientsRes) ? clientsRes : clientsRes.results || []);
                setProjects(Array.isArray(projectsRes) ? projectsRes : projectsRes.results || []);
                setContracts(Array.isArray(contractsRes) ? contractsRes : contractsRes.results || []);
                setProducts(Array.isArray(productsRes) ? productsRes : productsRes.results || []);
            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            let updated = { ...prev, [name]: value };
            let updatedItems = [...prev.items];

            if (name === 'issue_date' || name === 'payment_terms') {
                if (updated.payment_terms !== 'custom') {
                    const issueDate = new Date(updated.issue_date || new Date());
                    let days = 0;
                    switch (updated.payment_terms) {
                        case 'net_15': days = 15; break;
                        case 'net_30': days = 30; break;
                        case 'net_45': days = 45; break;
                        case 'net_60': days = 60; break;
                        case 'due_on_receipt': days = 0; break;
                    }
                    const dueDate = new Date(issueDate);
                    dueDate.setDate(dueDate.getDate() + days);
                    updated.due_date = dueDate.toISOString().split('T')[0];
                }
            }
            if (name === 'due_date') {
                updated.payment_terms = 'custom';
            }
            
            if (name === 'client') {
                // If client changes and the currently selected contract or project doesn't belong to it, clear them
                if (value) {
                    const selectedContract = contracts.find(c => String(c.id) === String(prev.contract));
                    if (selectedContract && String(selectedContract.client) !== String(value)) {
                        updated.contract = '';
                        updatedItems = updatedItems.filter(item => !item._isContractItem);
                    }
                    const selectedProject = projects.find(p => String(p.id) === String(prev.project));
                    if (selectedProject && String(selectedProject.client) !== String(value)) {
                        updated.project = '';
                        updatedItems = updatedItems.filter(item => !item._isProjectItem);
                    }
                } else {
                    updated.contract = '';
                    updated.project = '';
                    updatedItems = updatedItems.filter(item => !item._isContractItem && !item._isProjectItem);
                }
            }
            
            if (name === 'contract') {
                // Remove old contract item
                updatedItems = updatedItems.filter(item => !item._isContractItem);
                
                if (value) {
                    const contractObj = contracts.find(c => String(c.id) === String(value));
                    if (contractObj) {
                        // Auto-populate client if not set or mismatched
                        if (String(updated.client) !== String(contractObj.client)) {
                            updated.client = String(contractObj.client);
                        }
                        
                        // Add new contract item
                        const clientObj = clients.find(cl => String(cl.id) === String(contractObj.client));
                        const clientName = clientObj ? clientObj.name : 'Client';
                        const slaTierText = contractObj.sla_tier_name ? ` (${contractObj.sla_tier_name} SLA)` : '';
                        
                        updatedItems.push({
                            product_id: '',
                            description: `${contractObj.contract_type.toUpperCase()} Retainer Fee - ${clientName}${slaTierText}`,
                            quantity: 1,
                            unit_price: parseFloat(contractObj.monthly_value || 0),
                            tax_rate: 0,
                            discount: 0,
                            total: parseFloat(contractObj.monthly_value || 0),
                            _isContractItem: true
                        });
                    }
                }
            }
            
            if (name === 'project') {
                // Remove old project item
                updatedItems = updatedItems.filter(item => !item._isProjectItem);
                
                if (value) {
                    const projectObj = projects.find(p => String(p.id) === String(value));
                    if (projectObj) {
                        // Auto-populate client if not set or mismatched
                        if (String(updated.client) !== String(projectObj.client)) {
                            updated.client = String(projectObj.client);
                        }
                        
                        // Add new project item
                        updatedItems.push({
                            product_id: '',
                            description: `Project Delivery Services - ${projectObj.name}`,
                            quantity: 1,
                            unit_price: parseFloat(projectObj.budget || 0),
                            tax_rate: 0,
                            discount: 0,
                            total: parseFloat(projectObj.budget || 0),
                            _isProjectItem: true
                        });
                    }
                }
            }
            
            return { ...updated, items: updatedItems };
        });
    };

    const handleItemsChange = (items) => {
        setFormData(prev => ({ ...prev, items }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filter out internal tracking properties before sending
            const payload = {
                ...formData,
                items: formData.items.map(({ _isContractItem, _isProjectItem, ...item }) => item)
            };
            await erpService.createInvoice(payload);
            toast.success('Invoice created successfully!');
            navigate('/admin/accounting/invoices');
        } catch (error) {
            console.error('Create failed', error);
            toast.error('Failed to create invoice. Please check all fields.');
            setLoading(false);
        }
    };

    const filteredProjects = formData.client 
        ? projects.filter(p => String(p.client) === String(formData.client))
        : projects;

    const filteredContracts = formData.client
        ? contracts.filter(c => String(c.client) === String(formData.client))
        : contracts;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/accounting/invoices')}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors border border-slate-700/30"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create Document</h1>
                    <p className="text-slate-400">Generate a standard invoice, proforma, or credit note.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Configuration Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Primary Details */}
                    <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-slate-700/50 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} className="text-blue-500" /> Client Selection
                                </label>
                                <select
                                    name="client"
                                    value={formData.client}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                                    required
                                >
                                    <option value="">Select Target Client</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Tag size={14} className="text-purple-500" /> Document Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all appearance-none"
                                    required
                                >
                                    <option value="standard">Standard Invoice</option>
                                    <option value="proforma">Proforma Invoice</option>
                                    <option value="credit_note">Credit Note</option>
                                </select>
                            </div>
                        </div>

                        {/* Enterprise Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/50">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Briefcase size={14} className="text-emerald-500" /> Link Project
                                </label>
                                <select
                                    name="project"
                                    value={formData.project}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                                >
                                    <option value="">-- No Project --</option>
                                    {filteredProjects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <FileSignature size={14} className="text-orange-500" /> Link Contract
                                </label>
                                <select
                                    name="contract"
                                    value={formData.contract}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none"
                                >
                                    <option value="">-- No Contract --</option>
                                    {filteredContracts.map(c => (
                                        <option key={c.id} value={c.id}>{c.contract_type.toUpperCase()} - {c.client_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/50">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Issue Date</label>
                                <input
                                    type="date"
                                    name="issue_date"
                                    value={formData.issue_date}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Terms</label>
                                <select
                                    name="payment_terms"
                                    value={formData.payment_terms || 'custom'}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                                >
                                    <option value="due_on_receipt">Due on Receipt</option>
                                    <option value="net_15">Net 15</option>
                                    <option value="net_30">Net 30</option>
                                    <option value="net_45">Net 45</option>
                                    <option value="net_60">Net 60</option>
                                    <option value="custom">Custom Date</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Due Date</label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/50">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reference</label>
                                <input
                                    type="text"
                                    name="reference"
                                    placeholder="PO #, Project Ref"
                                    value={formData.reference}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/50">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">Currency</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (â‚¬)</option>
                                    <option value="GBP">GBP (Â£)</option>
                                    <option value="AUD">AUD ($)</option>
                                    <option value="CAD">CAD ($)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">Discount Type</label>
                                <select
                                    name="discount_type"
                                    value={formData.discount_type}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                                >
                                    <option value="amount">Fixed Amount</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Discount Value</label>
                                <input
                                    type="number"
                                    name="discount_value"
                                    value={formData.discount_value}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Meta/Notes */}
                    <div className="glass-panel p-8 rounded-2xl border border-slate-700/50 space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Internal Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Add payment terms, banking details, or internal memos..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-blue-500 outline-none resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Line Item Editor */}
                <div className="glass-panel p-8 rounded-2xl border border-slate-700/50 shadow-2xl shadow-blue-500/5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Service & Product Breakdown</h3>
                    </div>
                    
                    <InvoiceLineItems 
                        items={formData.items} 
                        onChange={handleItemsChange}
                        products={products}
                    />
                </div>

                {/* Final Actions */}
                <div className="flex justify-end items-center gap-6 pt-8 border-t border-slate-800">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/accounting/invoices')}
                        className="text-sm font-bold text-slate-500 hover:text-white transition-colors"
                    >
                        Discard Draft
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Generating...</span>
                            </div>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Finalize & Issue</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceCreate;




