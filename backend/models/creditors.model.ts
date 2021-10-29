import { ObjectId } from "mongodb";
import { BusinessEntity } from "./business-entities.model";

// export interface Creditor {
//   id?: ObjectId;
//   businessEntity: ObjectId | BusinessEntity;
//   firstName: string;
//   lastName: string;
//   nickName: string;
//   wholeName: string;
//   balance: number;
// }

export class Creditor {
  constructor(
    public businessEntity: ObjectId | BusinessEntity,
    public firstName: string,
    public lastName: string,
    public nickName: string,
    public wholeName: string,
    public balance: number,
    public id?: ObjectId,
  ) {}
}