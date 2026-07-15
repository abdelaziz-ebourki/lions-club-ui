import { http, HttpResponse } from "msw";
import type { UserProfile, PasswordChange } from "@/types";

const userPasswords: Record<string, string> = {
  "admin-1": "admin123",
  "user-1": "member123",
  "user-2": "member123",
};

const profileData: Record<string, UserProfile> = {
  "admin-1": {
    id: "admin-1",
    name: "Ahmed Benali",
    email: "admin@lionsclub.com",
    role: "admin",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=AB",
    createdAt: "2020-06-01T09:00:00Z",
    lastLoginIp: "192.168.1.100",
    accountStatus: "active",
  },
  "user-1": {
    id: "user-1",
    name: "Fatima Zahra El Amrani",
    email: "fatima@lionsclub.com",
    role: "member",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=FZ",
    createdAt: "2021-03-15T10:00:00Z",
  },
  "user-2": {
    id: "user-2",
    name: "Youssef Idrissi",
    email: "youssef@lionsclub.com",
    role: "member",
    createdAt: "2022-01-20T08:00:00Z",
  },
};

function getProfile(authToken: string) {
  return profileData[authToken];
}

export const profileHandlers = [
  http.get("/api/user/profile", async ({ cookies }) => {
    const authToken = (cookies as Record<string, string>)["auth_token"];
    if (!authToken) {
      return HttpResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const profile = getProfile(authToken);
    if (!profile) {
      return HttpResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    return HttpResponse.json(profile);
  }),

  http.put("/api/user/profile", async ({ request, cookies }) => {
    const authToken = (cookies as Record<string, string>)["auth_token"];
    if (!authToken) {
      return HttpResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const profile = getProfile(authToken);
    if (!profile) {
      return HttpResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    const isMultipart = contentType.includes("multipart/form-data");

    if (isMultipart) {
      const formData = await request.formData();
      const name = formData.get("name") as string | null;
      const email = formData.get("email") as string | null;
      const avatarFile = formData.get("avatar") as File | null;

      if (name) profile.name = name;
      if (email) profile.email = email;
      if (avatarFile) {
        profile.avatar = URL.createObjectURL(avatarFile);
      }
    } else {
      const body = (await request.json()) as Record<string, string>;
      if (body.name) profile.name = body.name;
      if (body.email) profile.email = body.email;
    }

    return HttpResponse.json(profile);
  }),

  http.put("/api/user/password", async ({ request, cookies }) => {
    const authToken = (cookies as Record<string, string>)["auth_token"];
    if (!authToken) {
      return HttpResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { currentPassword, newPassword } = (await request.json()) as PasswordChange;

    const storedPassword = userPasswords[authToken];
    if (currentPassword !== storedPassword) {
      return HttpResponse.json({ message: "Current password is incorrect" }, { status: 401 });
    }

    userPasswords[authToken] = newPassword;

    return HttpResponse.json({ success: true });
  }),
];
