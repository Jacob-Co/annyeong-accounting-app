import express, { Request, Response } from 'express';
import { Creditor } from '../models/creditors.model';
import { verifyUserToken } from '../services/auth.service';
import { ObjectId } from 'mongodb';
import { creditorsCollection } from '../services/database.service';

export const creditorsRouter = express.Router();
creditorsRouter.use(express.json());
creditorsRouter.use(verifyUserToken);

// GET
creditorsRouter.get('/all', async (req: Request, res: Response) => {
  try {
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    const result = await creditorsCollection
      .find({ businessEntity: businessEntityId}).toArray() as Creditor[];

    res.status(200).send(JSON.stringify(result));
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error getting all creditors')
  }
})

// POST
creditorsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newCreditor = req.body.creditor as Creditor;
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    newCreditor.businessEntity = businessEntityId;
    newCreditor.wholeName = `${newCreditor.nickName} ${newCreditor.firstName}`
      + ` ${newCreditor.lastName}`

    const result = await creditorsCollection.insertOne(newCreditor);
    
    result.acknowledged
      ? res.status(200).send(JSON.stringify('Added new creditor'))
      : res.status(400).send(JSON.stringify('Failed to add new creditor'))
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Error creating creditor')
  }
});