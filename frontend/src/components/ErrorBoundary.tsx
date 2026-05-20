import { Component, ErrorInfo, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-midnight px-6 text-center text-slate-300">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Something went wrong</p>
          <h1 className="text-2xl font-semibold text-white">We hit an unexpected error</h1>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/dashboard';
            }}
            className="rounded-3xl bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-200"
          >
            Return to dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
