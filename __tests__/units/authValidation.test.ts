import { Context } from "hono";
import { validateAuthLogIn } from "../../src/presentation/middleware/AuthValidation.middleware";

describe("Auth Validation Middleware", () => {
  let c: Context;
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
    c = {
      req: {
        json: jest.fn().mockResolvedValue({}),
      },
    } as unknown as Context;
  });

  describe("validateAuthLogIn - Happy Path", () => {
    it("should call next() when email and password are valid", async () => {
      c.req.json = jest.fn().mockResolvedValue({
        email: "user@example.com",
        password: "password123",
      });

      await validateAuthLogIn(c as Context, next);

      expect(next).toHaveBeenCalled();
    });

    it("should accept valid email formats", async () => {
      c.req.json = jest.fn().mockResolvedValue({
        email: "valid.email+tag@example.co.uk",
        password: "securepass123",
      });

      await validateAuthLogIn(c as Context, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("validateAuthLogIn - Sad Path", () => {
    it("should throw error when email is missing", async () => {
      c.req.json = jest.fn().mockResolvedValue({
        password: "password123",
      });

      await expect(validateAuthLogIn(c as Context, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw error when password is missing", async () => {
      c.req.json = jest.fn().mockResolvedValue({
        email: "user@example.com",
      });

      await expect(validateAuthLogIn(c as Context, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw error when body is empty", async () => {
      c.req.json = jest.fn().mockResolvedValue({});

      await expect(validateAuthLogIn(c as Context, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw error when body is null", async () => {
      c.req.json = jest.fn().mockResolvedValue(null);

      await expect(validateAuthLogIn(c as Context, next)).rejects.toThrow();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
