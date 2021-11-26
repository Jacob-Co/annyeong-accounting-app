import express, { Request, Response} from 'express';
import cors from 'cors';

import { connectToDatabse } from './services/database.service';
import { businessEntityRouter } from './routers/business-entities.router';
import { usersRouter } from './routers/users.router';
import { expenseTypeRouter } from './routers/expense-types.router';
import { expensesRouter } from './routers/expenses.router';
import { dailyAccountingRouter } from './routers/daily-accountings.router';
import { creditorsRouter } from './routers/creditors.router';
import { creditsRouter } from './routers/credits.router';
import { distributorsRouter } from './routers/distributor.router';
import { stocksRouter } from './routers/stocks.router';

const app = express();
const port = 3000;

connectToDatabse()
  .then(() => {
    app.use(cors());
    app.get('/', (req: Request, res: Response) => {
      res.status(200).send('Hello there');
    })
    app.use('/api/users', usersRouter);
    app.use('/api/expenseTypes', expenseTypeRouter);
    app.use('/api/businessEntities', businessEntityRouter);
    app.use('/api/expenses', expensesRouter);
    app.use('/api/dailyAccountings', dailyAccountingRouter);
    app.use('/api/creditors', creditorsRouter);
    app.use('/api/credits', creditsRouter);
    app.use('/api/distributors', distributorsRouter);
    app.use('/api/stocks', stocksRouter);

    app.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('Database connection failed', error);
    process.exit();
  })