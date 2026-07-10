import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config";

export function ContactInfoCard() {
  return (
    <Card>
      <CardHeader>
        <p className="font-display text-overline text-accent mb-1">
          Contact
        </p>
        <CardTitle className="font-heading text-h4">
          How to Reach Us
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-body-sm">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-medium font-body">Email</p>
            <p className="text-muted-foreground">
              {siteConfig.email}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-medium font-body">Phone</p>
            <p className="text-muted-foreground">
              {siteConfig.phone}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-medium font-body">Address</p>
            <p className="text-muted-foreground">
              {siteConfig.address}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
