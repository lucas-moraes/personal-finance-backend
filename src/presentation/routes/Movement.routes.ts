import { Hono } from "hono";
import { MovementController } from "../controllers/Movement.controller";
import { tokenValidation } from "../middleware/TokenValidation.middleware";

const router = new Hono();
const movementController = new MovementController();

router.get("/movement/get-all", tokenValidation, (c) => {
  return movementController.getAllMovements(c);
});

router.get("/movement/filter", tokenValidation, (c) => {
  return movementController.filterMovements(c);
});

router.get("/movement/:id", tokenValidation, (c) => {
  return movementController.getMovementById(c);
});

router.get("/movement/filter-year-group-by-month/:year", tokenValidation, (c) => {
  return movementController.getMovementsByYearGroupByMonth(c);
});

router.get("/movement/filter-year-group-by-category/:year", tokenValidation, (c) => {
  return movementController.getMovementsByYearGroupByCategory(c);
});

router.post("/movement/create", tokenValidation, (c) => {
  return movementController.createMovement(c);
});

router.post("/movement/multiple-creation", tokenValidation, (c) => {
  return movementController.createMultipleMovements(c);
});

router.delete("/movement/:id", tokenValidation, (c) => {
  return movementController.deleteMovementById(c);
});

router.patch("/movement/:id", tokenValidation, (c) => {
  return movementController.updateMovementById(c);
});

export { router as movementRoutes };
