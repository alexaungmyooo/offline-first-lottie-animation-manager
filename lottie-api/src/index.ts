import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import typeDefs from './schema/typeDefs'; 
import resolvers from './resolvers';

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10, overrideSendResponse: false }));

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: () => ({ prisma }),
  });

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
});
