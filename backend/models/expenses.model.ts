import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";
import { ExpenseType } from "./expense-types.model";
import { User } from "./users.model";

// export interface Expense {
//   id?: ObjectId;
//   businessEntity: ObjectId | BusinessEntity;
//   expenseType: ObjectId | ExpenseType;
//   date: number;
//   price: number;
//   remarks: string;
// }

export class Expense {
  constructor(
    public businessEntity: ObjectId | BusinessEntity,
    public expenseType: ObjectId | ExpenseType,
    public user: ObjectId | User,
    public date: number,
    public price: number,
    public remarks: string,
    public id?: ObjectId,
  ) {}
}