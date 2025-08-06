export type TGetMainCategoryResponse = {
  isSuccess: boolean;
  result: { id: number; name: string }[];
};

export type TGetSubCategoryResponse = {
  isSuccess: boolean;
  result: { id: number; name: string }[];
};
