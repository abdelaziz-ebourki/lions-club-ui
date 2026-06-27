import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

interface EventFormProps {
  event: Event | null;
  onSuccess: () => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: event?.title ?? "",
    description: event?.description ?? "",
    date: event?.date ?? "",
    time: event?.time ?? "",
    location: event?.location ?? "",
    category: event?.category ?? "",
    status: event?.status ?? "upcoming",
  });

  const mutation = useMutation({
    mutationFn: () =>
      event
        ? api.put(`/events/${event.id}`, form)
        : api.post("/events", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(event ? "Event updated" : "Event created");
      onSuccess();
    },
    onError: () => toast.error("Failed to save event"),
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
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            autoComplete="off"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="desc">Description</FieldLabel>
          <Input
            id="desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            autoComplete="off"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="date">Date</FieldLabel>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              autoComplete="off"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="time">Time</FieldLabel>
            <Input
              id="time"
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              autoComplete="off"
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input
            id="location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            autoComplete="off"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <Input
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            autoComplete="off"
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Saving..." : event ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );
}