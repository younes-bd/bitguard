import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillingCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
                <XCircle className="text-rose-500 w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider mb-2">Payment Cancelled</h1>
            <p className="text-slate-400 text-center max-w-md mb-8">
                Your payment process was cancelled or interrupted. No charges have been made.
            </p>
            <button 
                onClick={() => navigate('/admin/billing/plans')}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-all">
                <ArrowLeft size={18} /> Try Again
            </button>
        </div>
    );
};

export default BillingCancel;
