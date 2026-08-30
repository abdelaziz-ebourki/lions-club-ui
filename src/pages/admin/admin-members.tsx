import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { AdminTable } from "@/components/shared/AdminTable";

export function AdminMembersPage() {
  const { t } = useTranslation("admin");
  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["members", "admin"],
    queryFn: () => api.get("/members"),
  });

  const headers = (
    <>
      <TableHead className="font-display text-overline text-xs">{t("members.headers.name")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("members.headers.role")}</TableHead>
      <TableHead className="font-display text-overline text-xs text-right">{t("members.headers.actions")}</TableHead>
    </>
  );

  if (isLoading) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("members.breadcrumbs.home"), href: "/" }, { label: t("members.breadcrumbs.admin"), href: "/admin" }, { label: t("members.breadcrumbs.members") }]} />
        <AdminPageHeader overline={t("members.overline")} heading={t("members.heading")} />
        <AdminTable headers={headers} caption={t("members.caption")} loading skeletonColumns={3} />
      </div>
    );
  }

  if (members?.length === 0) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("members.breadcrumbs.home"), href: "/" }, { label: t("members.breadcrumbs.admin"), href: "/admin" }, { label: t("members.breadcrumbs.members") }]} />
        <AdminPageHeader overline={t("members.overline")} heading={t("members.heading")} action={{ to: "/admin/members/new", label: t("members.addMember") }} />
        <EmptyState
          icon={Users}
          title={t("members.empty.title")}
          description={t("members.empty.description")}
          action={
            <Link to="/admin/members/new">
              <Button>{t("members.empty.action")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs trail={[{ label: t("members.breadcrumbs.home"), href: "/" }, { label: t("members.breadcrumbs.admin"), href: "/admin" }, { label: t("members.breadcrumbs.members") }]} />
      <AdminPageHeader overline={t("members.overline")} heading={t("members.heading")} action={{ to: "/admin/members/new", label: t("members.addMember") }} />
      <AdminTable
        headers={headers} caption={t("members.caption")}
        mobileView={members?.map((member) => (
          <Card key={member.id} className="mb-3">
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <p className="font-body font-medium">{member.name}</p>
                <Badge variant="accent" className="text-[10px]">{member.role}</Badge>
              </div>
              <Link to={`/admin/members/${member.id}/edit`}>
                <Button variant="ghost" size="icon" className="size-8">
                  <Pencil className="size-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      >
        {members?.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-body font-medium">{member.name}</TableCell>
            <TableCell>
              <Badge variant="accent" className="text-[10px]">{member.role}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Link to={`/admin/members/${member.id}/edit`}>
                <Button variant="ghost" size="icon" className="size-8">
                  <Pencil className="size-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </AdminTable>
    </div>
  );
}
