import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{ padding: '2rem', backgroundColor: '#fef2f2', color: '#991b1b', height: '100vh', fontFamily: 'monospace' }}>
                    <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
                    <details open style={{ whiteSpace: 'pre-wrap', backgroundColor: '#fff', padding: '1rem', border: '1px solid #fecaca', borderRadius: '0.5rem' }}>
                        <summary style={{ cursor: 'pointer', marginBottom: '1rem', fontWeight: 'bold' }}>Click to hide details</summary>
                        <strong style={{ display: 'block', marginBottom: '1rem', color: '#7f1d1d' }}>{this.state.error && this.state.error.toString()}</strong>
                        <div style={{ fontSize: '0.875rem', color: '#450a0a' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </div>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
