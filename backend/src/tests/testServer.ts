// src/tests/testServer.ts
import { ApolloServer } from 'apollo-server-express';
import express, { Express } from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { PrismaClient } from '@prisma/client';
import typeDefs from '../schema/typeDefs'; 
import resolvers from '../resolvers';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const startTestServer = async (): Promise<Express> => {
  const app = express();

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  const server = new ApolloServer({
    schema,
    context: () => ({ prisma }),
  });

  await server.start();
  server.applyMiddleware({ app });

  return app;
};
