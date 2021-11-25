import { DailyAccounting } from "../models/daily-accoutings.model";
import { businessEntityCollection, dailyAccountingsCollection, mongoDBClient } from "../services/database.service";
import express, { Request, Response } from 'express';
import { ObjectId, InsertOneResult } from 'mongodb';
import { verifyUserToken } from "../services/auth.service";
import { BusinessEntity } from "../models/business-entities.model";

export const dailyAccountingRouter = express.Router();
dailyAccountingRouter.use(express.json());
dailyAccountingRouter.use(verifyUserToken);

// GET
dailyAccountingRouter.get('/:startUnix/:endUnix', async (req: Request, res: Response) => {
  try { 
    const startUnix = Number(req.params.startUnix);
    const endUnix = Number(req.params.endUnix);
    const businessEntity = new ObjectId(req.body.token.businessEntity); 
    const query = { businessEntity, date: { $gte: startUnix, $lte: endUnix }};
    const result = await dailyAccountingsCollection.find(query).toArray() as DailyAccounting[];
    res.status(200).send(result);
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error getting daily accountings');
  }
});

// POST
dailyAccountingRouter.post('/', async (req: Request, res: Response) => {
  const session = mongoDBClient.startSession();
  try {
    const newDailyAccounting = req.body.newDailyAccounting as DailyAccounting;
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    newDailyAccounting.businessEntity = businessEntityId;  
    // for(let i = 0; i < newDailyAccounting.expenses.length; i++) {
    //   const expensesID = new ObjectId(newDailyAccounting.expenses[i].toString());
    //   newDailyAccounting.expenses[i] = expensesID;
    // }
    let result: InsertOneResult<Document>

    await session.withTransaction(async () => {
      result = await dailyAccountingsCollection.insertOne(newDailyAccounting);
      
      const filter = {
        _id: businessEntityId
      }

      const { capitalPercent, incomePercent } = await businessEntityCollection
        .findOne(filter) as BusinessEntity;
      
      const update = {
        $inc: {
          income: newDailyAccounting.totalSales * incomePercent / 100,
          capital: newDailyAccounting.totalSales * capitalPercent / 100
        }
      }

      await businessEntityCollection.updateOne(filter, update);
    });

    result!.acknowledged
      ? res.status(200).send('Successfully added new daily accounting')
      : res.status(400).send('Could not save new daily accounting');
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error in saving new daily accouting');
  } finally {
    session.endSession();
  }
})
