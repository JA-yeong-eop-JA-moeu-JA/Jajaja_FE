export type TPatchUserInfoRequest = {
  name?: string;
  phone?: string;
  profileKeyName?: string;
};

export type TVariables = {
  memberId: number;
  memberData: TPatchUserInfoRequest;
};
