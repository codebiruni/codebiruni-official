export interface IOrder {
  name: string;
  number: string;
  email?: string;
  projectType: string;
  address: string;
  note?: string;
  status?: "new" | "contacted" | "in_discussion" | "converted" | "closed" | string;
}
