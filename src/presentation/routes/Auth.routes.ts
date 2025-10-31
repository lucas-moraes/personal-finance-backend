import { logIn, logOut } from "../auth/index.auth";
import { Hono } from "hono";

const router = new Hono().basePath("/api");

router.post("/auth/login", async (c) => {
  return await logIn(c);
});

router.post("/auth/logout", async (c) => {
  return await logOut(c);
});

export { router as authRoutes };
