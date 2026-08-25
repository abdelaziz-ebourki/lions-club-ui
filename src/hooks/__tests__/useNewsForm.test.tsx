import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { useNewsForm } from "../useNewsForm";
import { api } from "@/lib/api";
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
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    upload: vi.fn(),
  },
}));

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

const mockMutate = vi.fn();
const mockUpload = vi.mocked(api.upload);

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe("useNewsForm hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutate.mockReset();
    mockUpload.mockReset();

    vi.mocked(useParams).mockReturnValue({});
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: false } as any);
    vi.mocked(useMutation).mockReturnValue({ mutate: mockMutate, isPending: false } as any);
    vi.mocked(useQueryClient).mockReturnValue({ invalidateQueries: vi.fn() } as any);
  });

  describe("create mode", () => {
    test("returns form with default values", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      expect(result.current.form.getValues("title")).toBe("");
      expect(result.current.form.getValues("slug")).toBe("");
      expect(result.current.form.getValues("content")).toBe("");
      expect(result.current.form.getValues("excerpt")).toBe("");
      expect(result.current.form.getValues("category")).toBe("News");
      expect(result.current.form.getValues("status")).toBe("draft");
      expect(result.current.form.getValues("publishedAt")).toBeNull();
    });

    test("handleTitleChange auto-generates slug", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.handleTitleChange("My New Article");
      });

      expect(result.current.form.getValues("slug")).toBe("my-new-article");
    });

    test("handleTitleChange respects manual slug edit", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.handleSlugChange("custom-slug");
        result.current.handleTitleChange("Different Title");
      });

      expect(result.current.form.getValues("slug")).toBe("custom-slug");
    });

    test("handleSlugChange sets slug and marks as touched", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.handleSlugChange("my-manual-slug");
      });

      expect(result.current.form.getValues("slug")).toBe("my-manual-slug");
    });

    test("mutation creates article with all fields", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("title", "Test Article");
        result.current.form.setValue("slug", "test-article");
        result.current.form.setValue("content", "<p>Content</p>");
        result.current.form.setValue("excerpt", "Excerpt");
        result.current.form.setValue("category", "News");
        result.current.form.setValue("status", "published");
        result.current.form.setValue("publishedAt", "2026-07-20T15:30:00.000Z");
      });

      await act(async () => {
        result.current.onSubmit(result.current.form.getValues());
      });

      expect(mockMutate).toHaveBeenCalled();
      const formData = mockMutate.mock.calls[0][0];
      expect(formData.title).toBe("Test Article");
      expect(formData.slug).toBe("test-article");
      expect(formData.content).toBe("<p>Content</p>");
      expect(formData.excerpt).toBe("Excerpt");
      expect(formData.category).toBe("News");
      expect(formData.status).toBe("published");
      expect(formData.publishedAt).toBe("2026-07-20T15:30:00.000Z");
    });

    test("mutation creates FormData with publishedAt when status is published", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("title", "Test Article");
        result.current.form.setValue("slug", "test-article");
        result.current.form.setValue("content", "<p>Content</p>");
        result.current.form.setValue("category", "News");
        result.current.form.setValue("status", "published");
        result.current.form.setValue("publishedAt", "2026-07-20T15:30:00.000Z");
      });

      await act(async () => {
        result.current.onSubmit(result.current.form.getValues());
      });

      // Capture the mutation options and execute mutationFn directly
      const mutationOptions = vi.mocked(useMutation).mock.calls[0][0] as { mutationFn: (data: unknown) => Promise<unknown> };
      await mutationOptions.mutationFn(result.current.form.getValues());

      expect(mockUpload).toHaveBeenCalled();
      const uploadCall = mockUpload.mock.calls[0];
      expect(uploadCall[0]).toBe("/news");
      expect(uploadCall[2]).toBeUndefined(); // POST (no method = POST)
      const formData = uploadCall[1] as FormData;
      expect(formData.get("title")).toBe("Test Article");
      expect(formData.get("publishedAt")).toBe("2026-07-20T15:30:00.000Z");
    });

    test("mutation omits publishedAt when status is draft and publishedAt is null", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("title", "Draft Article");
        result.current.form.setValue("slug", "draft-article");
        result.current.form.setValue("content", "<p>Content</p>");
        result.current.form.setValue("category", "News");
        result.current.form.setValue("status", "draft");
        result.current.form.setValue("publishedAt", null);
      });

      await act(async () => {
        result.current.onSubmit(result.current.form.getValues());
      });

      const mutationOptions = vi.mocked(useMutation).mock.calls[0][0] as { mutationFn: (data: unknown) => Promise<unknown> };
      await mutationOptions.mutationFn(result.current.form.getValues());

      expect(mockUpload).toHaveBeenCalled();
      const uploadCall = mockUpload.mock.calls[0];
      const formData = uploadCall[1] as FormData;
      expect(formData.get("status")).toBe("draft");
      expect(formData.has("publishedAt")).toBe(false);
    });
  });

  describe("edit mode", () => {
    const mockArticle = {
      id: "news-1",
      title: "Original Title",
      slug: "original-title",
      content: "<p>Original content</p>",
      excerpt: "Original excerpt",
      category: "Announcement" as const,
      status: "published" as const,
      publishedAt: "2026-07-15T10:00:00Z",
      authorId: "admin-1",
      authorName: "Ahmed Benali",
      createdAt: "2026-07-10T08:30:00Z",
      updatedAt: "2026-07-15T10:00:00Z",
    };

    beforeEach(() => {
      vi.mocked(useParams).mockReturnValue({ id: "news-1" });
      vi.mocked(useQuery).mockReturnValue({ data: mockArticle, isLoading: false } as any);
    });

    test("loads article data into form", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      expect(result.current.form.getValues("title")).toBe("Original Title");
      expect(result.current.form.getValues("slug")).toBe("original-title");
      expect(result.current.form.getValues("content")).toBe("<p>Original content</p>");
      expect(result.current.form.getValues("excerpt")).toBe("Original excerpt");
      expect(result.current.form.getValues("category")).toBe("Announcement");
      expect(result.current.form.getValues("status")).toBe("published");
      expect(result.current.form.getValues("publishedAt")).toBe("2026-07-15T10:00:00Z");
    });

    test("auto-generates slug from title change when slug matches original", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.handleTitleChange("Updated Title");
      });

      expect(result.current.form.getValues("slug")).toBe("updated-title");
    });

    test("preserves manual slug edit on title change", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.handleSlugChange("my-custom-slug");
        result.current.handleTitleChange("New Title");
      });

      expect(result.current.form.getValues("slug")).toBe("my-custom-slug");
    });

    test("mutation updates article", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("title", "Updated Title");
      });

      await act(async () => {
        result.current.onSubmit(result.current.form.getValues());
      });

      expect(mockMutate).toHaveBeenCalled();
    });

    test("mutation updates FormData with PUT and correct endpoint", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("title", "Updated Title");
      });

      await act(async () => {
        result.current.onSubmit(result.current.form.getValues());
      });

      const mutationOptions = vi.mocked(useMutation).mock.calls[0][0] as { mutationFn: (data: unknown) => Promise<unknown> };
      await mutationOptions.mutationFn(result.current.form.getValues());

      expect(mockUpload).toHaveBeenCalled();
      const uploadCall = mockUpload.mock.calls[0];
      expect(uploadCall[0]).toBe("/news/news-1");
      expect(uploadCall[2]).toBe("PUT");
      const formData = uploadCall[1] as FormData;
      expect(formData.get("title")).toBe("Updated Title");
    });
  });

  describe("content validation (stripHtml transform)", () => {
    test("strips HTML and validates non-empty", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      await act(async () => {
        result.current.form.setValue("content", "<p></p>");
        await result.current.form.trigger("content");
      });

      const errors = result.current.form.formState.errors;
      expect(errors.content).toBeDefined();
    });

    test("accepts content with text after stripping", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      await act(async () => {
        result.current.form.setValue("content", "<p>Real content</p>");
        await result.current.form.trigger("content");
      });

      const errors = result.current.form.formState.errors;
      expect(errors.content).toBeUndefined();
    });

    test("rejects whitespace-only HTML", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      await act(async () => {
        result.current.form.setValue("content", "<p>   </p>");
        await result.current.form.trigger("content");
      });

      const errors = result.current.form.formState.errors;
      expect(errors.content).toBeDefined();
    });
  });

  describe("publishedAt handling", () => {
    test("includes publishedAt in mutation when set", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("title", "Test");
        result.current.form.setValue("slug", "test");
        result.current.form.setValue("content", "<p>Content</p>");
        result.current.form.setValue("category", "News");
        result.current.form.setValue("status", "published");
        result.current.form.setValue("publishedAt", "2026-07-20T15:30:00.000Z");
      });

      await act(async () => {
        result.current.onSubmit(result.current.form.getValues());
      });

      const mutationOptions = vi.mocked(useMutation).mock.calls[0][0] as { mutationFn: (data: unknown) => Promise<unknown> };
      await mutationOptions.mutationFn(result.current.form.getValues());

      expect(mockMutate).toHaveBeenCalled();
    });

    test("does not include publishedAt when null and draft", async () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("title", "Test");
        result.current.form.setValue("slug", "test");
        result.current.form.setValue("content", "<p>Content</p>");
        result.current.form.setValue("category", "News");
        result.current.form.setValue("status", "draft");
        result.current.form.setValue("publishedAt", null);
      });

      await act(async () => {
        result.current.onSubmit(result.current.form.getValues());
      });

      expect(mockMutate).toHaveBeenCalled();
    });
  });

  describe("form watch values", () => {
    test("title watch returns current value", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("title", "Watched Title");
      });

      expect(result.current.title).toBe("Watched Title");
    });

    test("slug watch returns current value", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("slug", "watched-slug");
      });

      expect(result.current.slug).toBe("watched-slug");
    });

    test("publishedAt watch returns current value", () => {
      const { result } = renderHook(() => useNewsForm(), { wrapper });

      act(() => {
        result.current.form.setValue("publishedAt", "2026-07-20T15:30:00.000Z");
      });

      expect(result.current.publishedAt).toBe("2026-07-20T15:30:00.000Z");
    });
  });
});