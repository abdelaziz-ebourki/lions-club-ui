import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MemberFormFields } from "@/components/shared/MemberFormFields";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { useMemberForm } from "@/hooks/useMemberForm";

export function MemberFormPage() {
  const { t } = useTranslation("admin");
  const { form, mutation, onSubmit, showSuccess, nameCount, roleCount, bioCount, isEditing, member } = useMemberForm();

  const formLabel = isEditing ? (member ? `Edit ${member.name}` : t("members.form.editMemberBreadcrumb")) : t("members.form.newMemberBreadcrumb");

  return (
    <div>
      <Breadcrumbs trail={[
        { label: t("members.breadcrumbs.home"), href: "/" },
        { label: t("members.breadcrumbs.admin"), href: "/admin" },
        { label: t("members.breadcrumbs.members"), href: "/admin/members" },
        { label: formLabel },
      ]} />
      <Link to="/admin/members">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> {t("members.form.backToMembers")}
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">
          {isEditing ? t("members.form.overlineEdit") : t("members.form.overlineNew")} {t("members.form.overlineSuffix")}
        </p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          {isEditing ? t("members.form.headingEdit") : t("members.form.headingCreate")}
        </h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <MemberFormFields
            form={form}
            nameCount={nameCount}
            roleCount={roleCount}
            bioCount={bioCount}
            showSuccess={showSuccess}
            mutationPending={mutation.isPending}
          />
          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? (
              <><Spinner className="mr-2" /> {t("members.form.buttons.saving")}</>
            ) : isEditing ? t("members.form.buttons.update") : t("members.form.buttons.create")}
          </Button>
        </form>
      </div>
    </div>
  );
}
