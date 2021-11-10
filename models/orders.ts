export type TOrderStatus = "success" | "pending" | "failed";

export interface IOrder {
  id: string;
  item: string;
  amount: string;
  status: TOrderStatus;
  createdAt: string;
}
