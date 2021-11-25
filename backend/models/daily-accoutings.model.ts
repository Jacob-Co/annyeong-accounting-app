import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";
import { Expense } from "./expenses.model";
import { Credit } from "./credits.model";

// export interface DailyAccounting {
//   id?: ObjectId;
//   businessEntity: ObjectId | BusinessEntity;
//   expenses: ObjectId[] | Expense[];
//   credits: ObjectId[] | Credit;
//   date: number;
//   totalSales: number;
//   onlineSales: number;
//   physicalSales: number;
//   netSales: number;
//   takeHomeCash: number;
//   cashInRegister: number;
//   remarks: string;
// }

export class DailyAccounting {
  constructor(
    public businessEntity: ObjectId | BusinessEntity,
    // public expenses: ObjectId[] | Expense[],
    // public credits: ObjectId[] | Credit,
    public expenses: number,
    public credits: number,
    public date: number,
    public totalSales: number,
    public onlineSales: number,
    public physicalSales: number,
    public netSales: number,
    public takeHomeCash: number,
    public cashInRegister: number,
    public remarks: string,
    public id?: ObjectId,
  ) {}
}