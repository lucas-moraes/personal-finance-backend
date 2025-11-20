import { Context, Next } from "hono";
import { loggedInUser } from "../../../src/presentation/auth/index.auth";
import { supabase } from "../../../src/infrastructure/database/SupabaseClient";

jest.mock("../../../src/infrastructure/database/SupabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe("LoggedInUser Middleware", () => {
  let c: Context;
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
    c = {
      set: jest.fn(),
    } as unknown as Context;
  });

  describe("Happy Path", () => {
    it("should call next() when user is authenticated", async () => {
      const mockUser = { id: "123", email: "user@example.com" };
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      await loggedInUser(c, next);

      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(c.set).toHaveBeenCalledWith("user", mockUser);
      expect(next).toHaveBeenCalled();
    });

    it("should set user in context when authentication succeeds", async () => {
      const mockUser = { id: "456", email: "another@example.com", name: "Test User" };
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      await loggedInUser(c, next);

      expect(c.set).toHaveBeenCalledWith("user", mockUser);
    });
  });

  describe("Sad Path", () => {
    it("should throw error when user is not authenticated", async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: "Not authenticated" },
      });

      await expect(loggedInUser(c, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw error when user data is missing", async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(loggedInUser(c, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw error when authentication service fails", async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Service unavailable" },
      });

      await expect(loggedInUser(c, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
