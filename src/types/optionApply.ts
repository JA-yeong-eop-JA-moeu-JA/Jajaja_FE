export type TOptionBase = {
  id: number;
  name: string;
};

export type TOption = TOptionBase & {
  originPrice: number;
  unitPrice: number;
};

export type TReasonOption = TOptionBase;
