export interface ISavings {
  id: number;
  value: number;
}

export interface ISavingsGetAmount extends Omit<ISavings, "id"> {
  value: number;
}

export interface ISavingsAdapter {
  updateValue({ value }: { value: number }): Promise<void>;
  clearValue(): Promise<void>;
  getValue(): Promise<ISavingsGetAmount>;
}
