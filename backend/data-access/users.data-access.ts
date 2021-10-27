import { usersCollection } from '../services/database.service';
import User from '../models/users.model';

export async function findOneUser(query: any) {
  return (await usersCollection.findOne(query)) as unknown as User | null;
}

export async function createUser(newUser: User) {
  return await usersCollection.insertOne(newUser);
}
