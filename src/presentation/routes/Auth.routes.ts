import { logIn, logOut } from "../auth/index.auth";
import { Hono } from "hono";
import { validateAuthLogIn } from "../middleware/AuthValidation.middleware";

const router = new Hono().basePath("/api");

router.post("/auth/login", validateAuthLogIn, async (c) => {
  return await logIn(c);
});

router.post("/auth/logout", async (c) => {
  return await logOut(c);
});

export { router as authRoutes };
