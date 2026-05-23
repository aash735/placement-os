"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in development; replace with error reporting service in production
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="max-w-md w-full rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-4">
              <AlertTriangle className="h-6 w-6 text-rose-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Something went wrong</h3>
            <p className="text-xs text-zinc-500 mb-4">
              {this.state.error?.message ?? "An unexpected error occurred in this section."}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold hover:bg-rose-500/20 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
