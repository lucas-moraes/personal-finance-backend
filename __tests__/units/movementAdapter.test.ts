import { AppDataSource } from "../../src/infrastructure/database/DataSource";
import { Movement } from "../../src/domain/entities/Movement.entity";
import { MovementAdapter } from "../../src/infrastructure/adapters/Movement.adapter";
import { Repository } from "typeorm";

jest.mock("../../src/infrastructure/database/DataSource", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("MovementAdapter", () => {
  let movementAdapter: MovementAdapter;
  let repositoryMock: jest.Mocked<Repository<Movement>>;

  beforeEach(() => {
    repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as unknown as jest.Mocked<Repository<Movement>>;
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(repositoryMock);

    movementAdapter = new MovementAdapter();
  });

  it("should find all movements", async () => {
    const mockMovements = [{ id: 1, descricao: "Teste", category: {} }] as Movement[];
    repositoryMock.find.mockResolvedValue(mockMovements);

    const result = await movementAdapter.findAllMovements();

    expect(repositoryMock.find).toHaveBeenCalledWith({ relations: ["category"] });
    expect(result).toEqual(mockMovements);
  });

  it("should find movements by given criteria", async () => {
    const mockMovements = [{ id: 2, descricao: "Filtrado", category: {} }] as Movement[];
    repositoryMock.find.mockResolvedValue(mockMovements);

    const result = await movementAdapter.findMovementsBy({ descricao: "Filtrado" });

    expect(repositoryMock.find).toHaveBeenCalledWith({
      where: { descricao: "Filtrado" },
      relations: ["category"],
    });
    expect(result).toEqual(mockMovements);
  });

  it("should create a movement", async () => {
    const mockMovement = { id: 3, descricao: "Novo Movimento" } as Movement;
    repositoryMock.save.mockResolvedValue(mockMovement);

    const result = await movementAdapter.createMovement(mockMovement);

    expect(repositoryMock.save).toHaveBeenCalledWith(mockMovement);
    expect(result).toEqual(mockMovement);
  });
});
