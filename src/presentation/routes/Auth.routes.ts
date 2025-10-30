import { logIn, logOut } from "../auth/index.auth";
import { Hono } from "hono";
import { validateAuthLogIn } from "../middleware/AuthValidation.middleware";
import { cors } from "hono/cors";

const router = new Hono().basePath("/api");

router.use("/api/*", cors());

router.post("/auth/login", async (c, next) => {
  await validateAuthLogIn(c, next);
  return await logIn(c);
});

router.post("/auth/logout", async (c) => {
  return await logOut(c);
});

export { router as authRoutes };
