import { ObjectId } from "mongodb";
import { Creditor } from "./creditors.model";
import { BusinessEntity } from "./business-entities.model";

export interface Credit {
  id?: ObjectId;
  businessEntity: ObjectId | BusinessEntity;
  creditor: ObjectId | Creditor;
  date: number;
  amount: number;
  remarks: string;
}