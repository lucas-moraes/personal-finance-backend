import { Hono } from "hono";
import { CategoryController } from "../controllers/Category.controller";
import { tokenValidation } from "../middleware/TokenValidation.middleware";
import { cors } from "hono/cors";

const categoryController = new CategoryController();
const router = new Hono().basePath("/api");

router.use("/api/*", cors());

router.get("/category/get-all", tokenValidation, async (c) => {
  return categoryController.getAllCategories(c);
});

router.post("/category/create", tokenValidation, (c) => {
  return categoryController.createCategory(c);
});

export { router as categoryRoutes };
