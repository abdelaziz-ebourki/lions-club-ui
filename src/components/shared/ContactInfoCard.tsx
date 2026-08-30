import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config";
import { useTranslation } from "react-i18next";

export function ContactInfoCard() {
  const { t } = useTranslation("contact");
  return (
    <Card>
      <CardHeader>
        <p className="font-display text-overline text-accent mb-1">
          {t("infoOverline")}
        </p>
        <CardTitle className="font-heading text-h4">
          {t("infoTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-body-sm">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-medium font-body">{t("infoEmailLabel")}</p>
            <p className="text-muted-foreground">
              {siteConfig.email}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-medium font-body">{t("infoPhoneLabel")}</p>
            <p className="text-muted-foreground">
              {siteConfig.phone}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-medium font-body">{t("infoAddressLabel")}</p>
            <p className="text-muted-foreground">
              {siteConfig.address}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
