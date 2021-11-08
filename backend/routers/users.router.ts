import express, { Request, Response } from 'express';
import { usersCollection } from '../services/database.service';
import { generateUserAuthToken } from '../services/auth.service';
import { User } from '../models/users.model';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

export const usersRouter = express.Router();
usersRouter.use(express.json());

//POST
usersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newUser = req.body as User;
    newUser.businessEntity = new ObjectId(newUser.businessEntity.toString()); 
    const saltRounds = 10;
    const hash = bcrypt.hashSync(newUser.password, saltRounds);
    newUser.password = hash;
    
    const result = await usersCollection.insertOne(newUser);
    
    let token;
    if (result.acknowledged === true) {
      newUser.id = result.insertedId;
      token = generateUserAuthToken(newUser);
    }

    (token !== undefined)
      ? res.status(201).send(JSON.stringify(token))
      : res.status(400).send(JSON.stringify('Failed to create user'));
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error in creating user');
  }
});

//GET
usersRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await usersCollection.findOne({ username }) as User;    
    
    if (result === null || !bcrypt.compareSync(password, result.password)) {
      return res.status(403).send('Incorrect credentials');
    }
    
    const token = generateUserAuthToken(result);

    res.status(200).send(JSON.stringify(token));
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error in logging in');
  }
});

// // External Dependencies
// import express, { Request, Response } from 'express';
// import { ObjectId } from 'mongodb';
// import { collections } from '../services/database.service';
// import User from '../models/users.model';

// // Global Config
// export const usersRouter = express.Router();
// usersRouter.use(express.json());

// // GET
// usersRouter.get('/', async (_req: Request, res: Response) => {
//   try {
//     console.log('get /')
//     const users = (await collections.users?.find({}).toArray()) as User[];
//     res.status(200).send(users);
//   } catch(err: any) {
//     res.status(500).send(err.message);
//   }
// });

// usersRouter.get('/:id', async (req: Request, res: Response) => {
//   const id = req.params.id;

//   try {
//     const query = { _id: new ObjectId(id) };
//     const user = (await collections.users?.findOne(query)) as User;
    
//     if(user) {
//       res.status(200).send(user);
//     } else {
//       res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
//     }
//   } catch(error) {
//     res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
//   }
// })

// // POST
// usersRouter.post('/', async(req: Request, res: Response) => {
//   console.log('post /')
//   try {
//     const newUser = req.body as User;
//     const result = await collections.users?.insertOne(newUser);

//     result
//       ? res.status(201).send(`Sucessfully created user with id${result.insertedId}.`)
//       : res.status(500).send('Failed to create a new user.');
//   } catch(error: any) {
//     console.error(error.message);
//     res.status(400).send(error.message);
//   }
// })

// // PUT
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

// // DELETE
// usersRouter.delete('/:id', async(req: Request, res: Response) => {
//   const id = req.params.id;

//   try {
//     const query = { _id: new ObjectId(id) };
//     const result = await collections.users?.deleteOne(query);

//     if(result && result.deletedCount) {
//       res.status(202).send(`Successfully removed user with id ${id}`);
//     } else if (!result) {
//       res.status(400).send(`Failed to remove user with id ${id}`);
//     } else if (!result.deletedCount) {
//       res.status(404).send(`User with id ${id} does not exist`);
//     }
//   } catch(error: any) {
//     console.error(error.message);
//     res.status(400).send(error.message);
//   }
// })