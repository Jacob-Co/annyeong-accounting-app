import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { expenseTypesCollection } from '../services/database.service';
import { ExpenseType } from '../models/expense-types.model';

export const expenseTypeRouter = express.Router();
expenseTypeRouter.use(express.json());

//GET
expenseTypeRouter.get('/all', async (req: Request, res: Response) => {
  try {
    const allExpenseTypes = await expenseTypesCollection.find({});
    res.status(200).send(allExpenseTypes);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Could not get expense types');
  }
})

//POST
expenseTypeRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newExpenseType = req.body as ExpenseType;
    const result = await expenseTypesCollection.insertOne(newExpenseType);

    result.acknowledged
      ? res.status(200).send('Expense Type succesfully added')
      : res.status(400).send('Error in inserting expense type');
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error creating expense type');
  }
})
