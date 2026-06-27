import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

interface NewThreadFormProps {
  categoryId: string;
  author: string;
  onSuccess: () => void;
}

export function NewThreadForm({ categoryId, author, onSuccess }: NewThreadFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/forum/threads", { categoryId, author, title, content }),
    onSuccess: () => {
      toast.success("Thread created");
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["forum-threads", categoryId] });
    },
    onError: () => toast.error("Failed to create thread"),
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
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoComplete="off"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="content">Content</FieldLabel>
          <Textarea
            id="content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            autoComplete="off"
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Creating..." : "Create Thread"}
      </Button>
    </form>
  );
}