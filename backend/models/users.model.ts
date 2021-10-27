import { ObjectId } from "mongodb";

export default class User {
  constructor(
    public username: string,
    public firstName: string,
    public lastName: string,
    public password: string,
    public isAdmin: boolean,
    public businessEntity: ObjectId,
    public id?: ObjectId
  ) {
    
  }
}