import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";

// export interface ExpenseType {
//   id?: ObjectId;
//   businessEntity: ObjectId | BusinessEntity;
//   type: string;
// }

export class ExpenseType {
  constructor(
    public businessEntity: ObjectId | BusinessEntity,
    public type: string,
    public id?: ObjectId,
  ) {}
}