import { Hono } from "hono";
import { logIn, logOut } from "../../src/presentation/auth/index.auth";
import { supabase } from "../../src/infrastructure/database/SupabaseClient";

jest.mock("../../src/infrastructure/database/SupabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

const createApp = () => {
  const app = new Hono();
  app.post("/login", logIn);
  app.post("/logout", logOut);
  return app;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth Routes", () => {
  describe("logIn - Happy Path", () => {
    it("should return 200 and a token when credentials are valid", async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: { access_token: "valid_token" } },
        error: null,
      });

      const res = await createApp().request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "teste@teste.com", password: "123456" }),
      });

      expect(res.status).toBe(200);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "teste@teste.com",
        password: "123456",
      });
      const json = await res.json();
      expect(json).toHaveProperty("token", "valid_token");
    });
  });

  describe("logIn - Sad Path", () => {
    it("should return 400 when credentials are invalid", async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: { message: "Invalid credentials" },
      });

      const res = await createApp().request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "invalid@test.com", password: "wrong" }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("logOut - Happy Path", () => {
    it("should return 200 when logout is successful", async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const res = await createApp().request("/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toHaveProperty("message");
    });
  });

  describe("logOut - Sad Path", () => {
    it("should return 400 when logout fails", async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: "Logout failed" },
      });

      const res = await createApp().request("/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      expect(res.status).toBe(400);
    });
  });
});

