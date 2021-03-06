import { Expense } from '../models/expenses.model';
import { expensesCollection } from '../services/database.service';
import express, { Request, Response } from 'express';
import { InsertOneResult, ObjectId } from 'mongodb';
import { verifyUserToken } from '../services/auth.service';
import { businessEntityCollection } from '../services/database.service';
import { mongoDBClient } from '../services/database.service';
import { expenseTypesCollection } from '../services/database.service';
import { BusinessEntity } from '../models/business-entities.model';

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

      const populatedResult = await Promise.all(result.map(async expense => {
        const query = { _id: new ObjectId(expense.expenseType.toString())};
        const resultingExpenseType = await expenseTypesCollection.findOne(query);
        return { ...expense, expenseType: resultingExpenseType!.type}
      }));
      
      res.status(200).send(JSON.stringify(populatedResult)); 
    } catch(err: any) {
      console.error(err.message);
      res.status(500).send('Error in getting expenses');
    }
  }
)

// POST
expensesRouter.post('/', async (req: Request, res: Response) => {
  const session = mongoDBClient.startSession();
  try {
    const newExpense = req.body.newExpense as Expense;
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    const userId = new ObjectId(req.body.token.id);

    newExpense.businessEntity = businessEntityId;
    newExpense.user = userId;

    let result: InsertOneResult<Document>

    await session.withTransaction(async () => {
      result = await expensesCollection.insertOne(newExpense);
      const filter = {
        _id: businessEntityId
      }
      const update = {
        $inc: { income: newExpense.price }
      }
      await businessEntityCollection.findOneAndUpdate(filter, update);
    })

    result!.acknowledged
      ? res.status(200).send(JSON.stringify('Created expense'))
      : res.status(400).send(JSON.stringify('Could not create expense'));
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send(JSON.stringify('Error increating expense'));
  } finally {
    session.endSession();
  }
})

// DELETE
expensesRouter.delete('/:id', async (req: Request, res: Response) => {
  const session = mongoDBClient.startSession();
  try {
    const expensesId = new ObjectId(req.params.id);
    const businessEntityId = new ObjectId(req.body.token.businessEntity);
    const findResult = await expensesCollection.findOne({
      _id: expensesId,
      businessEntity: businessEntityId
    });

    if (findResult === null) {
      res.status(400).send('No expense found');
      return;
    }

    await session.withTransaction(async () => {
      await expensesCollection.deleteOne({
        _id: expensesId,
        businessEntity: businessEntityId
      });

      const filter = {
        _id: businessEntityId
      }

      const { incomePercent } = await businessEntityCollection
        .findOne(filter) as BusinessEntity;
      
      const update = {
        $inc: {
          income: findResult.price * -1
        }
      }

      await businessEntityCollection.updateOne(filter, update);
    })

    res.status(200).send('Successfully delete expense');
  } catch (e: any) {
    console.error(e.message);
    res.status(500).send('Error deleting expense');
  } finally {
    session.endSession();
  }
})

// POST
// expensesRouter.post('/batch', async (req: Request, res: Response) => {
//   try {
//     const newExpenses = req.body.newExpenses as Expense[];
//     const businessEntity = new ObjectId(req.body.token.businessEntity);
//     const userId = new ObjectId(req.body.token.id)
//     for (const newExpense of newExpenses) {
//       newExpense.user = userId;
//       newExpense.businessEntity = businessEntity;
//       newExpense.expenseType = new ObjectId(newExpense.expenseType.toString());
//     }
//     const result = await expensesCollection.insertMany(newExpenses);
    
//     result.acknowledged
//       ? res.status(200).send(JSON.stringify('Added new expenses'))
//       : res.status(400).send('Error in saving new expenses');
//   } catch(err: any) {
//     console.error(err.message);
//     res.status(500).send(JSON.stringify('Error in creating an expense'));
//   }
// })