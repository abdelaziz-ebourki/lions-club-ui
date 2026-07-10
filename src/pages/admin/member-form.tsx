import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadConfig } from "@/config";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
  role: z.string().min(2, "Role must be at least 2 characters").max(100, "Role must be at most 100 characters"),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  avatar: z.union([z.instanceof(File), z.string()]).optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.avatar instanceof File) {
    if (!uploadConfig.acceptedTypes.includes(data.avatar.type)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a valid image file (PNG, JPG, WebP)", path: ["avatar"] });
    }
    if (data.avatar.size > uploadConfig.maxSize) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "File size must be under 5MB", path: ["avatar"] });
    }
  }
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
      avatar: member.avatar,
    } : undefined,
    defaultValues: !isEditing ? { name: "", role: "", bio: "", avatar: undefined } : undefined,
  });

  const nameCount = form.watch("name").length;
  const roleCount = form.watch("role").length;
  const bioCount = (form.watch("bio") ?? "").length;
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => void clearTimeout(successTimer.current), []);

  const mutation = useMutation({
    mutationFn: (data: MemberFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("role", data.role);
      formData.append("bio", data.bio ?? "");
      if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
      } else if (data.avatar) {
        formData.append("avatar", data.avatar);
      }
      return api.upload(
        isEditing ? `/members/${id!}` : "/members",
        formData,
        isEditing ? "PUT" : undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(isEditing ? "Member updated successfully." : "Member added successfully.");
      setShowSuccess(true);
      successTimer.current = setTimeout(() => navigate("/admin/members"), 400);
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
          <FieldGroup className={cn("transition-all duration-500", showSuccess && "ring-2 ring-green-500/50 rounded-lg")}>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldContent>
                <Input id="name" placeholder="Full name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
                <FieldError errors={[form.formState.errors.name]} />
                <span className={cn("text-body-xs", nameCount >= 100 ? "text-destructive" : nameCount >= 80 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
                  {nameCount}/100
                </span>
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.role}>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <FieldContent>
                <Input id="role" placeholder="e.g. Treasurer, Event Lead" aria-invalid={!!form.formState.errors.role} {...form.register("role")} />
                <FieldError errors={[form.formState.errors.role]} />
                <span className={cn("text-body-xs", roleCount >= 100 ? "text-destructive" : roleCount >= 80 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
                  {roleCount}/100
                </span>
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.bio}>
              <FieldLabel htmlFor="bio">Bio (optional)</FieldLabel>
              <FieldContent>
                <Textarea id="bio" placeholder="Short biography" rows={3} aria-invalid={!!form.formState.errors.bio} {...form.register("bio")} />
                <FieldError errors={[form.formState.errors.bio]} />
                <span className={cn("text-body-xs", bioCount >= 500 ? "text-destructive" : bioCount >= 400 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
                  {bioCount}/500
                </span>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
              <FieldContent>
                <Controller
                  name="avatar"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FileUpload
                      id="avatar"
                      value={field.value ?? null}
                      onChange={(file) => field.onChange(file)}
                      error={fieldState.error?.message}
                      loading={mutation.isPending}
                      variant="circle"
                    />
                  )}
                />
              </FieldContent>
            </Field>
          </FieldGroup>
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
