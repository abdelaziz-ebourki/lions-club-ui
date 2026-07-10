import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardFieldsProps {
  overline: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCardFields({ overline, title, description, children }: AuthCardFieldsProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
      <Card className="w-full">
        <CardHeader className="text-center">
          <p className="font-display text-overline text-accent mb-1">{overline}</p>
          <CardTitle className="font-heading text-h3">{title}</CardTitle>
          <CardDescription className="text-body-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
