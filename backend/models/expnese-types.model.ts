import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";

export interface ExpenseType {
  id?: ObjectId;
  businessEntity: ObjectId | BusinessEntity;
  type: string;
}