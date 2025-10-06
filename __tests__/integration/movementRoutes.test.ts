import { Hono } from "hono";
import request from "supertest";
import { supabase } from "../../src/infrastructure/database/SupabaseClient";

jest.mock("./../../src/interface/auth/SupabaseClient", () => {
  return {
    supabase: {
      auth: {
        getUser: jest.fn(),
      },
    },
  };
});

jest.mock("./../../src/infrastructure/adapters/Movement.adapter", () => {
  return {
    MovementAdapter: jest.fn().mockImplementation(() => ({
      findAllMovements: jest.fn().mockResolvedValue([
        {
          id: 1,
          dia: 6,
          mes: 6,
          ano: "2018",
          tipo: "entrada",
          descricao: "findAllMovements",
          valor: "2500",
          categoria: {
            id: 38,
            descricao: "Vendas",
          },
        },
      ]),
      findMovementsBy: jest.fn().mockResolvedValue([
        {
          id: 1,
          dia: 6,
          mes: 6,
          ano: "2018",
          tipo: "entrada",
          descricao: "findMovementsBy",
          valor: "2500",
          categoria: {
            id: 38,
            descricao: "Vendas",
          },
        },
      ]),
      movementQueryBuilder: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          {
            mes: 6,
            total_valor: "2500",
          },
        ]),
      })),
      createMovement: jest.fn().mockResolvedValue([
        {
          id: 1,
          dia: 6,
          mes: 6,
          ano: "2018",
          tipo: "entrada",
          descricao: "findMovementsBy",
          valor: "2500",
          categoria: {
            id: 38,
            descricao: "Vendas",
          },
        },
      ]),
      deleteMovementById: jest.fn().mockReturnThis(),
      updateMovementById: jest.fn().mockResolvedValue([
        {
          id: 1,
          dia: 6,
          mes: 6,
          ano: "2018",
          tipo: "entrada",
          descricao: "findMovementsBy",
          valor: "2500",
          categoria: {
            id: 38,
            descricao: "Vendas",
          },
        },
      ]),
    })),
  };
});

const createApp = () => {
  const app = new Hono();
  return app;
};

describe("GET - /movement/get-all", () => {
  let server: any;

  beforeAll(() => {
    server = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Test success - Should return all movements", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server).get("/api/movement/get-all").set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        dia: 6,
        mes: 6,
        ano: "2018",
        tipo: "entrada",
        descricao: "findAllMovements",
        valor: "2500",
        categoria: {
          id: 38,
          descricao: "Vendas",
        },
      },
    ]);
  });

  it("Test exception - Should return 401 when token is invalid", async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: "Usuário ou senha inválidos" },
    });

    const response = await request(server).get("/api/movement/get-all").set("Authorization", "Bearer invalid_token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido", status: "error" });
  });
});

describe("GET - /movement/filter", () => {
  let server: any;

  beforeAll(() => {
    server = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Test success - Should return filtered movements", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server)
      .get("/api/movement/filter")
      .set("Authorization", "Bearer valid_token")
      .query({ category: "7", month: "12", year: "2025" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        dia: 6,
        mes: 6,
        ano: "2018",
        tipo: "entrada",
        descricao: "findMovementsBy",
        valor: "2500",
        categoria: {
          id: 38,
          descricao: "Vendas",
        },
      },
    ]);
  });

  it("test exception - Should return 400 when one once varibles is empty", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server)
      .get("/api/movement/filter")
      .set("Authorization", "Bearer valid_token")
      .query({ category: "", month: "", year: "" });

    expect(response.status).toBe(400);
  });
});

describe("GET - /movement/:id", () => {
  let server: any;

  beforeAll(() => {
    server = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Test success - Should return movement by id", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server)
      .get("/api/movement/id")
      .set("Authorization", "Bearer valid_token")
      .query({ id: "1" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        dia: 6,
        mes: 6,
        ano: "2018",
        tipo: "entrada",
        descricao: "findMovementsBy",
        valor: "2500",
        categoria: {
          id: 38,
          descricao: "Vendas",
        },
      },
    ]);
  });

  it("test exception - Should return 400 when once varibles is empty", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server)
      .get("/api/movement/filter")
      .set("Authorization", "Bearer valid_token")
      .query({ id: "" });

    expect(response.status).toBe(400);
  });
});

describe("GET - /movement/filter-year-group-by-month/:year", () => {
  let server: any;

  beforeAll(() => {
    server = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Test success - Should return movement fitered year grouped by month", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server)
      .get("/api/movement/filter-year-group-by-month/2025")
      .set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        mes: 6,
        total_valor: "2500",
      },
    ]);
  });
});

describe("GET - /movement/filter-year-group-by-category/:year", () => {
  let server: any;

  beforeAll(() => {
    server = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Test success - Should return movement fitered year grouped by category", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server)
      .get("/api/movement/filter-year-group-by-category/2025")
      .set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        mes: 6,
        total_valor: "2500",
      },
    ]);
  });
});

describe("POST - /movement/create", () => {
  let server: any;

  beforeAll(() => {
    server = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Test success - Should return movement after create", async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: "1234", email: "user@example.com" } },
      error: null,
    });
    const response = await request(server)
      .post("/api/movement/create")
      .set("Authorization", "Bearer valid_token")
      .send({
        dia: 6,
        mes: 6,
        ano: 2018,
        tipo: "entrada",
        categoria: 38,
        descricao: "Salário",
        valor: 2500,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        dia: 6,
        mes: 6,
        ano: "2018",
        tipo: "entrada",
        descricao: "findMovementsBy",
        valor: "2500",
        categoria: {
          id: 38,
          descricao: "Vendas",
        },
      },
    ]);
  });
});

describe("POST - /movement/multiple-creation", () => {
  let server: any;

  beforeAll(() => {
    server = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Test success - Should return movement after create", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server)
      .post("/api/movement/multiple-creation")
      .set("Authorization", "Bearer valid_token")
      .send([
        {
          dia: 6,
          mes: 6,
          ano: 2018,
          tipo: "entrada",
          categoria: 38,
          descricao: "Salário",
          valor: 2500,
        },
        {
          dia: 6,
          mes: 6,
          ano: 2018,
          tipo: "entrada",
          categoria: 38,
          descricao: "Salário",
          valor: 2500,
        },
      ]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        dia: 6,
        mes: 6,
        ano: "2018",
        tipo: "entrada",
        descricao: "findMovementsBy",
        valor: "2500",
        categoria: {
          id: 38,
          descricao: "Vendas",
        },
      },
    ]);
  });
});

describe("DELETE - /movement/:id", () => {
  let server: any;

  beforeAll(() => {
    server = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Test success - Should return movement by id", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server).delete("/api/movement/1").set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(204);
  });
});

describe("PATCH - /movement/:id", () => {
  let server: any;

  beforeAll(() => {
    server = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("Test success - Should return movement by id", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server).patch("/api/movement/1").set("Authorization", "Bearer valid_token").send({
      dia: 6,
      mes: 6,
      ano: 2018,
      tipo: "entrada",
      categoria: 38,
      descricao: "Salário",
      valor: 2500,
    });

    expect(response.status).toBe(204);
  });
});
