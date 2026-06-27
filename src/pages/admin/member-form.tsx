import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

interface MemberFormProps {
  member: Member | null;
  onSuccess: () => void;
}

export function MemberForm({ member, onSuccess }: MemberFormProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: member?.name ?? "",
    role: member?.role ?? "",
    bio: member?.bio ?? "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      member
        ? api.put(`/members/${member.id}`, form)
        : api.post("/members", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(member ? "Member updated" : "Member created");
      onSuccess();
    },
    onError: () => toast.error("Failed to save member"),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            autoComplete="name"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <Input
            id="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            autoComplete="off"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Input
            id="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            autoComplete="off"
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Saving..." : member ? "Update Member" : "Create Member"}
      </Button>
    </form>
  );
}