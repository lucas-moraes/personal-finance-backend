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

jest.mock("./../../src/infrastructure/adapters/Category.adapter", () => {
  return {
    CategoryAdapter: jest.fn().mockImplementation(() => ({
      findAllCategories: jest.fn().mockResolvedValue([
        {
          id: 37,
          descricao: "Telefone",
        },
        {
          id: 38,
          descricao: "Vendas",
        },
      ]),
      createCategory: jest.fn().mockResolvedValue({
        description: "Vendas",
      }),
      customQueryForCategories: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(null),
      })),
    })),
  };
});

const createApp = () => {
  const app = new Hono();
  return app;
};

describe("GET - /category/get-all", () => {
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

  it("should return all categories", async () => {
    const mockUser = { id: "1234", email: "um@dois.com" };
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await request(server).get("/api/category/get-all").set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 37,
        descricao: "Telefone",
      },
      {
        id: 38,
        descricao: "Vendas",
      },
    ]);
  });
});

describe("POST - /category/create", () => {
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
      .post("/api/category/create")
      .set("Authorization", "Bearer valid_token")
      .send({
        description: "Vendas",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      description: "Vendas",
    });
  });
});
