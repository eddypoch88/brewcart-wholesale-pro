import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-10 h-10 text-red-600" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-slate-900 text-center mb-4">
                            Oops! Something went wrong
                        </h1>

                        {/* Description */}
                        <p className="text-slate-600 text-center mb-8">
                            We encountered an unexpected error. Don't worry, your data is safe.
                            Try reloading the page or return to the dashboard.
                        </p>

                        {/* Error Details (Development Only) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-8 bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-auto max-h-64">
                                <h3 className="font-bold text-sm text-slate-700 mb-2">Error Details:</h3>
                                <pre className="text-xs text-red-600 font-mono whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                </pre>
                                {this.state.errorInfo && (
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900">
                                            Stack Trace
                                        </summary>
                                        <pre className="text-xs text-slate-500 mt-2 font-mono whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                            >
                                <RefreshCw size={18} />
                                Reload Page
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                            >
                                <Home size={18} />
                                Go to Dashboard
                            </button>
                        </div>

                        {/* Support Message */}
                        <p className="text-center text-sm text-slate-500 mt-8">
                            If this problem persists, please contact support with the error details above.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
