import { Hono } from "hono";
import { logIn } from "../../src/interface/auth/LogIn.auth.ts";
import { supabase } from "../../src/infrastructure/database/SupabaseClient";

jest.mock("./../../src/interface/auth/SupabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

const createApp = () => {
  const app = new Hono();
  app.post("/login", logIn);
  return app;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("logIn", () => {
  it("should return 200 and a token", async () => {
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
  });
});
