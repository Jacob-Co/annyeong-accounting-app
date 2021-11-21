import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { distributorsCollection } from '../services/database.service';
import { Distributor } from '../models/distributor.model';
import { verifyUserToken } from '../services/auth.service';

export const distributorsRouter = express.Router();
distributorsRouter.use(express.json());
distributorsRouter.use(verifyUserToken);

// GET ALL
distributorsRouter.get('/all', async (req: Request, res: Response) => {
  try {
    const businessEntityID = new ObjectId(req.body.token.businessEntity);
    const result = await distributorsCollection
      .find({ businessEntity: businessEntityID})
      .toArray() as Distributor[]
   
    res.status(200).send(JSON.stringify(result));
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send(JSON.stringify('Error getting all distributors'));
  }
});

// POST
distributorsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newDistributor = req.body.distributor as Distributor;
    const businessEntityID = new ObjectId(req.body.token.businessEntity);

    newDistributor.businessEntity = businessEntityID;

    const result = await distributorsCollection.insertOne(newDistributor);

    result.acknowledged
      ? res.status(200).send(JSON.stringify('Created distributor'))
      : res.status(400).send(JSON.stringify('Could not create distributor'));
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send(JSON.stringify('Error creating distributor'));
  }
});