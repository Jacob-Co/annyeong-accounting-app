import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";

export interface Creditor {
  id?: ObjectId;
  businessEntity: ObjectId | BusinessEntity;
  firstName: string;
  lastName: string;
  nickName: string;
  wholeName: string;
  balance: number;
}