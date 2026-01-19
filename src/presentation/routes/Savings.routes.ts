import { Hono } from "hono";
import { tokenValidation } from "../middleware/TokenValidation.middleware";
import { cors } from "hono/cors";
import { SavingsController } from "../controllers/Savings.controller";

const savingsController = new SavingsController();
const router = new Hono().basePath("/api");

router.use("/api/*", cors());

router.get("/savings/get", tokenValidation, async (c) => {
  return savingsController.getSavings(c);
});

router.patch("/savings/clear", tokenValidation, async (c) => {
  return savingsController.clearSavings(c);
});

router.patch("/savings/upinsert", tokenValidation, async (c) => {
  return savingsController.updateSavings(c);
});

export { router as savingsRoutes };
