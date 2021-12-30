import express, { Request, Response } from 'express';
import { Credit } from '../models/credits.model';
import { verifyUserToken } from '../services/auth.service';
import { InsertOneResult, ObjectId } from 'mongodb';
import { businessEntityCollection, creditsCollection } from '../services/database.service';
import { creditorsCollection } from '../services/database.service';
import { mongoDBClient } from '../services/database.service';

export const creditsRouter = express.Router();
creditsRouter.use(express.json());
creditsRouter.use(verifyUserToken);

// GET
creditsRouter.get('/:startUnix/:endUnix/:creditorId', 
  async (req: Request, res: Response) => {
    try {
      const businessEntity = new ObjectId(req.body.token.businessEntity);
      const startUnix = Number(req.params.startUnix);
      const endUnix = Number(req.params.endUnix);
      const creditorId = req.params.creditorId;

      const query = (creditorId === '0')
        ? {businessEntity, date: {$gte: startUnix, $lte: endUnix}}
        : {creditor: new ObjectId(creditorId), businessEntity, date: {$gte: startUnix, $lte: endUnix}}
      
      const result = await creditsCollection.find(query).toArray() as Credit[];
      
      const populatedResult = await Promise.all(result.map(async credit => {
        const query = { _id: new ObjectId(credit.creditor.toString())};
        const resultingCreditor = await creditorsCollection.findOne(query);
        return { ...credit, creditor: resultingCreditor!.wholeName}
      }))
      
      res.status(200).send(JSON.stringify(populatedResult));
    } catch(err: any) {
      console.error(err.message);
      res.status(500).send('Error in getting credits');
    }
  }
)

creditsRouter.get('/all/:creditorId', 
  async (req: Request, res: Response) => {
    try {
      const businessEntity = new ObjectId(req.body.token.businessEntity);
      const creditorId = req.params.creditorId;

      const query = { creditor: new ObjectId(creditorId), businessEntity }
      
      const result = await creditsCollection.find(query).toArray() as Credit[];
      
      // const populatedResult = await Promise.all(result.map(async credit => {
      //   const query = { _id: new ObjectId(credit.creditor.toString())};
      //   const resultingCreditor = await creditorsCollection.findOne(query);
      //   return { ...credit, creditor: resultingCreditor!.wholeName}
      // }))
      
      // res.status(200).send(JSON.stringify(populatedResult));
      res.status(200).send(result);
    } catch(err: any) {
      console.error(err.message);
      res.status(500).send('Error in getting credits');
    }
  }
)

//POST
creditsRouter.post('/', async (req: Request, res: Response) => {
  const session = mongoDBClient.startSession();
  
  try {
    const credit = req.body.credit as Credit;
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    const creditorId = new ObjectId(credit.creditor.toString());
    credit.creditor = creditorId;
    credit.businessEntity = businessEntityId;

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

creditsRouter.patch('/repay/:creditId/:creditorId', async (req: Request, res: Response) => {
  const session = mongoDBClient.startSession();
  
  try {
    const creditId = new ObjectId(req.params.creditId);
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    const creditorId = new ObjectId(req.params.creditorId);

    await session.withTransaction(async () => {
      // const targetCredit = await creditsCollection.findOne({
      //   _id: creditId,
      //   businessEntity: businessEntityId,
      //   creditor: creditorId
      // })

      const targetCredit = await creditsCollection.findOneAndUpdate({
        _id: creditId,
        businessEntity: businessEntityId,
        creditor: creditorId 
      }, {
        $set: { isPaid: true }
      })
      
      const filter = {
        _id: businessEntityId
      }
      const update = {
        $inc: { balance: targetCredit!.value!.amount * -1 } 
      }
      await businessEntityCollection.findOneAndUpdate(filter, update)
    });
    
    res.status(200).send(JSON.stringify('Repaid credit'))
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send(JSON.stringify('Error repaying credit'));
  } finally {
    await session.endSession();
  }
});
// DELETE
creditsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const creditId = new ObjectId(req.params.id);
    const businessEntityId = new ObjectId(req.body.token.businessEntity);

    const result = await creditsCollection.deleteOne({
      _id: creditId,
      businessEntity: businessEntityId 
    });

    res.status(200).send('Successfully deleted credit');
  } catch (e: any) {
    console.error(e.message);
    res.status(500).send('Error in deleting credit');
  }
});
