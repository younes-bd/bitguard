import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                    <AlertTriangle size={64} className="text-rose-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-slate-400 max-w-md">An unexpected error occurred in this component. Please try refreshing the page.</p>
                </div>
            );
        }
        return this.props.children;
    }
}
