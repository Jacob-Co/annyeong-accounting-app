import { ObjectId } from 'mongodb';
import { BusinessEntity } from './business-entities.model';

export class Distributor {
  constructor(
    public businessEntity: ObjectId | BusinessEntity,
    public name: string,
    public id?: ObjectId
  ) {}
}