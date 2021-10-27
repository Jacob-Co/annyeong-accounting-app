import bcrypt from 'bcrypt';

import { findOneUser, createUser } from "../data-access/users.data-access";
import User from '../models/users.model';
import { generateUserAuthToken } from '../services/auth.service';

export interface loginCredentials {
  username: string,
  password: string
}

export interface loginResult {
  isSucess: boolean,
  token?: string
}

export async function register(newUser: User): Promise<boolean> {
  newUser.password = bcrypt.hashSync(newUser.password, 10);
  const createUserResult = await createUser(newUser);
  return createUserResult.acknowledged;
}

export async function login(credentials: loginCredentials): Promise<loginResult> {
  const userFindQuery = { username: credentials.username };
  const userFound = await findOneUser(userFindQuery);
  if (userFound === null) {
    return { isSucess: false }
  }

  const isPasswordMatching = bcrypt.compareSync(credentials.password, userFound.password);
  
  if(isPasswordMatching) {
    return { 
      isSucess: true,
      token: generateUserAuthToken(userFound)
    }
  }

  return {isSucess: false}
}