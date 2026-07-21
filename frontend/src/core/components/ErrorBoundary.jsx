import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6 animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-900/20 border border-rose-500/20">
                        <ShieldAlert size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight">System Fault Detected</h2>
                        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                            The security isolation layer has intercepted a critical application error. 
                            Core systems remain stable, but the current view has been suspended.
                        </p>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 max-w-lg w-full">
                        <p className="text-[10px] font-mono text-rose-400/70 uppercase tracking-widest mb-2">Error Diagnostic Code</p>
                        <p className="text-xs font-mono text-slate-300 break-all">{this.state.error?.message || "Unknown Exception"}</p>
                    </div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all border border-slate-700"
                    >
                        <RefreshCw size={18} /> Re-initialize Subsystem
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
