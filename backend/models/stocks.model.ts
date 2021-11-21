import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";
import { Distributor } from "./distributor.model";
import { User } from "./users.model";

export class Stock {
  constructor(
    public businessEntity: ObjectId | BusinessEntity,
    public distributor: ObjectId | Distributor,
    public user: ObjectId | User,
    public date: number,
    public price: number,
    public remarks: string,
    public id?: ObjectId,
  ) {}
}