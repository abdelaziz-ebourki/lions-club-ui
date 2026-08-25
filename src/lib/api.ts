// fallow-ignore-file security-sink
import { appConfig } from "@/config";
import { AuthError } from "@/types";

type RequestOptions = RequestInit & { skipAuthExpired?: boolean };

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
      throw new AuthError();
    }
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(error.message ?? "Request failed", res.status);
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
      throw new AuthError();
    }
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(error.message ?? "Request failed", res.status);
  }
  return res.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, options),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
  upload: <T>(endpoint: string, formData: FormData, method?: string) =>
    uploadRequest<T>(endpoint, formData, method),
};
