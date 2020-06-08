import mongoose from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';

import { USER_ROLES } from '../src/constants';
import { User, UserModel } from '../src/models/User';

declare global {
  namespace NodeJS {
    interface Global {
      users: {
        getJwtByRole: {
          (role: string): string;
        };
      };
    }
  }
}

before((done) => {
  // Setup connection to a test mongoose DB
  mongoose.connect('mongodb://localhost:27017/emulator-builder-tests', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection
    .once('open', async () => {
      console.log('Connected');

      // create users with different roles to test routes under different roles
      const admin = await UserModel.create({
        name: 'admin',
        email: 'admin@test.test',
        password: '1',
        role: USER_ROLES.ADMIN,
      } as User);
      const creator = await UserModel.create({
        name: 'creator',
        email: 'creator@test.test',
        password: '1',
        role: USER_ROLES.CREATOR,
      } as User);
      const user = await UserModel.create({
        name: 'user',
        email: 'user@test.test',
        password: '1',
        role: USER_ROLES.USER,
      } as User);
      const users = [admin, creator, user];
      global.users = {
        getJwtByRole: (role) => {
          const user = users.find((user) => user.role === role)!;
          return user.getJWT();
        },
      };
      done();
    })
    .on('error', (error) => {
      console.warn('Warning', error);
    });
});

after(async () => {
  // clean all users in test DB
  const collections = await mongoose.connection.db.collections();
  const usersCollection = collections.find(
    (collection) => collection.collectionName === 'users',
  );
  if (usersCollection) {
    usersCollection.deleteMany({});
  }
});

// Cleanup mongoose DB before each test execution
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    if (collection.collectionName === 'users') {
      // don't clean users collections, since we use default users to test authorization
      continue;
    }
    await collection.deleteMany({});
  }
});
