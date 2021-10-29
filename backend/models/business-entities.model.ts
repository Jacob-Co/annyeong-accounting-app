import { ObjectId } from "mongodb";

// export interface BusinessEntity {
//   id?: ObjectId;
//   name: string;
//   capital: number;
//   capitalShare: number;
//   incomeShare: number;
// }

export class BusinessEntity {
  constructor(
    public name: string,
    public capital: number,
    public capitalShare: number,
    public incomeShare: number,
    public id?: ObjectId,
  ) {}
}