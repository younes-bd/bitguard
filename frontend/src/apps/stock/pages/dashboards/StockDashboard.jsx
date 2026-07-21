import React from 'react';
import { Settings, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OperationCard = ({ title, type, toProcess, late, path }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-900/40 backdrop-blur-md rounded-xl shadow-sm border border-slate-700/50 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-slate-600/50">
            <div className="p-4 border-b border-slate-800/60 flex justify-between items-start">
                <div 
                    className="cursor-pointer group"
                    onClick={() => navigate(path)}
                >
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{type}</p>
                </div>
                <button className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-800 transition-colors">
                    <MoreVertical size={18} />
                </button>
            </div>
            
            <div className="p-4 flex gap-4">
                <div 
                    className="flex-1 cursor-pointer bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg transition-colors border border-slate-700/50 group"
                    onClick={() => navigate(path)}
                >
                    <div className="text-2xl font-bold text-blue-400 group-hover:text-blue-300">{toProcess}</div>
                    <div className="text-sm text-slate-400 font-medium">To Process</div>
                </div>
                
                {late > 0 && (
                    <div 
                        className="flex-1 cursor-pointer bg-rose-500/10 hover:bg-rose-500/20 p-3 rounded-lg transition-colors border border-rose-500/20 group"
                        onClick={() => navigate(path)}
                    >
                        <div className="text-2xl font-bold text-rose-400 group-hover:text-rose-300">{late}</div>
                        <div className="text-sm text-rose-400/80 font-medium">Late</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function StockDashboard() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Inventory Overview</h1>
                    <p className="text-slate-400 mt-1">Manage operations and warehouse transfers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <OperationCard 
                    title="Receipts" 
                    type="YourCompany: Receipts"
                    toProcess={3} 
                    late={0}
                    path="/admin/stock/receipts"
                />
                
                <OperationCard 
                    title="Internal Transfers" 
                    type="YourCompany: Internal Transfers"
                    toProcess={1} 
                    late={0}
                    path="/admin/stock/transfers"
                />
                
                <OperationCard 
                    title="Delivery Orders" 
                    type="YourCompany: Delivery Orders"
                    toProcess={5} 
                    late={2}
                    path="/admin/stock/deliveries"
                />

                <OperationCard 
                    title="Manufacturing" 
                    type="YourCompany: Manufacturing"
                    toProcess={2} 
                    late={0}
                    path="/admin/mrp"
                />
                
                <OperationCard 
                    title="Returns" 
                    type="YourCompany: Returns"
                    toProcess={0} 
                    late={0}
                    path="/admin/stock/receipts"
                />
            </div>
        </div>
    );
}
