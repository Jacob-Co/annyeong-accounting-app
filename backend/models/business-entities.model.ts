import { ObjectId } from "mongodb";

export interface BusinessEntity {
  id?: ObjectId;
  name: string;
  capital: number;
  capitalShare: number;
  incomeShare: number;
}