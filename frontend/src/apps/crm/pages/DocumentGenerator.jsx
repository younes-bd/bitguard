import React, { useState, useEffect } from 'react';
import { FileText, Printer, ChevronDown, CheckCircle, Search } from 'lucide-react';
import SERVICES from '../../../core/data/servicesData';
import ProposalTemplate from '../components/documents/ProposalTemplate';
import SOWTemplate from '../components/documents/SOWTemplate';
import MSATemplate from '../components/documents/MSATemplate';
import SLATemplate from '../components/documents/SLATemplate';
import ProformaInvoiceTemplate from '../components/documents/ProformaInvoiceTemplate';
import CommercialInvoiceTemplate from '../components/documents/CommercialInvoiceTemplate';
import DeliveryReceiptTemplate from '../components/documents/DeliveryReceiptTemplate';
import B2CInvoiceTemplate from '../components/documents/B2CInvoiceTemplate';

const DOC_TYPES = [
    { id: 'b2c_invoice', name: 'Retail Receipt (B2C)', color: 'bg-emerald-400' },
    { id: 'delivery', name: 'Hardware Delivery Receipt', color: 'bg-amber-400' },
    { id: 'proposal', name: 'Service Proposal & Quote', color: 'bg-blue-500' },
    { id: 'sow', name: 'Statement of Work (SOW)', color: 'bg-indigo-500' },
    { id: 'msa', name: 'Master Services Agreement (MSA)', color: 'bg-purple-500' },
    { id: 'sla', name: 'Service Level Agreement (SLA)', color: 'bg-rose-500' },
    { id: 'proforma', name: 'Proforma Invoice (Deposit)', color: 'bg-emerald-500' },
    { id: 'invoice', name: 'Commercial Tax Invoice', color: 'bg-emerald-600' }
];

const DocumentGenerator = () => {
    // Form State
    const [clientName, setClientName] = useState('Acme Corp LLC');
    const [clientAddress, setClientAddress] = useState('123 Enterprise Blvd, Suite 400\nSan Francisco, CA 94105');
    const [clientEmail, setClientEmail] = useState('billing@acmecorp.com');
    const [docType, setDocType] = useState('proposal');
    const [selectedServiceKeys, setSelectedServiceKeys] = useState([]);
    const [docNumber, setDocNumber] = useState(`DOC-${Math.floor(Math.random() * 10000)}`);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Available services from servicesData.js
    const availableServices = Object.keys(SERVICES).map(key => ({
        id: key,
        ...SERVICES[key]
    }));

    const handlePrint = () => {
        window.print();
    };

    const toggleService = (id) => {
        if (selectedServiceKeys.includes(id)) {
            setSelectedServiceKeys(selectedServiceKeys.filter(k => k !== id));
        } else {
            setSelectedServiceKeys([...selectedServiceKeys, id]);
        }
    };

    const generateDataPayload = () => {
        return {
            client: {
                name: clientName,
                address: clientAddress,
                email: clientEmail
            },
            meta: {
                docNumber,
                date,
                type: docType
            },
            services: selectedServiceKeys.map(k => ({
                id: k,
                ...SERVICES[k]
            }))
        };
    };

    return (
        <div className="h-full flex flex-col xl:flex-row gap-6 relative">
            
            {/* CONFIGURATION SIDEBAR (Hidden when printing via CSS media query) */}
            <div className="w-full xl:w-96 flex-shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl print:hidden flex flex-col h-[calc(100vh-120px)] sticky top-6 overflow-hidden">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="text-blue-500" size={24} />
                        Doc Generator
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                    {/* Document Type Selection */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Document Type</label>
                        <div className="space-y-2">
                            {DOC_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setDocType(type.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                                        docType === type.id 
                                            ? `bg-slate-800 border-${type.color.split('-')[1]}-500/50 shadow-lg shadow-${type.color.split('-')[1]}-500/10` 
                                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                    }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${type.color} ${docType !== type.id && 'opacity-30'}`}></div>
                                    <span className={`font-semibold text-sm ${docType === type.id ? 'text-white' : 'text-slate-400'}`}>
                                        {type.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-800"></div>

                    {/* Client Details */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Client Details</label>
                        <div className="space-y-3">
                            <div>
                                <input 
                                    type="text" 
                                    value={clientName} onChange={(e) => setClientName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Company Name"
                                />
                            </div>
                            <div>
                                <textarea 
                                    value={clientAddress} onChange={(e) => setClientAddress(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors h-20 resize-none"
                                    placeholder="Client Address"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-800"></div>

                    {/* Service Selection */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Scope of Services ({selectedServiceKeys.length})</label>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">Select the services to include in this document. Data will be auto-populated.</p>
                        
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar border border-slate-800 rounded-xl p-2 bg-slate-950/50">
                            {availableServices.map(service => {
                                const isSelected = selectedServiceKeys.includes(service.id);
                                return (
                                    <div 
                                        key={service.id} 
                                        onClick={() => toggleService(service.id)}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                                            isSelected 
                                            ? 'bg-blue-500/10 border-blue-500/30' 
                                            : 'bg-slate-900 border-transparent hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                                            isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-600 bg-slate-800'
                                        }`}>
                                            {isSelected && <CheckCircle size={12} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>{service.title}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Print Action */}
                <div className="pt-6 mt-4 border-t border-slate-800">
                    <button 
                        onClick={handlePrint}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                    >
                        <Printer size={18} />
                        Generate & Print PDF
                    </button>
                    <p className="text-center text-[10px] text-slate-500 mt-3 uppercase tracking-wider">High-Res A4 Format</p>
                </div>
            </div>

            {/* PREVIEW & PRINT CANVAS */}
            <div className="flex-1 overflow-y-auto bg-slate-950 rounded-2xl flex justify-center py-10 px-4 print:p-0 print:bg-white print:overflow-visible">
                {/* 
                    This div acts as the "A4 Paper" boundary on screen, 
                    and takes over the whole screen when printing.
                */}
                <div className="bg-white text-slate-900 shadow-2xl overflow-hidden w-full max-w-[850px] min-h-[1100px] print:shadow-none print:w-full print:max-w-none print:min-h-0 relative">
                    
                    {/* Render specific template based on selection */}
                    {docType === 'b2c_invoice' && <B2CInvoiceTemplate data={generateDataPayload()} />}
                    {docType === 'delivery' && <DeliveryReceiptTemplate data={generateDataPayload()} />}
                    {docType === 'proposal' && <ProposalTemplate data={generateDataPayload()} />}
                    {docType === 'sow' && <SOWTemplate data={generateDataPayload()} />}
                    {docType === 'msa' && <MSATemplate data={generateDataPayload()} />}
                    {docType === 'sla' && <SLATemplate data={generateDataPayload()} />}
                    {docType === 'proforma' && <ProformaInvoiceTemplate data={generateDataPayload()} />}
                    {docType === 'invoice' && <CommercialInvoiceTemplate data={generateDataPayload()} />}

                </div>
            </div>
        </div>
    );
};

export default DocumentGenerator;
