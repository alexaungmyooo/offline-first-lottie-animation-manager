// src/resolvers.ts
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLUpload } from 'graphql-upload-ts';
import { Context, UploadAnimationArgs, SearchAnimationsArgs, GetAnimationArgs } from '../types';
import { UserInputError, InternalServerError } from '../errors';
import logger from '../logger';

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    searchAnimations: async (_: any, args: SearchAnimationsArgs, context: Context) => {
      try {
        const { query, tags } = args;
        const where: any = {};
        if (query) {
          where.OR = [
            { title: { contains: query.toLowerCase() } },
            { description: { contains: query.toLowerCase() } },
          ];
        }

        if (tags) {
          where.tags = { hasSome: tags };
        }

        return context.prisma.animation.findMany({ where });
      } catch (error) {
        logger.error('Error in searchAnimations: %o', error);
        throw new InternalServerError('Failed to search animations.');
      }
    },
    getAnimation: async (_: any, args: GetAnimationArgs, context: Context) => {
      try {
        return context.prisma.animation.findUnique({
          where: { id: args.id },
        });
      } catch (error) {
        logger.error('Error in getAnimation: %o', error);
        throw new InternalServerError('Failed to get animation.');
      }
    },
    animationsSince: async (_: any, args: { lastSync: string }, context: Context) => {
      try {
        const { lastSync } = args;
        return context.prisma.animation.findMany({
          where: {
            updatedAt: {
              gte: new Date(lastSync),
            },
          },
        });
      } catch (error) {
        logger.error('Error in animationsSince: %o', error);
        throw new InternalServerError('Failed to get animations since last sync.');
      }
    },
  },

  Mutation: {
    uploadAnimation: async (_: any, args: UploadAnimationArgs, context: Context) => {
      try {
        const { title, description, tags, file } = args;
        const { createReadStream, filename, mimetype } = await file;

        if (mimetype !== 'application/json') {
          throw new UserInputError('Invalid file type. Only JSON files are allowed.');
        }

        const uploadsDir = join(__dirname, '../../uploads');
        if (!existsSync(uploadsDir)) {
          mkdirSync(uploadsDir);
        }
        const uuid = uuidv4();
        const newFilename = `${uuid}-${filename}`;
        const fileLocation = join(uploadsDir, newFilename);

        // Save the file to the file system
        await new Promise((resolve, reject) => {
          const writeStream = createWriteStream(fileLocation);
          createReadStream().pipe(writeStream);
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });

        // Extract metadata from the JSON file
        const fileContent: string = await new Promise((resolve, reject) => {
          const chunks: any[] = [];
          createReadStream()
            .on('data', (chunk) => chunks.push(chunk))
            .on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
            .on('error', reject);
        });

        const jsonData = JSON.parse(fileContent);

        const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
        const url = `${baseUrl}/uploads/${newFilename}`;

        // Create the animation record in the database
        return context.prisma.animation.create({
          data: {
            title,
            description,
            tags: tags, // Store tags as JSON
            metadata: jsonData,
            url,
          },
        });
      } catch (error) {
        logger.error('Error in uploadAnimation: %o', error);
        if (error instanceof SyntaxError) {
          throw new UserInputError('Invalid JSON file.');
        } else {
          throw new InternalServerError('Failed to upload animation.');
        }
      }
    },
  },
};

export default resolvers;

