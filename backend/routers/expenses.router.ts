import { Expense } from '../models/expenses.model';
import { expensesCollection } from '../services/database.service';
import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { verifyUserToken } from '../services/auth.service';

export const expensesRouter = express.Router();
expensesRouter.use(express.json());
expensesRouter.use(verifyUserToken);

// GET
expensesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const businessEntity = new ObjectId(req.body.token.businessEntity);
    const id = new ObjectId(req.params.id);
    const result = await expensesCollection.findOne({ _id: id, businessEntity }) as Expense;
    result
      ? res.status(200).send(result)
      : res.status(400).send('Could not find an expense with that id');
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error in getting expense');
  }
});

expensesRouter.get('/:startUnix/:endUnix/:expenseTypeId', 
  async (req: Request, res: Response) => {
    try {
      const businessEntity = new ObjectId(req.body.token.businessEntity);
      const startUnix = Number(req.params.startUnix);
      const endUnix = Number(req.params.endUnix);
      const expenseTypeId = req.params.expenseTypeId;
      const query = (expenseTypeId !== '0')
        ? { expenseType: new ObjectId(expenseTypeId), businessEntity, date: {$gte: startUnix, $lte: endUnix}}
        : { businessEntity, date: {$gte: startUnix, $lte: endUnix}}
      const result = await expensesCollection.find(query).toArray() as Expense[];
      res.status(200).send(result); 
    } catch(err: any) {
      console.error(err.message);
      res.status(500).send('Error in getting expenses');
    }
  }
)

// POST
expensesRouter.post('/batch', async (req: Request, res: Response) => {
  try {
    const newExpenses = req.body.newExpenses as Expense[];
    const businessEntity = new ObjectId(req.body.token.businessEntity);
    for (const newExpense of newExpenses) {
      newExpense.businessEntity = businessEntity;
      newExpense.expenseType = new ObjectId(newExpense.expenseType.toString());
    }
    const result = await expensesCollection.insertMany(newExpenses);
    
    result.acknowledged
      ? res.status(200).send('Added new expenses')
      : res.status(400).send('Error in saving new expenses');
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Error in creating an expense');
  }
})