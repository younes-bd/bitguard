import React from 'react';

const MSATemplate = ({ data }) => {
    return (
        <div className="p-12 relative h-full">
            {/* Header */}
            <div className="text-center pb-8 border-b-2 border-slate-900 mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter">MASTER SERVICES AGREEMENT</h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 bg-slate-100 inline-block px-3 py-1 rounded">Execution Copy</p>
            </div>

            {/* Parties */}
            <div className="mb-8">
                <p className="text-sm text-slate-700 leading-relaxed mb-4 text-justify">
                    This Master Services Agreement ("Agreement") is entered into effective as of <strong>{data.meta.date}</strong> (the "Effective Date") by and between:
                </p>
                <div className="grid grid-cols-2 gap-8 bg-slate-50 border border-slate-200 p-6 rounded-lg mb-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Provider</p>
                        <h3 className="text-sm font-bold text-slate-900">BitGuard Solutions LLC</h3>
                        <p className="text-xs text-slate-600">100 Tech Center Drive, Suite 200<br/>Irvine, CA 92618</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client</p>
                        <h3 className="text-sm font-bold text-slate-900">{data.client.name}</h3>
                        <p className="text-xs text-slate-600 whitespace-pre-wrap">{data.client.address}</p>
                    </div>
                </div>
            </div>

            {/* Legal Terms Formatting */}
            <div className="prose prose-sm prose-slate max-w-none text-xs text-justify columns-1 space-y-4 text-slate-700">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">1. Services Provided</h3>
                    <p>Provider agrees to provide technology and cybersecurity services to Client as described in mutually executed Statements of Work (SOWs) or Service Level Agreements (SLAs) referencing this Agreement. This Agreement serves as the master contract governing all future engagements.</p>
                </div>
                
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">2. Term and Termination</h3>
                    <p>This Agreement shall commence on the Effective Date and continue for an initial term of thirty-six (36) months, automatically renewing for successive one (1) year periods unless terminated by either party with ninety (90) days written notice prior to the renewal date. Provider reserves the right to suspend services for non-payment exceeding 45 days.</p>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">3. Payment Terms & Fees</h3>
                    <p>Client shall pay all valid invoices within thirty (30) days of receipt ("Net 30"). Late payments shall accrue interest at the lesser of one and one-half percent (1.5%) per month or the highest rate permitted by law. In the event of a dispute, Client must notify Provider within ten (10) days of the invoice date; otherwise, the invoice is deemed valid and payable in full.</p>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">4. Limit of Liability</h3>
                    <p className="font-semibold text-slate-900 bg-amber-50 border border-amber-200 p-2 rounded">
                        IN NO EVENT SHALL PROVIDER BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING BUT NOT LIMITED TO LOST PROFITS, BUSINESS INTERRUPTION, OR DATA LOSS, REGARDLESS OF THE FORM OF ACTION. PROVIDER'S TOTAL AGGREGATE LIABILITY ARISING OUT OF THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID BY CLIENT IN THE THREE (3) MONTHS PRECEDING THE CLAIM.
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">5. Confidentiality</h3>
                    <p>"Confidential Information" means any non-public data, business plans, financials, or technical architecture isolated by either party. Both parties agree to protect such information with the same degree of care as their own and will not disclose it to any third party without explicit written consent, except where required by law.</p>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">6. Data Ownership</h3>
                    <p>Client retains all right, title, and interest in and to all Client Data. Provider acquires no rights to Client Data other than the limited right to process it as necessary to deliver the Services.</p>
                </div>

                <div className="break-inside-avoid pt-2">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">7. Governing Law</h3>
                    <p>This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any legal action arising out of this Agreement shall be brought exclusively in the state or federal courts located in Orange County, California.</p>
                </div>
            </div>

            {/* Signature Block */}
            <div className="mt-16 pt-8 border-t border-slate-200 break-inside-avoid">
                <p className="text-xs text-slate-600 mb-6 text-center italic">IN WITNESS WHEREOF, the parties have executed this Master Services Agreement by their duly authorized representatives.</p>
                
                <div className="flex justify-between items-end gap-12">
                    <div className="flex-1">
                        <div className="border-b border-slate-400 h-12 mb-2"></div>
                        <p className="text-xs font-bold text-slate-900">Signature ({data.client.name})</p>
                        <div className="flex justify-between mt-1">
                            <p className="text-[10px] text-slate-500">Name:</p>
                            <p className="text-[10px] text-slate-500">Date:</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="border-b border-slate-400 h-12 mb-2"></div>
                        <p className="text-xs font-bold text-slate-900">Signature (BitGuard Solutions LLC)</p>
                        <div className="flex justify-between mt-1">
                            <p className="text-[10px] text-slate-500">Name:</p>
                            <p className="text-[10px] text-slate-500">Date: {data.meta.date}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-[9px] text-slate-400">Page 1 of 1 • DocRef: MSA-{data.meta.docNumber}</p>
            </div>
        </div>
    );
};

export default MSATemplate;
