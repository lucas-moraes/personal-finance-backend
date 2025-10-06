import "dotenv/config";
import { Hono } from "hono";
import { movementRoutes } from "./presentation/routes/Movement.routes";
import { categoryRoutes } from "./presentation/routes/Category.routes";
import { authRoutes } from "./presentation/routes/Auth.routes";
import { HTTPException } from "hono/http-exception";

const app = new Hono();
app.get("/", (c) => c.json({ message: "hello" }));
app.route("/api", authRoutes);
app.route("/api", movementRoutes);
app.route("/api", categoryRoutes);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const response = err.getResponse();
    return response;
  }
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

export default app;
