// app.ts
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import prisma from './prisma';
import typeDefs from './schema/typeDefs';
import resolvers from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10, overrideSendResponse: false }));

const startApolloServer = async (app: express.Express) => {
  const server = new ApolloServer({
    schema,
    context: () => ({ prisma }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  return { app, server };
};

export { app, startApolloServer };
