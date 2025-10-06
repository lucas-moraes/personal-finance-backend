export type TMovement = {
  id: number;
  dia: number;
  mes: number;
  ano: number;
  tipo: string;
  categoria: number;
  descricao: string | null;
  valor: string;
};

export interface IMovementAdapter {
  filterMovementGroupByCategory(year: number): Promise<Array<{ categoria: number; total_valor: number }>>;
  filterMovementGroupByMonth(year: number): Promise<Array<{ mes: number; total_valor: number }>>;
  findAllMovements(): Promise<Array<TMovement>>;
  findMovementsBy(args: Partial<TMovement>): Promise<TMovement[]>;
  createMovement(movement: TMovement | Array<TMovement>): Promise<TMovement>;
  deleteMovementById(id: number): Promise<void>;
  updateMovementById(id: number, movementUpdated: Partial<TMovement>): Promise<void>;
}
