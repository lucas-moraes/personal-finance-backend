import { Category } from "../../src/domain/entities/Category.entity";
import { CategoryAdapter } from "../../src/infrastructure/adapters/Category.adapter";
import { AppDataSource } from "../../src/infrastructure/database/DataSource";
import { Repository, SelectQueryBuilder } from "typeorm";

jest.mock("../../src/infrastructure/database/DataSource", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("CategoryAdapter", () => {
  let categoryAdapter: CategoryAdapter;
  let repositoryMock: jest.Mocked<Repository<Category>>;

  beforeEach(() => {
    repositoryMock = {
      find: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as unknown as jest.Mocked<Repository<Category>>;
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(repositoryMock);

    categoryAdapter = new CategoryAdapter();
  });

  it("should return a query builder instance", () => {
    const queryBuilderMock = {} as SelectQueryBuilder<Category>;
    repositoryMock.createQueryBuilder.mockReturnValue(queryBuilderMock);

    const result = categoryAdapter.customQueryForCategories();

    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith("category");
    expect(result).toBe(queryBuilderMock);
  });

  it("should find all categories", async () => {
    const mockCategories = [{ id: 1, descricao: "Alimentação" }] as Category[];
    repositoryMock.find.mockResolvedValue(mockCategories);

    const result = await categoryAdapter.findAllCategories();

    expect(repositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual(mockCategories);
  });

  it("should create a category", async () => {
    const mockCategory = { id: 2, descricao: "Transporte" } as Category;
    repositoryMock.save.mockResolvedValue(mockCategory);

    const result = await categoryAdapter.createCategory(mockCategory);

    expect(repositoryMock.save).toHaveBeenCalledWith(mockCategory);
    expect(result).toEqual(mockCategory);
  });
});
