import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../user-defined-types';
import { Request, Response, NextFunction } from 'express';

export class AuthService {
  private static readonly secret = process.env.AUTH_SECRET || 'replace me with a secret';

  public static generateUserAuthToken(user:User): string {
    const data = {
      id: user.id,
      username: user.username,
      date: (new Date()).getTime()
    }
  
    return jwt.sign(data, AuthService.secret, {});
  }

  public static verifyUserToken(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization;
  
    if (typeof token !== 'undefined') {
      token = token.slice(7, token.length);
  
      return jwt.verify(token, AuthService.secret, (err, data) => {
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
}