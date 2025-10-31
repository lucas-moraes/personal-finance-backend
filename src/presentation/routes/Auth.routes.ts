import { loggedInUser, logIn, logOut } from "../auth/index.auth";
import { Hono } from "hono";
import { validateAuthLogIn } from "../middleware/AuthValidation.middleware";

const router = new Hono().basePath("/api");

router.get("/auth/token", loggedInUser, async (c) => {
  return c.json({ message: "token is valid" });
});

router.post("/auth/login", validateAuthLogIn, async (c) => {
  return await logIn(c);
});

router.post("/auth/logout", async (c) => {
  return await logOut(c);
});

export { router as authRoutes };
