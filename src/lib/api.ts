// fallow-ignore-file security-sink
import { appConfig } from "@/config";
import { AuthError } from "@/types";

type RequestOptions = RequestInit & { skipAuthExpired?: boolean };

async function readErrorMessage(res: Response): Promise<string | undefined> {
  const body = await res.json().catch(() => null) as { message?: unknown; error?: unknown } | null;
  const message = body?.message ?? body?.error;
  return typeof message === "string" && message.length > 0 ? message : undefined;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const { skipAuthExpired, ...fetchOptions } = options ?? {};
  const res = await fetch(`${appConfig.apiBaseUrl}${endpoint}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...fetchOptions?.headers },
    ...fetchOptions,
  });
  if (!res.ok) {
    if (res.status === 401) {
      if (!skipAuthExpired) window.dispatchEvent(new CustomEvent("auth:expired"));
      throw new AuthError(await readErrorMessage(res));
    }
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(error.message ?? error.error ?? "Request failed", res.status);
  }
  return res.json();
}

async function uploadRequest<T>(
  endpoint: string,
  formData: FormData,
  method?: string
// fallow-ignore-next-line code-duplication
): Promise<T> {
  const res = await fetch(`${appConfig.apiBaseUrl}${endpoint}`, {
    method: method ?? "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:expired"));
      throw new AuthError(await readErrorMessage(res));
    }
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(error.message ?? error.error ?? "Request failed", res.status);
  }
  return res.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, options),
  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body), ...options }),
  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body), ...options }),
  patch: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body), ...options }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
  upload: <T>(endpoint: string, formData: FormData, method?: string) =>
    uploadRequest<T>(endpoint, formData, method),
};
