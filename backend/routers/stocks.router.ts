import { ObjectId, InsertOneResult } from 'mongodb';
import express, { Request, Response } from 'express';
import { Stock } from '../models/stocks.model';
import { verifyUserToken } from '../services/auth.service';
import { 
  stocksCollection,
  mongoDBClient, 
  businessEntityCollection,
  distributorsCollection 
} from '../services/database.service';
import { BusinessEntity } from '../models/business-entities.model';

export const stocksRouter = express.Router();
stocksRouter.use(express.json());
stocksRouter.use(verifyUserToken);

// GET 
stocksRouter.get('/:startUnix/:endUnix/:distributorId', 
  async (req: Request, res: Response) => {
    try {
      const businessEntity = new ObjectId(req.body.token.businessEntity);
      const startUnix = Number(req.params.startUnix);
      const endUnix = Number(req.params.endUnix);
      const distributorId = req.params.distributorId;

      const query = (distributorId === '0')
        ? {businessEntity, date: {$gte: startUnix, $lte: endUnix}}
        : {distributor: new ObjectId(distributorId), businessEntity, date: {$gte: startUnix, $lte: endUnix}}
      
      const result = await stocksCollection.find(query).toArray() as Stock[];
      
      const populatedResult = await Promise.all(result.map(async stock => {
        const query = { _id: new ObjectId(stock.distributor.toString())};
        const resultingDistributor = await distributorsCollection.findOne(query);
        return { ...stock, distributor: resultingDistributor!.name}
      }))
      
      res.status(200).send(JSON.stringify(populatedResult));
    } catch(err: any) {
      console.error(err.message);
      res.status(500).send('Error in getting credits');
    }
  }
)

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

// DELETE
stocksRouter.delete('/:id', async (req: Request, res: Response) => {
  const session = mongoDBClient.startSession();
  try {
    const stockId = new ObjectId(req.params.id);
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    const stock = await stocksCollection.findOne({
      _id: stockId,
      businessEntity: businessEntityId
    });

    if (stock === null) {
      res.status(400).send('No stock found');
      return;
    }

    await session.withTransaction(async () => {
      await stocksCollection.deleteOne({
        _id: stockId,
        businessEntity: businessEntityId
      });

      const filter = {
        _id: businessEntityId
      }

      const { capitalPercent } = await businessEntityCollection
        .findOne(filter) as BusinessEntity;
      
      const update = {
        $inc: {
          capital: stock.price * -1
        }
      }

      await businessEntityCollection.updateOne(filter, update);
    });

    res.status(200).send('Successfully deleted stock');
  } catch (e: any) {
    console.error(e.message);
    res.status(500).send('Error in deleting stock');
  } finally {
    session.endSession();
  }
})