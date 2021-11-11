import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { businessEntityCollection } from '../services/database.service';
import { BusinessEntity } from '../models/business-entities.model';
import { verifyUserToken } from '../services/auth.service';
import { getBusinessEntityRes } from '../../types/api-response-types';

export const businessEntityRouter = express.Router();
businessEntityRouter.use(express.json());

// get
businessEntityRouter.get('/', verifyUserToken, async (req: Request, res: Response) => {
  try {
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    const result = await businessEntityCollection.findOne({ _id: businessEntityId});
    if (result) {
      const response = {
        name: result!.name,
        capital: result!.capital,
        capitalPercent: result!.capitalPercent,
        incomePercent: result!.incomePercent
      } as getBusinessEntityRes

      res.status(200).send(JSON.stringify(response));
    } else {
      res.status(400).send('Could not find business entity'); 
    }
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send(JSON.stringify('Error in getting business entity'));
  }
})

// create new
businessEntityRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newBusinessEntity = req.body as BusinessEntity;
    const totalPercent = newBusinessEntity.incomePercent 
      + newBusinessEntity.capitalPercent;
    if (totalPercent !== 100) return res.status(500).send('Total percent does not equal 100');
    const result = await businessEntityCollection.insertOne(newBusinessEntity);
    console.log(result);

    result
      ? res.status(201).send('Successfully created new Business Entity')
      : res.status(400).send('Failed to create new Business Entity')
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error in creating Business Entity');
  }
});

//update name
businessEntityRouter.patch('/name/:id', async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const name = req.body.name;
    const query = { _id: id }

    const result = await businessEntityCollection.updateOne(query, {$set: { name }});

    result
      ? res.status(200).send('Successfully updated Business Entity')
      : res.status(400).send(`Business Entity was not updated`);
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Failed to update Business Entity name');
  }
});

//update incomePercent
businessEntityRouter.patch('/incomePercent/:id', async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const incomePercent = req.body.incomePercent;
    if (incomePercent > 100) return res.status(400).send('Income share is greater than 1');
    const capitalPercent = 100 - incomePercent;
    const query = { _id: id };

    const result = await businessEntityCollection
      .updateOne(query, { $set: { incomePercent, capitalPercent }});

    result
      ? res.status(200).send('Successfully updated incomePercent')
      : res.status(400).send('Business Entity was not updated');

  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Failed to update Business Entity income share');
  }
});

//update currentCapital
businessEntityRouter.patch('/capital/:id', async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const capital = req.body.capital
    const query = { _id: id };

    const result = await businessEntityCollection
      .updateOne(query, { $set: { capital }});

    result
      ? res.status(200).send('Successfully updated capital')
      : res.status(400).send('Business Entity was not updated');

  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Failed to update Business Entity income share');
  }
});
