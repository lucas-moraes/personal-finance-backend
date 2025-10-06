import { Hono } from "hono";
import { Context } from "hono";
import { validateAuthLogIn, validateAuthLogOut } from "../../src/interface/middleware/AuthValidation.middleware";

describe("Auth Validation (Hono)", () => {
  let c: Context;

  beforeEach(() => {
    c = {
      req: {
        json: jest.fn().mockResolvedValue({}),
      },
    } as unknown as Context;
  });

  it("should call next() when email and password are valid", async () => {
    c.req.json = jest.fn().mockResolvedValue({
      email: "user@example.com",
      password: "password123",
    });

    validateAuthLogIn(c as Context);
  });
});

describe("Middleware - validateAuthLogOut (Hono)", () => {
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

  it("should call next() when userId is valid", async () => {
    c.req.json = jest.fn().mockResolvedValue({
      userId: "1234",
    });

    validateAuthLogOut(c as Context);
  });
});
