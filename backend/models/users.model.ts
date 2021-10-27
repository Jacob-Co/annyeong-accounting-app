import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";

export interface User {
  id?: ObjectId;
  businessEntity: ObjectId | BusinessEntity;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  isAdmin: boolean;
}