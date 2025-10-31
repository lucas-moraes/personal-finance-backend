import "dotenv/config";
import { Hono } from "hono";
import { movementRoutes } from "./presentation/routes/Movement.routes";
import { categoryRoutes } from "./presentation/routes/Category.routes";
import { authRoutes } from "./presentation/routes/Auth.routes";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api");
//app.use("/api/*", cors());
app.get("/", (c) => c.json({ message: "hello!" }));
app.route("/", authRoutes);
app.route("/", movementRoutes);
app.route("/", categoryRoutes);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const response = err.getResponse();
    return response;
  }
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

export default app;
