import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";
import { Expense } from "./expenses.model";
import { Credit } from "./credits.model";

export interface DailyAccounting {
  id?: ObjectId;
  businessEntity: ObjectId | BusinessEntity;
  expenses: ObjectId[] | Expense[];
  credits: ObjectId[] | Credit;
  date: number;
  totalSales: number;
  onlineSales: number;
  physicalSales: number;
  netSales: number;
  takeHomeCash: number;
  cashInRegister: number;
  remarks: string;
}