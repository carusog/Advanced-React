import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: { fields: ['name', 'email', 'password'] },
  // TODO: Add in initial roles here
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        console.log('☎️  connected to database');
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      // TODO: schema items to go here
      User,
      Product,
      ProductImage,
    }),
    ui: {
      // TODO: change this for roles
      isAccessAllowed: ({ session }) =>
        // console.log(session);
        Boolean(session && 'data' in session),
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id name email',
    }),
  })
);
