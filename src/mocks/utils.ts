export async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const obj: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      obj[key] = value instanceof File ? value.name : value;
    }
    return obj;
  }
  return (await request.json()) as Record<string, unknown>;
}

export function realisticDelayMs(): number {
  return 250 + Math.random() * 450;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRealisticDelay(): Promise<void> {
  // Skip artificial delay in unit tests (vitest sets MODE=test); keep it in dev/preview and prod prototype builds.
  if (import.meta.env.MODE === "test") return;
  await delay(realisticDelayMs());
}
