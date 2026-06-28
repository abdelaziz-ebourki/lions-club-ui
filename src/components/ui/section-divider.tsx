import { LionMark } from "@/components/ui/lion-mark";

export function SectionDivider() {
  return (
    <div className="relative my-16 flex items-center justify-center" role="separator" aria-orientation="horizontal">
      <div className="h-px flex-1 bg-border" />
      <div className="mx-4">
        <LionMark size="md" variant="outline" className="text-accent" />
      </div>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
