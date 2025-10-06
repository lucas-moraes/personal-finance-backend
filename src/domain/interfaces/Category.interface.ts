export type TCategory = {
  id: number;
  descricao: string;
};

export interface ICategoryAdapter {
  findAllCategories(): Promise<Array<TCategory> | []>;
  createCategory(descricao: string): Promise<TCategory>;
}
