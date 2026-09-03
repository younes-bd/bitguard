import React from 'react';

const NDATemplate = ({ data }) => {
    const today = new Date().toLocaleDateString();
    
    return (
        <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg text-slate-800" style={{ minHeight: '1056px', fontFamily: 'serif' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-wider text-slate-900">Non-Disclosure Agreement</h1>
                    <p className="text-sm text-slate-500 mt-2">Mutual Confidentiality Agreement</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-slate-800">{data?.companyName || 'BitGuard Solutions'}</p>
                    <p className="text-sm text-slate-600">Date: {today}</p>
                    <p className="text-sm text-slate-600">Ref: NDA-{Math.floor(1000 + Math.random() * 9000)}</p>
                </div>
            </div>

            {/* Parties */}
            <div className="mb-8 text-sm leading-relaxed">
                <p className="mb-4">
                    This Non-Disclosure Agreement (the "Agreement") is entered into on <strong>{today}</strong>, between:
                </p>
                <div className="flex gap-8 mb-4">
                    <div className="flex-1 bg-slate-50 p-4 border border-slate-200">
                        <p className="font-bold text-slate-800 mb-2">Disclosing Party (Company)</p>
                        <p>{data?.companyName || 'BitGuard Solutions'}</p>
                        <p>{data?.companyAddress || '123 Tech Boulevard, Suite 100'}</p>
                        <p>{data?.companyCity || 'San Francisco, CA 94105'}</p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 border border-slate-200">
                        <p className="font-bold text-slate-800 mb-2">Receiving Party (Client)</p>
                        <p>{data?.clientName || 'Client Name'}</p>
                        <p>{data?.clientAddress || 'Client Address'}</p>
                        <p>{data?.clientEmail || ''}</p>
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div className="space-y-6 text-sm leading-relaxed text-justify mb-12">
                <section>
                    <h3 className="font-bold text-lg mb-2 text-slate-900">1. Definition of Confidential Information</h3>
                    <p>For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged. If Confidential Information is in written form, the Disclosing Party shall label or stamp the materials with the word "Confidential" or some similar warning.</p>
                </section>

                <section>
                    <h3 className="font-bold text-lg mb-2 text-slate-900">2. Exclusions from Confidential Information</h3>
                    <p>Receiving Party's obligations under this Agreement do not extend to information that is: (a) publicly known at the time of disclosure or subsequently becomes publicly known through no fault of the Receiving Party; (b) discovered or created by the Receiving Party before disclosure by Disclosing Party; (c) learned by the Receiving Party through legitimate means other than from the Disclosing Party or Disclosing Party's representatives.</p>
                </section>

                <section>
                    <h3 className="font-bold text-lg mb-2 text-slate-900">3. Obligations of Receiving Party</h3>
                    <p>Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party. Receiving Party shall carefully restrict access to Confidential Information to employees, contractors, and third parties as is reasonably required.</p>
                </section>
                
                <section>
                    <h3 className="font-bold text-lg mb-2 text-slate-900">4. Term</h3>
                    <p>The nondisclosure provisions of this Agreement shall survive the termination of this Agreement and Receiving Party's duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret or until Disclosing Party sends Receiving Party written notice releasing Receiving Party from this Agreement.</p>
                </section>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-12 mt-16 pt-8 border-t border-slate-200">
                <div>
                    <p className="font-bold mb-8">For {data?.companyName || 'BitGuard Solutions'}</p>
                    <div className="border-b border-slate-400 mb-2"></div>
                    <p className="text-sm">Authorized Signature</p>
                    <p className="text-sm mt-4">Name: ______________________</p>
                    <p className="text-sm mt-2">Title: _______________________</p>
                    <p className="text-sm mt-2">Date: {today}</p>
                </div>
                <div>
                    <p className="font-bold mb-8">For {data?.clientName || 'Client'}</p>
                    <div className="border-b border-slate-400 mb-2"></div>
                    <p className="text-sm">Authorized Signature</p>
                    <p className="text-sm mt-4">Name: ______________________</p>
                    <p className="text-sm mt-2">Title: _______________________</p>
                    <p className="text-sm mt-2">Date: _______________________</p>
                </div>
            </div>
            
            {/* Footer */}
            <div className="mt-16 text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
                This document was generated securely via the BitGuard CRM EDMS module. 
                <br/>Confidential & Proprietary.
            </div>
        </div>
    );
};

export default NDATemplate;
