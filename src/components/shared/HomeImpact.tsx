const impact = [
  { value: "12", label: "vision screenings last quarter" },
  { value: "28", label: "youth mentored this year" },
  { value: "8", label: "neighborhood clean-ups in 2024" },
  { value: "4", label: "community partners active now" },
];

export function HomeImpact() {
  return (
    <section className="border-y bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-display text-overline text-accent text-center mb-10">
          What We've Done Together
        </p>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {impact.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-4xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="mt-2 text-body-sm text-muted-foreground max-w-28 mx-auto">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
