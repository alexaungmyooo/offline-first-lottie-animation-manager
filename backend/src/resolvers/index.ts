import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLUpload } from 'graphql-upload-ts';
import { Context, UploadAnimationArgs, SearchAnimationsArgs, GetAnimationArgs } from '../types';

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    searchAnimations: async (_: any, args: SearchAnimationsArgs, context: Context) => {
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

    },
    getAnimation: async (_: any, args: GetAnimationArgs, context: Context) => {
      return context.prisma.animation.findUnique({
        where: { id: args.id },
      });
    },
    animationsSince: async (_: any, args: { lastSync: string }, context: Context) => {
      const { lastSync } = args;
      console.log("AnimationsSince ", new Date(lastSync));
      return context.prisma.animation.findMany({
        where: {
          updatedAt: {
            gte: new Date(lastSync),
          },
        },
      });
    },
  },

  Mutation: {
    uploadAnimation: async (_: any, args: UploadAnimationArgs, context: Context) => {
      const { title, description, tags, file } = args;
      const { createReadStream, filename, mimetype } = await file;
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
    }
  },
};

export default resolvers;
