import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MemberFormFields } from "@/components/shared/MemberFormFields";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { useMemberForm } from "@/hooks/useMemberForm";

export function MemberFormPage() {
  const { form, mutation, onSubmit, showSuccess, nameCount, roleCount, bioCount, isEditing, member } = useMemberForm();

  const formLabel = isEditing ? (member ? `Edit ${member.name}` : "Edit Member") : "New Member";

  return (
    <div>
      <Breadcrumbs trail={[
        { label: "Home", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Members", href: "/admin/members" },
        { label: formLabel },
      ]} />
      <Link to="/admin/members">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> Back to Members
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">
          {isEditing ? "Edit" : "New"} Member
        </p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          {isEditing ? "Edit Member" : "Add Member"}
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
              <><Spinner className="mr-2" /> Saving...</>
            ) : isEditing ? "Update Member" : "Add Member"}
          </Button>
        </form>
      </div>
    </div>
  );
}
