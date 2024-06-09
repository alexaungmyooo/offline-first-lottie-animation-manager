// server.ts
import http from 'http';
import { app, startApolloServer } from './app';
import prisma from './prisma';
import 'dotenv/config';

const SERVER_PORT = process.env.SERVER_PORT || 4000;

const startServer = async () => {
  const httpServer = http.createServer(app);

  const { server } = await startApolloServer(app);

  httpServer.listen(SERVER_PORT, () => {
    console.info(`🚀 Server ready at http://localhost:${SERVER_PORT}${server.graphqlPath}`);
  });

  process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception. Shutting down...');
    console.error(err.name, err.message);
    await prisma.$disconnect();
    process.exit(1);
  });

  process.on('unhandledRejection', async (err) => {
    console.error('Unhandled Rejection. Shutting down...');
    console.error(err);
    httpServer.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  });
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
});
