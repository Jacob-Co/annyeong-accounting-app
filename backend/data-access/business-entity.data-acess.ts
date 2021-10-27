import { businessEntityCollection } from '../services/database.service';
import businessEntity from '../models/users.model';

export async function findOneBusinessEntity(query: any) {
  return (await businessEntityCollection.findOne(query)) as unknown as businessEntity | null;
}

export async function createBusinessEntity(newBusinessEntity: businessEntity) {
  return await businessEntityCollection.insertOne(businessEntity);
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