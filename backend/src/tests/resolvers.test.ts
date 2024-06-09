// src/tests/resolvers.test.ts
import request from 'supertest';
import { Express } from 'express';
import { startTestServer } from './testServer';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('GraphQL Resolvers', () => {
  let app: Express;

  beforeAll(async () => {
    app = await startTestServer();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should upload an animation', async () => {
    const response = await request(app)
      .post('/graphql')
      .field('operations', JSON.stringify({
        query: `mutation ($file: Upload!) {
          uploadAnimation(
            id: "12345"
            title: "Test",
            description: "Test Description",
            tags: ["tag1", "tag2"],
            file: $file
          ) {
            id
            title
            url
          }
        }`,
        variables: { file: null }
      }))
      .field('map', JSON.stringify({ '0': ['variables.file'] }))
      .attach('0', join(__dirname, 'test-animation.json'));

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.uploadAnimation).toHaveProperty('id');
    expect(response.body.data.uploadAnimation).toHaveProperty('title', 'Test');
  });
});
