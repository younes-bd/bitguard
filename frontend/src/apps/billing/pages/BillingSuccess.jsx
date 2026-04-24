import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillingSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/admin/billing');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-emerald-500 w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider mb-2">Subscription Updated</h1>
            <p className="text-slate-400 text-center max-w-md mb-8">
                Your payment was successful and your subscription has been updated. You will be redirected to the billing dashboard shortly.
            </p>
            <button 
                onClick={() => navigate('/admin/billing')}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all">
                Go to Dashboard <ArrowRight size={18} />
            </button>
        </div>
    );
};

export default BillingSuccess;
