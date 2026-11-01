import { Hono } from "hono";
import { HealthController } from "../controllers/Health.controller";

const healthController = new HealthController();
const router = new Hono();

router.get("/health", async (c) => healthController.ping(c));

export { router as healthRoutes };
