import { Component, type ReactNode, type ErrorInfo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function ErrorBoundaryFallback({ resetError }: { resetError: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
      <h2 className="mt-4 font-heading text-xl font-bold">
        Something went wrong
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        An unexpected error occurred
      </p>
      <Button
        className="mt-6"
        onClick={() => {
          resetError();
          navigate("/");
        }}
      >
        Go Home
      </Button>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ErrorBoundaryFallback resetError={this.resetError} />;
    }
    return this.props.children;
  }
}