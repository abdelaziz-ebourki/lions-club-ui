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
