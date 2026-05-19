import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../core/api/erpService';
import { crmService } from '../../../core/api/crmService';
import { contractsService } from '../../../core/api/contractsService';
import { storeService } from '../../../core/api/storeService';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, FileText, User, Tag, Briefcase, FileSignature } from 'lucide-react';
import InvoiceLineItems from './billing/InvoiceLineItems';

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
        due_date: '',
        status: 'draft',
        reference: '',
        notes: '',
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemsChange = (items) => {
        setFormData(prev => ({ ...prev, items }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await erpService.createInvoice(formData);
            toast.success('Invoice created successfully!');
            navigate('/admin/erp/invoices');
        } catch (error) {
            console.error('Create failed', error);
            toast.error('Failed to create invoice. Please check all fields.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/erp/invoices')}
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
                                    {projects.map(p => (
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
                                    {contracts.map(c => (
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
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Due Date</label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
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
                        onClick={() => navigate('/admin/erp/invoices')}
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



