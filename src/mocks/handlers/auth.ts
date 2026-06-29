import { http, HttpResponse } from "msw";

// Seeded user store for mock authentication
// In production, this would be a database with hashed passwords
const seededUsers = [
  {
    id: "admin-1",
    name: "Ahmed Benali",
    email: "admin@lionsclub.com",
    password: "admin123", // plain text for mock only
    role: "admin" as const,
  },
  {
    id: "user-1",
    name: "Fatima Zahra El Amrani",
    email: "fatima@lionsclub.com",
    password: "member123",
    role: "member" as const,
  },
  {
    id: "user-2",
    name: "Youssef Idrissi",
    email: "youssef@lionsclub.com",
    password: "member123",
    role: "member" as const,
  },
];

// Cookie options for httpOnly cookie
const cookieOptions = {
  httpOnly: true,
  secure: false, // true in production with HTTPS
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

function buildCookieString(options: typeof cookieOptions): string {
  return Object.entries(options)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

function setAuthCookie(userId: string) {
  return HttpResponse.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": `auth_token=${userId}; ${buildCookieString(cookieOptions)}`,
      },
    }
  );
}

function clearAuthCookie() {
  return HttpResponse.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": `auth_token=; ${buildCookieString(cookieOptions)}; Max-Age=0`,
      },
    }
  );
}

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as Record<
      string,
      string
    >;

    // Find user by email
    const user = seededUsers.find((u) => u.email === email);

    // Generic error for both non-existent user and wrong password
    // Prevents user enumeration attacks
    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: "Email or password is wrong" },
        { status: 401 }
      );
    }

    // Success - set auth cookie and return user data
    return setAuthCookie(user.id);
  }),
  http.post("/api/auth/register", async ({ request }) => {
    const { name, email } = (await request.json()) as Record<
      string,
      string
    >;

    // Check if user already exists
    const existingUser = seededUsers.find((u) => u.email === email);
    if (existingUser) {
      return HttpResponse.json(
        { message: "Email or password is wrong" }, // Same generic message
        { status: 401 }
      );
    }

    // In a real app, you'd hash the password and save to DB
    // For mock, we just return success
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "member" as const,
    };

    return setAuthCookie(newUser.id);
  }),

  http.get("/api/auth/me", async ({ cookies }) => {
    const authToken = (cookies as Record<string, string>)["auth_token"];
    if (!authToken) {
      return HttpResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user = seededUsers.find((u) => u.id === authToken);
    if (!user) {
      return HttpResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    return HttpResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }),

  http.post("/api/auth/logout", () => {
    return clearAuthCookie();
  }),
];