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
            title: "Test",
            description: "Test Description",
            tags: ["tag1", "tag2"],
            metadata: "{}",
            file: $file,
            duration: 100,
            category: "Test"
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

  it('should download an animation', async () => {
    // First, upload an animation to get a valid ID
    const uploadResponse = await request(app)
      .post('/graphql')
      .field('operations', JSON.stringify({
        query: `mutation ($file: Upload!) {
          uploadAnimation(
            title: "Test",
            description: "Test Description",
            tags: ["tag1", "tag2"],
            metadata: "{}",
            file: $file,
            duration: 100,
            category: "Test"
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

    const animationId = uploadResponse.body.data.uploadAnimation.id;

    const downloadResponse = await request(app).post('/graphql')
      .send({
        query: `query ($id: Int!) {
          downloadAnimation(id: $id)
        }`,
        variables: { id: animationId }
      });

    expect(downloadResponse.body.errors).toBeUndefined();
    expect(downloadResponse.body.data.downloadAnimation).toMatch(/^http:\/\/localhost:4000\/uploads\//);
  });
});
