import { ObjectId } from "mongodb";

export enum leaveTypes {
  Vacation = "VACATION",
  Sick = "SICK",
  Maternity = "MATERNITY",
  CompensationLeave = "COMPENSATION_LEAVE"
}

export default class Leaves {
  constructor(
    public name: string,
    public capital: number,
    public capitalSharePercentage: number,
    public incomeSharePercentage: number,
    public id?: ObjectId
  ) {
    
  }
}

// dateStart
// dateEnd

// remarks