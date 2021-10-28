import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { User } from '../user-defined-types';
import { Request, Response, NextFunction } from 'express';

dotenv.config();
const secret = process.env.AUTH_SECRET || 'replace me with a secret';

export function generateUserAuthToken(user: User) {
  const data = {
    id: user.id,
    username: user.username,
    date: (new Date()).getTime()
  }

  return jwt.sign(data, secret, {});
}

export function verifyUserToken(req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization;

  if (typeof token !== 'undefined') {
		token = token.slice(7, token.length);

    return jwt.verify(token, secret, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(403).send('invalid token')
      } else {
        return next();
      }
    })
  } else {
    console.error('No token received')
    return res.status(403).send('no token');
  }
}