import express from 'express';
// import cors from 'cors';

import { connectToDatabse } from './services/database.service';
import { usersRouter } from './routers/users.router';

const app = express();
const port = 3000;

connectToDatabse()
  .then(() => {
    app.use('/api/users', usersRouter);
    app.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('Database connection failed', error);
    process.exit();
  })