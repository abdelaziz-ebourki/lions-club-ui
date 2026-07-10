import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  heading: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ heading, message, onRetry, retryLabel = "Try Again" }: ErrorStateProps) {
  return (
    <div className="py-16 text-center">
      <h2 className="font-heading text-h4 text-destructive">{heading}</h2>
      <p className="mt-2 text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-6">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
