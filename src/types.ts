export type TAction<T> = {
  type: string;
  payload: T;
};

export type TDimensions = {
  width: number;
  height: number;
};

export type TResolution = TDimensions;

export type TSelectOption = {
  label: string;
  value: string;
};

export type TImageModule = {
  default: string;
};

export type TRawEmoji = {
  category: string;
  char: string;
  codes: string;
  group: string;
  name: string;
  subgroup: string;
};

export type TSeparator = {
  type: 'separator';
};

export type TNoArgumentFunction = () => number;
export type TSingleArgumentFunction = (a: number) => number;
export type TDoubleArgumentFunction = (a: number, b: number) => number;

export type TLabelPosition = 'top' | 'bottom' | 'left' | 'right';
