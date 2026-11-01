import { Hono } from "hono";
import { healthRoutes } from "../../src/presentation/routes/Health.routes";

const mockSelect = jest.fn();
const mockLimit = jest.fn();

jest.mock("../../src/infrastructure/database/SupabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: (...args: unknown[]) => {
        mockSelect(...args);
        return { limit: (...l: unknown[]) => mockLimit(...l) };
      },
    })),
  },
}));

const createApp = () => {
  const app = new Hono();
  app.route("/", healthRoutes);
  return app;
};

describe("GET - /health", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createApp();
  });

  it("deve retornar 200 e status ok quando o banco responde", async () => {
    mockLimit.mockResolvedValue({ data: [], error: null });

    const res = await app.request("/health");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.database).toBe("up");
    expect(body.timestamp).toBeDefined();
  });

  it("deve consultar a tabela poupanca com limit 1", async () => {
    mockLimit.mockResolvedValue({ data: [], error: null });

    await app.request("/health");

    expect(mockSelect).toHaveBeenCalledWith("id");
    expect(mockLimit).toHaveBeenCalledWith(1);
  });

  it("deve retornar 503 quando o banco retorna erro", async () => {
    mockLimit.mockResolvedValue({
      data: null,
      error: { message: "connection refused" },
    });

    const res = await app.request("/health");

    expect(res.status).toBe(503);
  });
});
