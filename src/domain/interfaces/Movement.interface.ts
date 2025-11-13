export interface IMovement {
  id: number;
  dia: number;
  mes: number;
  ano: number;
  tipo: string;
  categoria: number;
  descricao: string | null;
  valor: number;
}

export interface IMovementSummary {
  movements: Array<Omit<IMovement, "categoria"> & { categoriaDescricao: string }>;
  total: number;
}

export interface IMovementConsult extends Omit<IMovement, "categoria"> {
  categoriaDescricao: string;
}

export interface IMovementMonths {
  id: number;
  mes: string;
}

export interface IMovementYears {
  id: number;
  ano: number;
}

export interface IMovementAdapter {
  monthsWithMovements(): Promise<Array<IMovementMonths>>;
  yearsWithMovements(): Promise<Array<IMovementYears>>;
  filterMovementGroupByCategory(year: number): Promise<Array<{ categoria: number; total_valor: number }>>;
  filterMovementGroupByMonth(year: number): Promise<Array<{ mes: number; total_valor: number }>>;
  findAllMovements(): Promise<Array<IMovementConsult>>;
  findMovementsBy(args: Partial<IMovement>): Promise<IMovementSummary>;
  createMovement(movement: IMovement): Promise<IMovement>;
  deleteMovementById(id: number): Promise<void>;
  updateMovementById(id: number, movementUpdated: Partial<IMovement>): Promise<void>;
  findMovementById({ id }: { id: string }): Promise<Array<IMovement> | null>;
}
