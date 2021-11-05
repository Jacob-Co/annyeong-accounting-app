import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { expenseTypesCollection } from '../services/database.service';
import { ExpenseType } from '../models/expense-types.model';
import { verifyUserToken } from '../services/auth.service';

export const expenseTypeRouter = express.Router();
expenseTypeRouter.use(express.json());
expenseTypeRouter.use(verifyUserToken);
//GET
expenseTypeRouter.get('/all', async (req: Request, res: Response) => {
  try {
    const businessEntity = new ObjectId(req.body.token.businessEntity);
    const allExpenseTypes = await expenseTypesCollection
      .find({ businessEntity }).toArray() as ExpenseType[];
    res.status(200).send(allExpenseTypes);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Could not get expense types');
  }
})

//POST
expenseTypeRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newExpenseType = req.body.newExpenseType as ExpenseType;
    newExpenseType.businessEntity = new ObjectId(req.body.token.businessEntity);
    const result = await expenseTypesCollection.insertOne(newExpenseType);

    result.acknowledged
      ? res.status(200).send('Expense Type succesfully added')
      : res.status(400).send('Error in inserting expense type');
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error creating expense type');
  }
})
