import { Hono } from "hono";
import { CategoryController } from "../controllers/Category.controller";
import { tokenValidation } from "../middleware/TokenValidation.middleware";

const router = new Hono();
const categoryController = new CategoryController();

router.get("/category/get-all", tokenValidation, async (c) => {
  return categoryController.getAllCategories(c);
});

router.post("/category/create", tokenValidation, (c) => {
  return categoryController.createCategory(c);
});

export { router as categoryRoutes };
