import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
    };
  }

  public static getDerivedStateFromError(_: Error): State {
    return {
      hasError: true,
      errorId: 'ERR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Safely log error without leaking sensitive credentials or payload data
    console.error('[UPI-Shield ErrorBoundary Caught Exception]', {
      name: error?.name,
      message: error?.message,
      componentStack: errorInfo?.componentStack?.slice(0, 300),
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, errorId: '' });
    window.location.hash = '#/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-[#F8FAFC] text-[#0B1F33] flex items-center justify-center p-4 font-sans"
        >
          <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertOctagon className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                Application Error (500)
              </span>
              <h1 className="text-xl font-bold text-[#0B1F33] tracking-tight">
                An unexpected interface issue occurred
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed">
                The application encountered an unexpected client-side state error. No input or payment data was transmitted or compromised.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Incident Reference:</span>
              <span className="font-semibold text-slate-700">{this.state.errorId}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:flex-1 h-10 px-4 rounded-lg text-xs font-semibold text-white bg-[#0B1F33] hover:bg-slate-800 transition-colors shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:flex-1 h-10 px-4 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
