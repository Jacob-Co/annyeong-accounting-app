import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../user-defined-types';
import { Request, Response, NextFunction } from 'express';

const secret = process.env.AUTH_SECRET || 'replace me with a secret';

export function generateUserAuthToken(user:User): string {
  const userDetails = user as any;
  delete userDetails.password
  userDetails.date = (new Date()).getTime()

  return jwt.sign(userDetails, secret, {});
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

export function verifyAdminToken(req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization;

  if (typeof token !== 'undefined') {
    token = token.slice(7, token.length);

    return jwt.verify(token, secret, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(403).send('invalid token')
      } else {
        if (data && data.isAdmin) return next();
        return res.status(403).send('Not an admin token');
      }
    })
  } else {
    console.error('No token received')
    return res.status(403).send('no token');
  }
}