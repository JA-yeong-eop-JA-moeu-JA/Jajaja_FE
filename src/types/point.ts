export interface IPointBase {
  id: number;
  content: string;
  createdAt: string;
  expiredAt: string;
}

export interface IReviewPoint extends IPointBase {
  type: 'review';
  amount: 100;
}

export interface ISharePoint extends IPointBase {
  type: 'share';
  amount: 300;
}

export interface IOrderPoint extends IPointBase {
  type: 'order';
  amount: 500;
}

export type TPoint = IReviewPoint | ISharePoint | IOrderPoint;
