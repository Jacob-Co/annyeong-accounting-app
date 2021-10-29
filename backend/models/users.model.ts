import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";

// export interface User {
//   id?: ObjectId;
//   businessEntity: ObjectId | BusinessEntity;
//   firstName: string;
//   lastName: string;
//   username: string;
//   password: string;
//   isAdmin: boolean;
// }

export class User {
  constructor(
    public businessEntity: ObjectId | BusinessEntity,
    public firstName: string,
    public lastName: string,
    public username: string,
    public password: string,
    public isAdmin: boolean,
    public id?: ObjectId,
  ) {}
}