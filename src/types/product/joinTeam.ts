export type TJoinRequest = {
  teamId: number;
  selectedOptions?: {
    optionId: number;
    quantity: number;
  }[];
};
