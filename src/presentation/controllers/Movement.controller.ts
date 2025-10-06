import { MovementAdapter } from "./../../infrastructure/adapters/Movement.adapter";
import { GetAllMovements } from "../../useCases/movement/GetAllMovements.usecase";
import { FilterMovements } from "../../useCases/movement/FilterMovements.usecase";
import { RESPONSE_MESSAGES } from "../constants";
import { FilterYearGroupByMonth } from "../../useCases/movement/FilterYearGroupByMonth.usecase";
import { FilterYearGroupByCategory } from "../../useCases/movement/FilterYearGroupByCategory.usecase";
import { CreateMovement } from "../../useCases/movement/CreateMovement.usecase";
import { DeleteMovementById } from "../../useCases/movement/DeleteMovementById.usecase";
import { UpdateMovementById } from "../../useCases/movement/UpdateMovementById.usecase";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { TMovement } from "../../domain/interfaces/Movement.interface";

export class MovementController {
  private getAllMovementsUseCase: GetAllMovements;
  private filterMovementsUseCase: FilterMovements;
  private filterYearGroupByMonth: FilterYearGroupByMonth;
  private filterYearGroupByCategory: FilterYearGroupByCategory;
  private createMovementsUseCase: CreateMovement;
  private deleteMovementByIdUseCase: DeleteMovementById;
  private updateMovementsUseCase: UpdateMovementById;

  constructor() {
    const movementAdapter = new MovementAdapter();
    this.getAllMovementsUseCase = new GetAllMovements(movementAdapter);
    this.filterMovementsUseCase = new FilterMovements(movementAdapter);
    this.filterYearGroupByMonth = new FilterYearGroupByMonth(movementAdapter);
    this.filterYearGroupByCategory = new FilterYearGroupByCategory(movementAdapter);
    this.createMovementsUseCase = new CreateMovement(movementAdapter);
    this.deleteMovementByIdUseCase = new DeleteMovementById(movementAdapter);
    this.updateMovementsUseCase = new UpdateMovementById(movementAdapter);
  }

  async getAllMovements(c: Context) {
    try {
      const movements = await this.getAllMovementsUseCase.execute();
      return c.json(movements);
    } catch (error) {
      return c.json({ message: (error as Error).message }, 500);
    }
  }

  async filterMovements(c: Context) {
    try {
      const { category, month, year } = c.req.query();

      if (!category && !month && !year) {
        throw new HTTPException(400, { message: RESPONSE_MESSAGES.MOVEMENT.PARAMETERS_IS_EMPTY });
      }

      let query = {};
      if (category) query = { ...query, categoria: category };
      if (month) query = { ...query, mes: month };
      if (year) query = { ...query, ano: year };

      const movements = await this.filterMovementsUseCase.execute(query);
      return c.json(movements);
    } catch (error) {
      return c.json({ message: (error as Error).message }, (error as HTTPException).status || 500);
    }
  }

  async getMovementById(c: Context) {
    try {
      const { id } = c.req.param();

      if (!id) {
        throw new HTTPException(400, { message: RESPONSE_MESSAGES.MOVEMENT.PARAMETERS_IS_EMPTY });
      }

      const movement = await this.filterMovementsUseCase.execute({ id: Number(id) });
      return c.json(movement);
    } catch (error) {
      return c.json({ message: (error as Error).message }, (error as HTTPException).status || 500);
    }
  }

  async getMovementsByYearGroupByMonth(c: Context) {
    try {
      const { year } = c.req.param();

      if (!year) {
        throw new HTTPException(400, { message: RESPONSE_MESSAGES.MOVEMENT.PARAMETERS_IS_EMPTY });
      }

      const movements = await this.filterYearGroupByMonth.execute({ year: Number(year) });
      return c.json(movements);
    } catch (error) {
      return c.json({ message: (error as Error).message }, (error as HTTPException).status || 500);
    }
  }

  async getMovementsByYearGroupByCategory(c: Context) {
    try {
      const { year } = c.req.param();

      if (!year) {
        throw new HTTPException(400, { message: RESPONSE_MESSAGES.MOVEMENT.PARAMETERS_IS_EMPTY });
      }

      const movements = await this.filterYearGroupByCategory.execute({ year: Number(year) });
      return c.json(movements);
    } catch (error) {
      return c.json({ message: (error as Error).message }, (error as HTTPException).status || 500);
    }
  }

  async createMovement(c: Context) {
    try {
      const movementProps = c.req.json() as unknown as TMovement | TMovement[];

      const movement = await this.createMovementsUseCase.execute(movementProps);
      return c.json(movement);
    } catch (error) {
      return c.json({ message: (error as Error).message }, (error as HTTPException).status || 500);
    }
  }

  async createMultipleMovements(c: Context) {
    try {
      const movementProps = c.req.json() as unknown as TMovement | TMovement[];

      const movement = await this.createMovementsUseCase.execute(movementProps);
      return c.json(movement);
    } catch (error) {
      return c.json({ message: (error as Error).message }, (error as HTTPException).status || 500);
    }
  }

  async deleteMovementById(c: Context) {
    try {
      const { id } = c.req.param();

      if (!id) {
        throw new HTTPException(400, { message: RESPONSE_MESSAGES.MOVEMENT.PARAMETERS_IS_EMPTY });
      }

      await this.deleteMovementByIdUseCase.execute(Number(id));
      return c.status(204);
    } catch (error) {
      return c.json({ message: (error as Error).message }, (error as HTTPException).status || 500);
    }
  }

  async updateMovementById(c: Context) {
    try {
      const { id } = c.req.param();
      const movementProps = c.req.json() as unknown as Partial<TMovement>;

      await this.updateMovementsUseCase.execute(Number(id), movementProps);
      return c.status(204);
    } catch (error) {
      return c.json({ message: (error as Error).message }, (error as HTTPException).status || 500);
    }
  }
}
