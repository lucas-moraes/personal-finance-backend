import { logIn, logOut } from "../auth/index.auth";
import { Hono } from "hono";
import { validateAuthLogIn } from "../middleware/AuthValidation.middleware";

const router = new Hono();

router.post("/auth/login", async (c, next) => {
  await validateAuthLogIn(c, next);
  return await logIn(c);
});

router.post("/auth/logout", async (c) => {
  return await logOut(c);
});

export { router as authRoutes };
