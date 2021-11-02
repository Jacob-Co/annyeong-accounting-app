import { User } from '../user-defined-types';
import { register } from '../controllers/users.controller';
import * as UserDataAccess from '../data-access/users.data-access';
import { DbOptions, InsertOneResult } from 'mongodb';
import exp from 'constants';


describe('users.controller', () => {
  describe('register', () => {
    it('should return true if the email give is not yet in use', async () => {
      const testResult = { acknowledged: true } as InsertOneResult<Document>
      jest.spyOn(UserDataAccess, 'createUser').mockResolvedValue(testResult);
      const testUser = {
        firstName: 'Jacob',
        lastName: 'Co',
        username: 'jco',
        password: '123456',
        isAdmin: true
      } as User;

      const registerResult = await register(testUser);

      expect(registerResult).toBe(true);
    });
  })
})