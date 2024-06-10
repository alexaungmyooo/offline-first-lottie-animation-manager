// server.ts
import http from 'http';
import { app, startApolloServer } from './app';
import prisma from './prisma';
import 'dotenv/config';
import { handleUncaughtErrors } from './middleware/errorHandler';


const SERVER_PORT = process.env.SERVER_PORT || 4000;

const startServer = async () => {
  const httpServer = http.createServer(app);

  const { server } = await startApolloServer(app);

  httpServer.listen(SERVER_PORT, () => {
    console.info(`🚀 Server ready at http://localhost:${SERVER_PORT}${server.graphqlPath}`);
  });

  // Handle uncaught exceptions and unhandled promise rejections
  handleUncaughtErrors(httpServer, prisma);
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
});
