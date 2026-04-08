"use client";
import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error("[ErrorBoundary]", error, info); }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <AlertTriangle className="w-10 h-10 text-muted mb-4" />
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Something went wrong</h2>
          <p className="text-sm text-muted mb-4 max-w-md">{this.state.error?.message || "An unexpected error occurred."}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="flex items-center gap-2 bg-foreground text-background rounded-lg px-4 py-2 text-sm cursor-pointer hover:opacity-90"><RefreshCw className="w-4 h-4" />Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
