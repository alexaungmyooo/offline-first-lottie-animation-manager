// src/resolvers/index.ts
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { GraphQLUpload } from 'graphql-upload-ts';
import { Context, UploadAnimationArgs, SearchAnimationsArgs, GetAnimationArgs } from '../types';

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    searchAnimations: async (_: any, args: SearchAnimationsArgs, context: Context) => {
      const { query, category, tags } = args;
      const where: any = {};
      if (query) {
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { metadata: { contains: query } },
        ];
      }
      if (category) {
        where.category = category;
      }
      if (tags) {
        where.tags = { hasSome: tags };
      }

      return context.prisma.animation.findMany({ where });
    },
    getAnimation: async (_: any, args: GetAnimationArgs, context: Context) => {
      return context.prisma.animation.findUnique({
        where: { id: args.id },
      });
    },
    downloadAnimation: async (_: any, args: GetAnimationArgs, context: Context) => {
      const animation = await context.prisma.animation.findUnique({
        where: { id: args.id },
      });
      if (!animation) throw new Error('Animation not found');
      return animation.url;
    },
  },

  Mutation: {
    uploadAnimation: async (_: any, args: UploadAnimationArgs, context: Context) => {
      // Destructure the file from args
      const { createReadStream, filename } = await args.file;
      const uploadsDir = join(__dirname, '../../uploads');
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir);
      }
      const path = join(uploadsDir, filename);
      await new Promise((resolve, reject) => {
        const writeStream = createWriteStream(path);
        createReadStream().pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const url = `http://localhost:4000/uploads/${filename}`;
      return context.prisma.animation.create({
        data: {
          title: args.title,
          description: args.description,
          tags: args.tags,
          metadata: args.metadata,
          url,
          duration: args.duration,
          category: args.category,
        },
      });
    }
    
  },
};

export default resolvers;
