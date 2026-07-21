import React, { useState, useEffect } from 'react';
import { PackageOpen, Search, Plus, Eye } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';

export default function GoodsReceiptList() {
    const [receipts, setReceipts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        erpService.getGoodsReceipts()
            .then(data => {
                setReceipts(data || []);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <PackageOpen className="w-6 h-6 text-purple-400" />
                        Goods Receipts
                    </h1>
                    <p className="text-slate-400 mt-1">Manage inbound inventory and purchase order receipts.</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    Receive Goods
                </button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search receipts..." 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 text-sm">
                            <tr>
                                <th className="p-4 font-medium">Receipt No</th>
                                <th className="p-4 font-medium">Purchase Order</th>
                                <th className="p-4 font-medium">Received Date</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-slate-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">Loading goods receipts...</td>
                                </tr>
                            ) : receipts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No goods receipts found.</td>
                                </tr>
                            ) : (
                                receipts.map(receipt => (
                                    <tr key={receipt.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-medium text-white">{receipt.receipt_number}</td>
                                        <td className="p-4">PO #{receipt.purchase_order}</td>
                                        <td className="p-4">{receipt.received_date}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                receipt.status === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
                                                receipt.status === 'draft' ? 'bg-slate-500/10 text-slate-400' :
                                                'bg-red-500/10 text-red-400'
                                            }`}>
                                                {receipt.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
