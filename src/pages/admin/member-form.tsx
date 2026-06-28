import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  bio: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

export function MemberFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: member } = useQuery<Member>({
    queryKey: ["member", id],
    queryFn: () => api.get(`/members/${id}`),
    enabled: isEditing,
  });

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    values: member ? {
      name: member.name,
      role: member.role,
      bio: member.bio ?? "",
    } : undefined,
    defaultValues: !isEditing ? { name: "", role: "", bio: "" } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: MemberFormData) =>
      isEditing ? api.put(`/members/${id!}`, data) : api.post("/members", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(isEditing ? "Member updated successfully." : "Member added successfully.");
      navigate("/admin/members");
    },
    onError: () => toast.error("Failed to save member."),
  });

  function onSubmit(data: MemberFormData) {
    mutation.mutate(data);
  }

  return (
    <div>
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
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldContent>
                <Input id="name" placeholder="Full name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
                <FieldError errors={[form.formState.errors.name]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.role}>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <FieldContent>
                <Input id="role" placeholder="e.g. Treasurer, Event Lead" aria-invalid={!!form.formState.errors.role} {...form.register("role")} />
                <FieldError errors={[form.formState.errors.role]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.bio}>
              <FieldLabel htmlFor="bio">Bio (optional)</FieldLabel>
              <FieldContent>
                <Textarea id="bio" placeholder="Short biography" rows={3} aria-invalid={!!form.formState.errors.bio} {...form.register("bio")} />
                <FieldError errors={[form.formState.errors.bio]} />
              </FieldContent>
            </Field>
          </FieldGroup>
          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? "Saving..." : isEditing ? "Update Member" : "Add Member"}
          </Button>
        </form>
      </div>
    </div>
  );
}
