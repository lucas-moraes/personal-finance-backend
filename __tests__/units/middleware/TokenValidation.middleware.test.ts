import { Context, Next } from "hono";
import { tokenValidation } from "../../../src/presentation/middleware/TokenValidation.middleware";
import { supabase } from "../../../src/infrastructure/database/SupabaseClient";

jest.mock("../../../src/infrastructure/database/SupabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe("TokenValidation Middleware", () => {
  let c: Context;
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
    c = {
      req: {
        header: jest.fn(),
      },
    } as unknown as Context;
  });

  describe("Happy Path", () => {
    it("should call next() when token is valid", async () => {
      c.req.header = jest.fn().mockReturnValue({
        authorization: "Bearer valid_token_12345",
      });
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: "123" } },
        error: null,
      });

      await tokenValidation(c, next);

      expect(supabase.auth.getUser).toHaveBeenCalledWith("valid_token_12345");
      expect(next).toHaveBeenCalled();
    });

    it("should accept different token formats", async () => {
      c.req.header = jest.fn().mockReturnValue({
        authorization: "Bearer abc123xyz",
      });
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: "456" } },
        error: null,
      });

      await tokenValidation(c, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("Sad Path", () => {
    it("should throw error when token is missing", async () => {
      c.req.header = jest.fn().mockReturnValue({});

      await expect(tokenValidation(c, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw error when authorization header is missing", async () => {
      c.req.header = jest.fn().mockReturnValue({ "content-type": "application/json" });

      await expect(tokenValidation(c, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw error when token is invalid", async () => {
      c.req.header = jest.fn().mockReturnValue({
        authorization: "Bearer invalid_token",
      });
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Invalid token" },
      });

      await expect(tokenValidation(c, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw error when token is expired", async () => {
      c.req.header = jest.fn().mockReturnValue({
        authorization: "Bearer expired_token",
      });
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Token expired" },
      });

      await expect(tokenValidation(c, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
