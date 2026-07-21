import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit3, Trash2, Code, Eye, Loader2, RefreshCw } from 'lucide-react';
import reportingService from '../../../../core/api/reportingService';

export default function TemplateManager() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    const [currentTemplate, setCurrentTemplate] = useState({
        name: '',
        model: '',
        html_content: '<h1>{{ record.name }}</h1>\n<p>Welcome to the report.</p>',
        css_content: 'h1 { color: #3B82F6; }',
        is_active: true,
        is_default: false
    });
    const [previewHtml, setPreviewHtml] = useState('');
    const [livePreviewHtml, setLivePreviewHtml] = useState('');
    const [previewLoading, setPreviewLoading] = useState(false);

    const MODULE_MODELS = [
        { value: 'accounting.Invoice', label: 'Accounting - Invoice' },
        { value: 'erp.DeliveryNote', label: 'ERP - Delivery Note' },
        { value: 'purchase.PurchaseOrder', label: 'Purchase - Purchase Order' },
        { value: 'inventory.GoodsReceipt', label: 'Inventory - Goods Receipt' },
        { value: 'hrm.PaySlip', label: 'HRM - Payslip' },
        { value: 'hrm.EmployeeContract', label: 'HRM - Employee Contract' },
        { value: 'contracts.Quote', label: 'Contracts - Quote' },
        { value: 'contracts.ServiceContract', label: 'Contracts - Service Contract' },
        { value: 'crm.Proposal', label: 'CRM - Proposal' },
    ];

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const res = await reportingService.getTemplates();
            setTemplates(res?.results || res || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleSave = async () => {
        try {
            if (currentTemplate.id) {
                await reportingService.updateTemplate(currentTemplate.id, currentTemplate);
            } else {
                await reportingService.createTemplate(currentTemplate);
            }
            setIsModalOpen(false);
            fetchTemplates();
        } catch (err) {
            console.error('Failed to save template', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this template?")) return;
        try {
            await reportingService.deleteTemplate(id);
            fetchTemplates();
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    const handlePreview = async (template) => {
        try {
            const res = await reportingService.previewTemplate(template.id, { name: 'Sample Record' });
            setPreviewHtml(res.html);
            setIsPreviewOpen(true);
        } catch (err) {
            console.error('Failed to preview', err);
        }
    };

    const updateLivePreview = async () => {
        setPreviewLoading(true);
        try {
            // we simulate a temporary save or we can just send the raw html/css to a render endpoint
            // Since the backend might only preview saved templates, we can just compile it locally for basic HTML
            // Note: Actual QWeb/Jinja variables won't render unless backend processes it.
            // For now, we'll just inject the CSS into the HTML for live preview.
            const combined = `
                <style>${currentTemplate.css_content}</style>
                <div class="report-preview-body">
                    ${currentTemplate.html_content.replace(/{{([^}]+)}}/g, '[$1]')}
                </div>
            `;
            setLivePreviewHtml(combined);
        } finally {
            setPreviewLoading(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            const timeout = setTimeout(() => {
                updateLivePreview();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentTemplate.html_content, currentTemplate.css_content, isModalOpen]);

    const openEditModal = (template = null) => {
        if (template) {
            setCurrentTemplate(template);
        } else {
            setCurrentTemplate({
                name: '',
                model: 'accounting.Invoice',
                html_content: '<h1>{{ record.name }}</h1>\n<p>Welcome to the report.</p>',
                css_content: 'h1 { color: #3B82F6; }',
                is_active: true,
                is_default: false
            });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 font-['Outfit']">
                        <FileText className="text-blue-500 w-8 h-8" />
                        Template Manager
                    </h1>
                    <p className="text-slate-400 mt-2">Manage HTML/CSS templates for PDF generation across all modules.</p>
                </div>
                <button 
                    onClick={() => openEditModal()} 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} /> New Template
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>
                ) : templates.length === 0 ? (
                    <div className="p-12 text-center">
                        <Code size={48} className="text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No templates</h3>
                        <p className="text-slate-400 mt-2">Create your first document template to get started.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Template Name</th>
                                <th className="p-4">Module / Model</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Default</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {templates.map(t => (
                                <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 text-white font-medium">{t.name}</td>
                                    <td className="p-4 text-slate-400 font-mono text-sm">{t.model}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.is_active ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                            {t.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {t.is_default && (
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-500/30">
                                                Default
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handlePreview(t)} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors" title="Preview">
                                                <Eye size={18} />
                                            </button>
                                            <button onClick={() => openEditModal(t)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Edit">
                                                <Edit3 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Template Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Code className="text-blue-500" />
                                {currentTemplate.id ? 'Edit Template' : 'New Template'}
                            </h2>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input 
                                        type="checkbox" 
                                        checked={currentTemplate.is_default}
                                        onChange={e => setCurrentTemplate({...currentTemplate, is_default: e.target.checked})}
                                        className="rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-blue-500"
                                    />
                                    Set as Default for Model
                                </label>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                            {/* Editor Side */}
                            <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-800 space-y-6 bg-slate-900 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold">Template Name</label>
                                        <input 
                                            type="text"
                                            value={currentTemplate.name}
                                            onChange={e => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                                            placeholder="e.g. Standard Invoice"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold">Record Model</label>
                                        <select
                                            value={currentTemplate.model}
                                            onChange={e => setCurrentTemplate({...currentTemplate, model: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                                        >
                                            {MODULE_MODELS.map(m => (
                                                <option key={m.value} value={m.value}>{m.label} ({m.value})</option>
                                            ))}
                                            <option value="custom">Custom / Other</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold flex justify-between">
                                        <span>HTML Content (Jinja2 Syntax)</span>
                                    </label>
                                    <textarea 
                                        value={currentTemplate.html_content}
                                        onChange={e => setCurrentTemplate({...currentTemplate, html_content: e.target.value})}
                                        className="w-full bg-[#1e1e1e] border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none focus:border-blue-500 custom-scrollbar"
                                        rows="12"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold flex justify-between">
                                        <span>CSS Styling</span>
                                    </label>
                                    <textarea 
                                        value={currentTemplate.css_content}
                                        onChange={e => setCurrentTemplate({...currentTemplate, css_content: e.target.value})}
                                        className="w-full bg-[#1e1e1e] border border-slate-800 rounded-xl p-4 text-sky-400 font-mono text-sm focus:outline-none focus:border-blue-500 custom-scrollbar"
                                        rows="6"
                                    />
                                </div>
                            </div>

                            {/* Live Preview Side */}
                            <div className="w-full md:w-1/2 flex flex-col bg-slate-100">
                                <div className="p-3 bg-slate-200 border-b border-slate-300 flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-700 flex items-center gap-2">
                                        <Eye size={16} /> Live Preview
                                    </span>
                                    {previewLoading && <Loader2 size={14} className="animate-spin text-slate-500" />}
                                </div>
                                <div className="flex-1 p-8 overflow-auto flex justify-center">
                                    <div 
                                        className="bg-white shadow-lg w-full max-w-[800px] h-fit min-h-[600px] p-8 border border-slate-200"
                                        dangerouslySetInnerHTML={{ __html: livePreviewHtml }} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-400 hover:text-white font-medium transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20">
                                Save Template
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Backend Preview Modal (Full PDF simulation) */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-4 border-b bg-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Eye className="text-blue-600" size={20} />
                                Backend Engine Render
                            </h2>
                            <button onClick={() => setIsPreviewOpen(false)} className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-bold transition-colors">
                                Close
                            </button>
                        </div>
                        <div className="flex-1 bg-white p-8 overflow-auto flex justify-center">
                            <div className="w-full max-w-[800px] shadow-2xl p-8" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
