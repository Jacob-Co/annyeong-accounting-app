import { ObjectId, InsertOneResult } from 'mongodb';
import express, { Request, Response } from 'express';
import { Stock } from '../models/stocks.model';
import { verifyUserToken } from '../services/auth.service';
import { stocksCollection, mongoDBClient, businessEntityCollection } from '../services/database.service';

export const stocksRouter = express.Router();
stocksRouter.use(express.json());
stocksRouter.use(verifyUserToken);

// POST
stocksRouter.post('/', async (req: Request, res: Response) => {
  const session = mongoDBClient.startSession();
  try {
    const newStock = req.body.stock as Stock;
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    const userId = new ObjectId(req.body.token.id);
    const distributorId = new ObjectId(newStock.distributor.toString());

    newStock.businessEntity = businessEntityId;
    newStock.user = userId;
    newStock.distributor = distributorId;

    let result: InsertOneResult<Document>

    await session.withTransaction(async () => {
      result = await stocksCollection.insertOne(newStock);

      const filter = {
        _id: businessEntityId 
      }
      const update = {
        $inc: { capital: newStock.price }
      }

      await businessEntityCollection.findOneAndUpdate(filter, update);
    });

    result!.acknowledged
      ? res.status(200).send('Created stock')
      : res.status(400).send('Could not create stock');
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send(JSON.stringify('Error creating stock'));
  } finally {
    session.endSession();
  }
});