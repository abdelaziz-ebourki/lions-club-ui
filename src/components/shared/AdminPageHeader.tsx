import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AdminPageHeaderProps {
  overline: string;
  heading: string;
  action?: {
    to: string;
    label: string;
  };
}

export function AdminPageHeader({ overline, heading, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <p className="font-display text-overline text-accent">{overline}</p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">{heading}</h1>
      </div>
      {action && (
        <Link to={action.to}>
          <Button>
            <Plus data-icon="inline-start" /> {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
