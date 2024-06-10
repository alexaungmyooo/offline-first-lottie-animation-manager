// app.ts
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import prisma from './prisma';
import typeDefs from './schema/typeDefs';
import resolvers from './resolvers';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import 'dotenv/config'; // Ensure environment variables are loaded

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [];
const isDevelopment = process.env.NODE_ENV === 'development';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      const errMsg = "The CORS policy for this site does not allow access from the specified origin.";
      return callback(new Error(errMsg), false);
    },
  })
);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Adjust the path accordingly

app.use(graphqlUploadExpress({ maxFileSize: 20000000, maxFiles: 10, overrideSendResponse: false }));

const startApolloServer = async (app: express.Express) => {
  const server = new ApolloServer({
    schema,
    context: () => ({ prisma }),
    formatError: (error) => {
      const formattedError = {
        message: error.message,
        code: error.extensions?.code,
      };

      if (isDevelopment) {
        return {
          ...formattedError,
          stack: error.extensions?.exception?.stacktrace || [],
        };
      }

      return formattedError;
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Error handling middleware should be added after all other middleware and routes
  app.use(errorHandler);

  return { app, server };
};

export { app, startApolloServer };
