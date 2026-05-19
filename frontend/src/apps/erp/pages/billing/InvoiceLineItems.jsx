import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

const InvoiceLineItems = ({ items = [], onChange, products = [] }) => {
    const [lines, setLines] = useState(items.length > 0 ? items : [
        { product_id: '', description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount: 0, total: 0 }
    ]);

    useEffect(() => {
        // Sync lines state if items prop changes (e.g. contract or project auto-populate)
        const hasDifferences = items.length !== lines.length || items.some((item, i) => {
            const line = lines[i];
            return !line || 
                   item.description !== line.description || 
                   item.unit_price !== line.unit_price || 
                   item.product_id !== line.product_id ||
                   item.quantity !== line.quantity;
        });
        if (hasDifferences) {
            setLines(items.length > 0 ? items : [
                { product_id: '', description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount: 0, total: 0 }
            ]);
        }
    }, [items]);

    const calculateLineTotal = (line) => {
        const subtotal = line.quantity * line.unit_price;
        const tax = subtotal * (line.tax_rate / 100);
        return subtotal + tax - line.discount;
    };

    const handleLineChange = (index, field, value) => {
        const newLines = [...lines];
        newLines[index][field] = value;
        
        // Auto-fill details if product is selected
        if (field === 'product_id' && value) {
            const product = products.find(p => p.id == value);
            if (product) {
                newLines[index].description = product.name;
                newLines[index].unit_price = parseFloat(product.price) || 0;
            }
        }
        
        newLines[index].total = calculateLineTotal(newLines[index]);
        setLines(newLines);
        onChange(newLines);
    };

    const addLine = () => {
        const newLines = [...lines, { product_id: '', description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount: 0, total: 0 }];
        setLines(newLines);
        onChange(newLines);
    };

    const removeLine = (index) => {
        if (lines.length === 1) return;
        const newLines = lines.filter((_, i) => i !== index);
        setLines(newLines);
        onChange(newLines);
    };

    const subtotal = lines.reduce((acc, line) => acc + (line.quantity * line.unit_price), 0);
    const taxTotal = lines.reduce((acc, line) => acc + (line.quantity * line.unit_price * (line.tax_rate / 100)), 0);
    const discountTotal = lines.reduce((acc, line) => acc + (Number(line.discount) || 0), 0);
    const grandTotal = subtotal + taxTotal - discountTotal;

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                            <th className="pb-3 pl-2 w-48">Service/Product</th>
                            <th className="pb-3 pl-2">Description</th>
                            <th className="pb-3 w-24">Qty</th>
                            <th className="pb-3 w-32">Unit Price</th>
                            <th className="pb-3 w-24">Tax %</th>
                            <th className="pb-3 w-28">Discount</th>
                            <th className="pb-3 w-32 text-right pr-2">Total</th>
                            <th className="pb-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {lines.map((line, index) => (
                            <tr key={index} className="group hover:bg-slate-900/30 transition-colors">
                                <td className="py-3 pl-2">
                                    <select
                                        value={line.product_id || ''}
                                        onChange={(e) => handleLineChange(index, 'product_id', e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 text-white focus:ring-1 focus:ring-blue-500 outline-none text-sm appearance-none"
                                    >
                                        <option value="">Custom Item</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-3 pl-2">
                                    <input
                                        type="text"
                                        value={line.description}
                                        onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                        placeholder="Item description..."
                                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-600"
                                    />
                                </td>
                                <td className="py-3">
                                    <input
                                        type="number"
                                        value={line.quantity}
                                        onChange={(e) => handleLineChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-transparent border-none focus:ring-0 text-white"
                                    />
                                </td>
                                <td className="py-3">
                                    <input
                                        type="number"
                                        value={line.unit_price}
                                        onChange={(e) => handleLineChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-transparent border-none focus:ring-0 text-white"
                                    />
                                </td>
                                <td className="py-3">
                                    <input
                                        type="number"
                                        value={line.tax_rate}
                                        onChange={(e) => handleLineChange(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-transparent border-none focus:ring-0 text-white"
                                    />
                                </td>
                                <td className="py-3">
                                    <input
                                        type="number"
                                        value={line.discount}
                                        onChange={(e) => handleLineChange(index, 'discount', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-transparent border-none focus:ring-0 text-white"
                                    />
                                </td>
                                <td className="py-3 text-right pr-2 font-medium text-white">
                                    ${line.total.toFixed(2)}
                                </td>
                                <td className="py-3">
                                    <button
                                        onClick={() => removeLine(index)}
                                        className="text-slate-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-start pt-4 border-t border-slate-800">
                <button
                    onClick={addLine}
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    <Plus size={16} />
                    Add Line Item
                </button>

                <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Subtotal</span>
                        <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Tax</span>
                        <span className="text-white">${taxTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Discount</span>
                        <span className="text-white">-${discountTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-slate-700 pt-2 mt-2">
                        <span className="text-white">Total</span>
                        <span className="text-blue-500">${grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceLineItems;
