import express, { Request, Response } from 'express';
import { Credit } from '../models/credits.model';
import { verifyUserToken } from '../services/auth.service';
import { InsertOneResult, ObjectId } from 'mongodb';
import { creditsCollection } from '../services/database.service';
import { creditorsCollection } from '../services/database.service';
import { mongoDBClient } from '../services/database.service';

export const creditsRouter = express.Router();
creditsRouter.use(express.json());
creditsRouter.use(verifyUserToken);

//POST
creditsRouter.post('/', async (req: Request, res: Response) => {
  const session = mongoDBClient.startSession();
  
  try {
    const credit = req.body.credit as Credit;
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    const creditorId = new ObjectId(credit.creditor.toString());
    credit.creditor = creditorId;

    let result: InsertOneResult<Document>

    await session.withTransaction(async () => {
      result = await creditsCollection.insertOne(credit);
      const filter = {
        _id: creditorId,
        businessEntity: businessEntityId
      }
      const update = {
        $inc: { balance: credit.amount } 
      }
      await creditorsCollection.findOneAndUpdate(filter, update)
    })
    
    result!.acknowledged
      ? res.status(200).send(JSON.stringify('Created credit'))
      : res.status(400).send(JSON.stringify('Could not create credit'));
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send(JSON.stringify('Error creating credit'));
  } finally {
    await session.endSession();
  }
});