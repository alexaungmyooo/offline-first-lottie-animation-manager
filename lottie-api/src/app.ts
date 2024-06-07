// app.ts
import express from 'express';
import cors from "cors";
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import prisma from './prisma';
import typeDefs from './schema/typeDefs';
import resolvers from './resolvers';
import path from 'path';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [];

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin))
        return callback(null, true);
      const errMsg =
        "The CORS policy for this site does not allow access from the specified origin.";
      return callback(new Error(errMsg), false);
    },
  })
);

// Serve static files from the uploads directory
console.log(path.join(__dirname, '../uploads'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Adjust the path accordingly

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
