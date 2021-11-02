import { businessEntityCollection } from '../services/database.service';
import { BusinessEntity } from '../models/business-entities.model';
import { ObjectId } from 'mongodb';

export type updatedBusinessEntity = {
    name?: string;
    capital?: number;
    capitalShare?: number;
    incomeShare?: number;
    id?: ObjectId;
}

export async function findOneBusinessEntity(id: ObjectId) {
  return (await businessEntityCollection.findOne({ id })) as unknown as BusinessEntity | null;
}

export async function createBusinessEntity(newBusinessEntity: BusinessEntity) {
  return await businessEntityCollection.insertOne(newBusinessEntity);
}

export async function updateBusinessEntity(id: ObjectId, updatedDetails: any) {
  return await businessEntityCollection.updateOne({ id }, { $set: updatedDetails });
}

// export async function 

// usersRouter.put('/:id', async(req: Request, res: Response) => {
//   const id = req.params.id;

//   try {
//     const updatedUser: User = req.body as User;
//     const query = { _id: new ObjectId(id) };

//     const result = await collections.users?.updateOne(query, { $set: updatedUser });

//     result
//       ? res.status(200).send(`Successfully updated user with id ${id}`)
//       : res.status(304).send(`User with id: ${id} not updated`);
//   } catch(error: any) {
//     console.error(error.message);
//     res.status(400).send(error.message);
//   }
// });