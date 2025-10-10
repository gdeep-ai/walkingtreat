import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
            <div className="bg-white border-l-4 border-red-500 text-red-900 p-8 rounded-lg shadow-2xl text-center max-w-md">
                <h1 className="text-2xl font-bold">Something went wrong.</h1>
                <p className="mt-2 text-red-800">We're sorry, but the application encountered an unexpected error. Please try refreshing the page.</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                    Refresh Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
