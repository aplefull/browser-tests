export type TAction<T> = {
  type: string;
  payload: T;
};

export type TDimensions = {
  width: number;
  height: number;
};

export type TImageModule = {
  default: string;
};
