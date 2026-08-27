import { useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { useGalleryForm } from "../useGalleryForm";
import { api } from "@/lib/api";
import { galleryItems } from "@/mocks/data/gallery";
import { describe, test, vi, beforeEach, expect } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(() => ({})),
    useNavigate: vi.fn(() => vi.fn()),
  };
});

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    upload: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  };
});

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock("@/contexts/auth", () => ({
  useAuth: () => ({
    user: { name: "Admin", role: "admin" },
    isAuthenticated: true,
    isAdmin: true,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
    loading: false,
  }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null } as never);
  vi.mocked(useMutation).mockImplementation(((options: { mutationFn: (v: unknown) => Promise<unknown> }) => ({
    mutate: (v: unknown) => { void options.mutationFn(v); },
    mutateAsync: options.mutationFn,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  })) as never);
});

describe("useGalleryForm schema", () => {

  test("rejects title shorter than 3 characters", async () => {
    const { result } = renderHook(() => useGalleryForm(), { wrapper });
    const { form } = result.current;
    act(() => {
      form.setValue("title", "ab");
    });
    await act(async () => {
      await form.trigger("title");
    });
    const state = result.current.form.getFieldState("title");
    expect(state.error?.message ?? result.current.form.formState.errors.title?.message).toMatch(/at least 3 characters/i);
  });

  test("normalizes tags: trims whitespace and removes duplicates/empties", async () => {
    const { result } = renderHook(() => useGalleryForm(), { wrapper });
    const { form, onSubmit } = result.current;
    act(() => {
      form.setValue("title", "Valid Title");
      form.setValue("category", "Event");
      form.setValue("imageUrl", "/uploads/x.jpg");
      form.setValue("tags", " gala , , youth ,gala ");
    });
    await act(async () => {
      await onSubmit(form.getValues());
    });
    const createCall = vi.mocked(api.post).mock.calls[0];
    expect(createCall?.[1]).toMatchObject({ tags: ["gala", "youth"] });
  });

  test("create flow uploads file first then posts metadata", async () => {
    const file = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    vi.mocked(api.upload).mockResolvedValue({ imageUrl: "/uploads/a.jpg", thumbnailUrl: "/uploads/t.jpg" });
    const { result } = renderHook(() => useGalleryForm(), { wrapper });
    const { form, onSubmit } = result.current;
    act(() => {
      form.setValue("title", "Valid Title");
      form.setValue("category", "Team");
      form.setValue("image", file);
    });
    await act(async () => {
      await onSubmit(form.getValues());
    });
    expect(vi.mocked(api.upload)).toHaveBeenCalledWith("/gallery/upload", expect.any(FormData));
    expect(vi.mocked(api.post)).toHaveBeenCalledWith("/gallery", expect.objectContaining({ imageUrl: "/uploads/a.jpg" }));
  });

  test("edit flow patches metadata without re-uploading when image unchanged", async () => {
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: galleryItems[0].id });
    vi.mocked(useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: galleryItems[0], isLoading: false, isError: false, error: null,
    });
    const { result, rerender } = renderHook(() => useGalleryForm(), { wrapper });
    rerender();
    await act(async () => {
      result.current.form.setValue("title", "Updated Title");
      result.current.form.setValue("category", galleryItems[0].category);
      result.current.form.setValue("imageUrl", galleryItems[0].imageUrl);
      result.current.form.setValue("tags", galleryItems[0].tags.join(", "));
      await result.current.onSubmit(result.current.form.getValues());
    });
    expect(vi.mocked(api.upload)).not.toHaveBeenCalled();
    expect(vi.mocked(api.patch)).toHaveBeenCalledWith(`/gallery/${galleryItems[0].id}`, expect.objectContaining({ title: "Updated Title" }));
  });

  test("edit flow re-uploads when a new File is selected", async () => {
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: galleryItems[0].id });
    vi.mocked(useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: galleryItems[0], isLoading: false, isError: false, error: null,
    });
    const file = new File(["y"], "new.png", { type: "image/png" });
    vi.mocked(api.upload).mockResolvedValue({ imageUrl: "/uploads/new.jpg" });
    const { result } = renderHook(() => useGalleryForm(), { wrapper });
    await act(async () => {
      result.current.form.reset({
        title: galleryItems[0].title,
        description: "",
        category: galleryItems[0].category,
        eventId: "",
        tags: galleryItems[0].tags.join(", "),
        imageUrl: galleryItems[0].imageUrl,
        image: file,
      });
      await result.current.onSubmit(result.current.form.getValues());
    });
    expect(vi.mocked(api.upload)).toHaveBeenCalled();
    expect(vi.mocked(api.patch)).toHaveBeenCalled();
  });
});
